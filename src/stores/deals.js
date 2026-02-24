import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  mockDeals,
  mockDisputes,
  ESCROW_STATUS,
  ESCROW_STATUS_LABELS,
  PAYMENT_STATUS,
  formatPrice,
} from "@/data/mock";
import { useNotificationsStore } from "./notifications";

export const useDealsStore = defineStore("deals", () => {
  const deals = ref([...mockDeals]);
  const disputes = ref([...mockDisputes]);

  function getDealById(id) {
    return deals.value.find((d) => d.id === id);
  }

  function getDealsByTenant(tenantId) {
    return deals.value.filter((d) => d.tenantId === tenantId);
  }

  function getDealsByOwner(ownerId) {
    return deals.value.filter((d) => d.ownerId === ownerId);
  }

  // Get deals waiting for homeowner confirmation
  function getDealsToConfirm(userId) {
    return deals.value.filter(
      (d) =>
        d.ownerId === userId &&
        d.escrowStatus === ESCROW_STATUS.AWAITING_OWNER_CONFIRM,
    );
  }

  function getDisputeByDeal(dealId) {
    return disputes.value.find((d) => d.dealId === dealId);
  }

  const pendingOwnerConfirm = computed(() => {
    return deals.value.filter(
      (d) => d.escrowStatus === ESCROW_STATUS.AWAITING_OWNER_CONFIRM,
    );
  });

  const activeDeals = computed(() => {
    return deals.value.filter(
      (d) =>
        ![
          ESCROW_STATUS.RELEASED,
          ESCROW_STATUS.REFUNDED,
          ESCROW_STATUS.CANCELLED,
        ].includes(d.escrowStatus),
    );
  });

  const openDisputes = computed(() => {
    return disputes.value.filter((d) => !d.adminDecision);
  });

  // helper to get the notification store inside actions to avoid initialization issues
  function getNotifStore() {
    return useNotificationsStore();
  }

  function createDeal(dealData) {
    const newDeal = {
      ...dealData,
      id: "d" + (deals.value.length + 1),
      escrowStatus: ESCROW_STATUS.AWAITING_OWNER_CONFIRM,
      createdAt: new Date().toISOString(),
      confirmDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      checkinDeadline: null,
      history: [
        {
          status: ESCROW_STATUS.CREATED,
          at: new Date().toISOString(),
          note: "Bron yaratildi",
        },
        {
          status: ESCROW_STATUS.AWAITING_OWNER_CONFIRM,
          at: new Date().toISOString(),
          note: "Kutilmoqda",
        },
      ],
    };
    deals.value.unshift(newDeal);

    // Notify the listing owner that a new booking needs confirmation
    const targetRoute = `/owner/bookings?dealId=${newDeal.id}`;

    getNotifStore().addNotification({
      userId: newDeal.ownerId,
      title: "Yangi bron so'rovi",
      message: `Ijarachi sizning uyingizni bron qildi. Ijara narxi: ${formatPrice(newDeal.rentAmount)}. Tasdiqlashingiz kutilmoqda.`,
      type: "warning",
      link: targetRoute,
    });

    return newDeal.id;
  }

  function updateDealStatus(dealId, newStatus, note = "") {
    const deal = deals.value.find((d) => d.id === dealId);
    if (!deal) return;

    deal.escrowStatus = newStatus;
    deal.history.push({
      status: newStatus,
      at: new Date().toISOString(),
      note: note || ESCROW_STATUS_LABELS[newStatus],
    });

    if (newStatus === ESCROW_STATUS.CONFIRMED) {
      deal.confirmedAt = new Date().toISOString();
      deal.checkinDeadline = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString();
      // Auto-transition to FUNDS_HELD
      deal.escrowStatus = ESCROW_STATUS.FUNDS_HELD;
      deal.history.push({
        status: ESCROW_STATUS.FUNDS_HELD,
        at: new Date().toISOString(),
        note: "Mablag' platformada ushlab turildi",
      });
      // Then to CHECKIN_PENDING
      deal.escrowStatus = ESCROW_STATUS.CHECKIN_PENDING;
      deal.history.push({
        status: ESCROW_STATUS.CHECKIN_PENDING,
        at: new Date().toISOString(),
        note: "Ko'chib kirish kutilmoqda",
      });

      // Notify Tenant
      getNotifStore().addNotification({
        userId: deal.tenantId,
        title: "Bron tasdiqlandi \uD83C\uDF89",
        message: `Tabriklaymiz! Sizning broningiz tasdiqlandi. Ko'chib kirish vaqti keldi.`,
        type: "success",
        link: `/tenant/escrow/${deal.id}`,
      });
    } else if (
      newStatus === ESCROW_STATUS.CANCELLED ||
      newStatus === ESCROW_STATUS.REFUNDED
    ) {
      // Notify Tenant of rejection/cancellation
      getNotifStore().addNotification({
        userId: deal.tenantId,
        title: "Bron bekor qilindi",
        message: `Sizning broningiz bekor qilindi yoki tasdiqlanmadi. Pulingiz tez orada qaytariladi.`,
        type: "warning",
      });
    }

    if (newStatus === ESCROW_STATUS.RELEASED) {
      deal.releasedAt = new Date().toISOString();
      // Transition to active rental after 1st month release
      deal.escrowStatus = ESCROW_STATUS.RENTAL_ACTIVE;
      deal.agreementDate = new Date().toISOString();

      // Initialize 1st payment as PAID if it's new
      if (!deal.payments || deal.payments.length === 0) {
        deal.payments = [
          {
            id: `p${deal.id}_1`,
            month: new Date().toISOString().slice(0, 7),
            amount: deal.total,
            status: PAYMENT_STATUS.PAID,
            type: "first_month",
            paidAt: new Date().toISOString(),
          },
        ];
      }

      deal.history.push({
        status: ESCROW_STATUS.RENTAL_ACTIVE,
        at: new Date().toISOString(),
        note: "Ijara shartnomasi faollashtirildi",
      });

      // Notify Owner that funds are released
      getNotifStore().addNotification({
        userId: deal.ownerId,
        title: "To'lov o'tkazildi \uD83D\uDCB0",
        message: `Ijarachi ko'chib kirdi. 1-oyi uchun to'lov platformadan hisobingizga o'tkazildi.`,
        type: "payment",
      });
    }
  }

  function payInstallment(dealId, installmentId) {
    const deal = deals.value.find((d) => d.id === dealId);
    if (!deal) return;
    const inst = deal.payments.find((p) => p.id === installmentId);
    if (!inst) return;

    inst.status = PAYMENT_STATUS.PAID;
    inst.paidAt = new Date().toISOString();

    deal.history.push({
      status: deal.escrowStatus,
      at: new Date().toISOString(),
      note: `${inst.month} oyi uchun to'lov qabul qilindi`,
    });

    // Notify Owner of monthly receipt
    getNotifStore().addNotification({
      userId: deal.ownerId,
      title: "Ijara to'lovi qabul qilindi \uD83D\uDCB0",
      message: `Ijarachi ${inst.month} oyi uchun ${formatPrice(inst.amount)} to'lovni muvaffaqiyatli amalga oshirdi.`,
      type: "payment",
    });
  }

  function confirmCheckin(dealId) {
    updateDealStatus(
      dealId,
      ESCROW_STATUS.RELEASED,
      "Ijarachi ko'chib kirdi — 1-oy mablag'i chiqarildi",
    );
  }

  function reportProblem(dealId, reason, evidence = []) {
    updateDealStatus(
      dealId,
      ESCROW_STATUS.DISPUTE_OPEN,
      "Ijarachi muammo bildirdi",
    );
    disputes.value.push({
      id: "disp" + (disputes.value.length + 1),
      dealId,
      reason,
      evidence,
      adminDecision: null,
      decisionAt: null,
      createdAt: new Date().toISOString(),
    });
  }

  function resolveDispute(disputeId, decision) {
    const dispute = disputes.value.find((d) => d.id === disputeId);
    if (!dispute) return;

    dispute.adminDecision = decision; // 'refund_full', 'refund_partial', 'release'
    dispute.decisionAt = new Date().toISOString();

    const deal = deals.value.find((d) => d.id === dispute.dealId);
    if (!deal) return;

    if (decision === "release") {
      updateDealStatus(
        deal.id,
        ESCROW_STATUS.RELEASED,
        "Admin qaror: mablag' chiqarildi",
      );
    } else {
      updateDealStatus(
        deal.id,
        ESCROW_STATUS.REFUNDED,
        `Admin qaror: ${decision === "refund_full" ? "to'liq" : "qisman"} qaytarildi`,
      );
    }
  }

  // Stats
  const totalDeals = computed(() => deals.value.length);
  const totalReleased = computed(
    () =>
      deals.value.filter((d) =>
        [ESCROW_STATUS.RELEASED, ESCROW_STATUS.RENTAL_ACTIVE].includes(
          d.escrowStatus,
        ),
      ).length,
  );
  const totalDisputes = computed(() => disputes.value.length);

  return {
    deals,
    disputes,
    getDealById,
    getDealsByTenant,
    getDealsByOwner,
    getDealsToConfirm,
    getDisputeByDeal,
    pendingOwnerConfirm,
    activeDeals,
    openDisputes,
    createDeal,
    updateDealStatus,
    payInstallment,
    confirmCheckin,
    reportProblem,
    resolveDispute,
    totalDeals,
    totalReleased,
    totalDisputes,
  };
});
