<template>
  <div class="page bg-white">
    <AppHeader title="Boshqaruv paneli" :showBack="false">
      <template #actions>
        <router-link
          to="/owner/notifications"
          class="relative w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text)] no-underline"
        >
          <Bell :size="20" />
          <span
            v-if="unreadCount > 0"
            class="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[var(--color-primary)] ring-2 ring-white"
          ></span>
        </router-link>
      </template>
    </AppHeader>

    <div class="px-4 py-4">
      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4">
          <p
            class="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold mb-1"
          >
            Jami daromad
          </p>
          <p class="text-xl font-black text-[var(--color-success)]">
            {{ formatPrice(totalIncome) }}
          </p>
        </div>
        <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4">
          <p
            class="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold mb-1"
          >
            Faol ijaralar
          </p>
          <p class="text-xl font-black">{{ activeRentalsCount }}</p>
        </div>
      </div>

      <!-- Pending bookings -->
      <div v-if="pendingBookings.length > 0" class="mb-4">
        <h3 class="font-semibold mb-2 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
          Kutilayotgan bronlar
        </h3>
        <div class="space-y-3">
          <div
            v-for="deal in pendingBookings"
            :key="deal.id"
            class="border border-[var(--color-border)] rounded-xl p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <p class="font-semibold text-sm">
                  {{ getListing(deal.listingId)?.title }}
                </p>
                <p class="text-xs text-[var(--color-text-secondary)]">
                  {{ getTenant(deal.tenantId)?.name }}
                </p>
              </div>
              <StatusBadge :status="deal.escrowStatus" />
            </div>
            <div class="text-sm mb-3">
              <span class="font-semibold">{{
                formatPrice(deal.rentAmount)
              }}</span>
              <span class="text-[var(--color-text-secondary)]"> ijara</span>
            </div>
            <div
              v-if="deal.escrowStatus === 'AWAITING_OWNER_CONFIRM'"
              class="flex gap-2"
            >
              <button
                @click="confirmBooking(deal.id)"
                class="btn-primary flex-1 text-sm py-3 rounded-xl"
              >
                <CheckCircle :size="16" /> Tasdiqlash
              </button>
              <button
                @click="cancelBooking(deal.id)"
                class="btn-secondary flex-1 text-sm py-3 rounded-xl"
              >
                Rad etish
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <router-link
          to="/owner/create"
          class="flex flex-col items-center gap-2 p-3 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)]"
        >
          <Plus :size="20" class="text-[var(--color-primary)]" />
          <span class="text-[10px] font-bold uppercase">Yangi</span>
        </router-link>
        <router-link
          to="/owner/listings"
          class="flex flex-col items-center gap-2 p-3 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)]"
        >
          <Building2 :size="20" class="text-[var(--color-text-secondary)]" />
          <span class="text-[10px] font-bold uppercase">Uylar</span>
        </router-link>
        <router-link
          to="/owner/payouts"
          class="flex flex-col items-center gap-2 p-3 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)]"
        >
          <Wallet :size="20" class="text-[var(--color-success)]" />
          <span class="text-[10px] font-bold uppercase">Moliya</span>
        </router-link>
      </div>

      <!-- Recent deals -->
      <h3 class="font-semibold mb-2">So'nggi bitimlar</h3>
      <div class="space-y-2">
        <div
          v-for="deal in recentDeals"
          :key="deal.id"
          class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl"
        >
          <img
            v-if="getListing(deal.listingId)"
            :src="getListing(deal.listingId).photos[0]"
            class="w-12 h-12 rounded-lg object-cover shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">
              {{ getListing(deal.listingId)?.title }}
            </p>
            <p class="text-xs text-[var(--color-text-secondary)]">
              {{ formatPrice(deal.rentAmount) }}
            </p>
          </div>
          <StatusBadge :status="deal.escrowStatus" />
        </div>
      </div>

      <EmptyState
        v-if="ownerDeals.length === 0"
        title="Bitimlar yo'q"
        description="E'lon qo'shing va ijarachalarni qabul qiling"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useListingsStore } from "@/stores/listings";
import { useDealsStore } from "@/stores/deals";
import { useAuthStore } from "@/stores/auth";
import { useNotificationsStore } from "@/stores/notifications";
import { formatPrice, getUserById, ESCROW_STATUS } from "@/data/mock";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import { Plus, Building2, CheckCircle, Wallet, Bell } from "lucide-vue-next";
import AppHeader from "@/components/AppHeader.vue";

const auth = useAuthStore();
const listingsStore = useListingsStore();
const dealsStore = useDealsStore();
const notificationsStore = useNotificationsStore();

const ownerId = computed(() => auth.user?.id || "u2");
const unreadCount = computed(() =>
  notificationsStore.getUnreadCount(ownerId.value),
);
const ownerListings = computed(() =>
  listingsStore.getOwnerListings(ownerId.value),
);
const ownerDeals = computed(() => dealsStore.getDealsByOwner(ownerId.value));
const pendingBookings = computed(() =>
  dealsStore.getDealsToConfirm(ownerId.value),
);
const activeBookings = computed(() =>
  ownerDeals.value.filter(
    (d) =>
      ![
        ESCROW_STATUS.RELEASED,
        ESCROW_STATUS.REFUNDED,
        ESCROW_STATUS.CANCELLED,
      ].includes(d.escrowStatus),
  ),
);
const releasedDeals = computed(() =>
  ownerDeals.value.filter((d) => d.escrowStatus === ESCROW_STATUS.RELEASED),
);
const activeRentalsCount = computed(
  () =>
    ownerDeals.value.filter(
      (d) => d.escrowStatus === ESCROW_STATUS.RENTAL_ACTIVE,
    ).length,
);

const totalIncome = computed(() => {
  return ownerDeals.value.reduce((sum, d) => {
    const paidSum =
      d.payments
        ?.filter((p) => p.status === "PAID")
        .reduce((s, p) => s + p.amount, 0) || 0;
    return (
      sum + (d.escrowStatus === ESCROW_STATUS.RELEASED ? d.rentAmount : paidSum)
    );
  }, 0);
});

const recentDeals = computed(() => ownerDeals.value.slice(0, 5));

function getListing(id) {
  return listingsStore.getListingById(id);
}
function getTenant(id) {
  return getUserById(id);
}

function confirmBooking(dealId) {
  dealsStore.updateDealStatus(
    dealId,
    ESCROW_STATUS.CONFIRMED,
    "Uy egasi tasdiqladi",
  );
}
function cancelBooking(dealId) {
  dealsStore.updateDealStatus(
    dealId,
    ESCROW_STATUS.CANCELLED,
    "Uy egasi rad etdi",
  );
}
</script>
