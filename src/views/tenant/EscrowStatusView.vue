<template>
  <div class="page bg-white" v-if="deal">
    <AppHeader title="Bron holati" />

    <div class="px-4 py-4">
      <!-- Status card -->
      <div class="text-center py-2 mb-4">
        <div
          class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2"
          :class="statusBgClass"
        >
          <component :is="statusIcon" :size="28" :class="statusIconClass" />
        </div>
        <StatusBadge :status="deal.escrowStatus" />
        <p
          class="text-sm text-[var(--color-text-secondary)] mt-2 max-w-[260px] mx-auto"
        >
          {{ statusDescription }}
        </p>
      </div>

      <!-- Action buttons for CHECKIN_PENDING -->
      <div
        v-if="deal.escrowStatus === 'CHECKIN_PENDING'"
        class="space-y-3 mb-4"
      >
        <div class="grid grid-cols-2 gap-2">
          <button @click="confirmCheckin" class="btn-primary rounded-xl">
            <CheckCircle :size="18" /> Tasdiqlayman
          </button>
          <button @click="showDisputeForm = true" class="btn-danger rounded-xl">
            <AlertCircle :size="18" /> Muammo bor
          </button>
        </div>
      </div>

      <!-- Dispute form -->
      <div
        v-if="showDisputeForm"
        class="border border-[var(--color-border)] rounded-xl p-4 mb-6"
      >
        <h4 class="font-semibold text-sm mb-3">Muammo haqida ma'lumot</h4>
        <textarea
          v-model="disputeReason"
          placeholder="Muammoni batafsil yozing..."
          class="input-field min-h-[100px] resize-none mb-3"
        ></textarea>
        <div class="flex gap-2">
          <button
            @click="submitDispute"
            class="btn-primary flex-1"
            :disabled="!disputeReason.trim()"
          >
            Yuborish
          </button>
          <button @click="showDisputeForm = false" class="btn-secondary flex-1">
            Bekor
          </button>
        </div>
      </div>

      <!-- Listing info -->
      <div
        v-if="listing"
        class="flex gap-3 p-3 border border-[var(--color-border)] rounded-xl mb-5"
      >
        <img
          :src="listing.photos[0]"
          class="w-16 h-16 rounded-lg object-cover shrink-0"
        />
        <div class="min-w-0 flex flex-col justify-center">
          <p class="font-semibold text-sm truncate">{{ listing.title }}</p>
          <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">
            {{ listing.address }}
          </p>
        </div>
      </div>

      <!-- Payment breakdown -->
      <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4 mb-5">
        <h4
          class="text-sm font-semibold mb-3 text-[var(--color-text-secondary)]"
        >
          To'lov tafsilotlari
        </h4>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Ijara</span>
            <span class="font-medium">{{ formatPrice(deal.rentAmount) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Platforma xizmati</span>
            <span class="font-medium">{{ formatPrice(deal.platformFee) }}</span>
          </div>
          <div class="h-px bg-[var(--color-border)] my-1"></div>
          <div class="flex justify-between font-semibold">
            <span>Jami</span>
            <span>{{ formatPrice(deal.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <h3 class="font-semibold mb-3">Jarayon tarixi</h3>
      <div class="space-y-0">
        <div v-for="(h, i) in deal.history" :key="i" class="flex gap-3">
          <div class="flex flex-col items-center">
            <div
              class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
              :class="
                i === deal.history.length - 1
                  ? 'bg-[var(--color-primary)]'
                  : 'bg-[var(--color-border-dark)]'
              "
            ></div>
            <div
              v-if="i < deal.history.length - 1"
              class="w-px flex-1 bg-[var(--color-border)] my-1"
            ></div>
          </div>
          <div class="pb-4">
            <p class="text-sm font-medium">{{ h.note }}</p>
            <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              {{ formatTime(h.at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Deadline info -->
      <div
        v-if="deal.checkinDeadline && deal.escrowStatus === 'CHECKIN_PENDING'"
        class="flex gap-3 p-3 bg-[var(--color-warning-light)] rounded-xl mt-4"
      >
        <Clock :size="16" class="text-[var(--color-warning)] shrink-0 mt-0.5" />
        <p class="text-xs text-[var(--color-warning)]">
          Ko'chib kirish muddati: 24 soat ichida tasdiqlang yoki muammo
          bildiring. Aks holda mablag' avtomatik chiqariladi.
        </p>
      </div>

      <!-- Active Rental Features -->
      <div
        v-if="deal.escrowStatus === ESCROW_STATUS.RENTAL_ACTIVE"
        class="mt-2 space-y-4"
      >
        <!-- Agreement Link -->
        <router-link
          :to="`/shared/agreement/${deal.id}`"
          class="flex items-center justify-between p-3 bg-white border border-[var(--color-border)] rounded-xl no-underline hover:bg-[var(--color-bg-secondary)]"
        >
          <div class="flex items-center gap-3">
            <FileText :size="20" class="text-[var(--color-primary)]" />
            <div>
              <p class="text-sm font-bold text-[var(--color-text)]">
                Raqamli shartnoma
              </p>
              <p class="text-[10px] text-[var(--color-text-tertiary)]">
                {{ formatDate(deal.agreementDate) }} da tuzilgan
              </p>
            </div>
          </div>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>

        <PaymentLedger
          :payments="deal.payments"
          showAction
          @pay="handlePayInstallment"
        />
      </div>

      <!-- Payment Confirmation Drawer -->
      <PaymentDrawer
        :is-open="isPaymentDrawerOpen"
        :amount="selectedInstallment?.amount"
        :month="formatMonth(selectedInstallment?.month)"
        @close="isPaymentDrawerOpen = false"
        @confirm="handleConfirmPayment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useDealsStore } from "@/stores/deals";
import { useListingsStore } from "@/stores/listings";
import { formatPrice, formatDate, ESCROW_STATUS } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import PaymentLedger from "@/components/PaymentLedger.vue";
import PaymentDrawer from "@/components/PaymentDrawer.vue";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  XCircle,
  ArrowRight,
  FileText,
  ChevronRight,
} from "lucide-vue-next";

const route = useRoute();
const dealsStore = useDealsStore();
const listingsStore = useListingsStore();

const deal = computed(() => dealsStore.getDealById(route.params.id));
const listing = computed(() =>
  deal.value ? listingsStore.getListingById(deal.value.listingId) : null,
);

const showDisputeForm = ref(false);
const disputeReason = ref("");

const isPaymentDrawerOpen = ref(false);
const selectedInstallment = ref(null);

const statusDescription = computed(() => {
  const map = {
    CREATED: "Bron yaratildi. To'lov kutilmoqda.",
    AWAITING_OWNER_CONFIRM: "Uy egasi 2 soat ichida tasdiqlashi kerak.",
    CONFIRMED: "Uy egasi tasdiqladi.",
    FUNDS_HELD: "Mablag'ingiz platformada xavfsiz saqlanmoqda.",
    CHECKIN_PENDING: "Ko'chib kirganingizni tasdiqlang yoki muammo bildiring.",
    DISPUTE_OPEN: "Muammo ko'rib chiqilmoqda. Admin qaror qiladi.",
    REFUNDED: "Mablag' sizga qaytarildi.",
    RELEASED: "Mablag' uy egasiga o'tkazildi.",
    RENTAL_ACTIVE: "Ijara shartnomasi faol. Hammasi joyida!",
    CANCELLED: "Bron bekor qilindi.",
  };
  return map[deal.value?.escrowStatus] || "";
});

const statusBgClass = computed(() => {
  const s = deal.value?.escrowStatus;
  if (s === ESCROW_STATUS.RELEASED || s === ESCROW_STATUS.RENTAL_ACTIVE)
    return "bg-[var(--color-success-light)]";
  if (s === ESCROW_STATUS.DISPUTE_OPEN || s === ESCROW_STATUS.REFUNDED)
    return "bg-[var(--color-danger-light)]";
  if (s === ESCROW_STATUS.CANCELLED) return "bg-[var(--color-bg-secondary)]";
  return "bg-[var(--color-warning-light)]";
});

const statusIconClass = computed(() => {
  const s = deal.value?.escrowStatus;
  if (s === ESCROW_STATUS.RELEASED || s === ESCROW_STATUS.RENTAL_ACTIVE)
    return "text-[var(--color-success)]";
  if (s === ESCROW_STATUS.DISPUTE_OPEN || s === ESCROW_STATUS.REFUNDED)
    return "text-[var(--color-danger)]";
  if (s === ESCROW_STATUS.CANCELLED) return "text-[var(--color-text-tertiary)]";
  return "text-[var(--color-warning)]";
});

const statusIcon = computed(() => {
  const s = deal.value?.escrowStatus;
  if (s === ESCROW_STATUS.RELEASED || s === ESCROW_STATUS.RENTAL_ACTIVE)
    return CheckCircle;
  if (s === ESCROW_STATUS.DISPUTE_OPEN) return AlertCircle;
  if (s === ESCROW_STATUS.REFUNDED || s === ESCROW_STATUS.CANCELLED)
    return XCircle;
  if (s === ESCROW_STATUS.CHECKIN_PENDING) return ArrowRight;
  return Shield;
});

function confirmCheckin() {
  dealsStore.confirmCheckin(deal.value.id);
}

function handlePayInstallment(installmentId) {
  selectedInstallment.value = deal.value.payments.find(
    (p) => p.id === installmentId,
  );
  isPaymentDrawerOpen.value = true;
}

function handleConfirmPayment() {
  if (selectedInstallment.value) {
    dealsStore.payInstallment(deal.value.id, selectedInstallment.value.id);
    isPaymentDrawerOpen.value = false;
    selectedInstallment.value = null;
  }
}

function formatMonth(monthStr) {
  if (!monthStr) return "";
  const [year, month] = monthStr.split("-");
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function submitDispute() {
  dealsStore.reportProblem(deal.value.id, disputeReason.value);
  showDisputeForm.value = false;
  disputeReason.value = "";
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleString("uz-UZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
