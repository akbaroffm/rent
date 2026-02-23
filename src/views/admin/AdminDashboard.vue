<template>
  <div class="page bg-white">
    <AppHeader title="Admin panel" :showBack="false" />

    <div class="px-4 py-4">
      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4">
          <p class="text-2xl font-bold">{{ allUsers.length }}</p>
          <p class="text-sm text-[var(--color-text-secondary)]">
            Foydalanuvchilar
          </p>
        </div>
        <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4">
          <p class="text-2xl font-bold">{{ allListings.length }}</p>
          <p class="text-sm text-[var(--color-text-secondary)]">E'lonlar</p>
        </div>
        <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4">
          <p class="text-2xl font-bold">{{ dealsStore.totalDeals }}</p>
          <p class="text-sm text-[var(--color-text-secondary)]">Bitimlar</p>
        </div>
        <div class="bg-[var(--color-danger-light)] rounded-xl p-4">
          <p class="text-2xl font-bold text-[var(--color-danger)]">
            {{ openDisputes.length }}
          </p>
          <p class="text-sm text-[var(--color-text-secondary)]">
            Ochiq nizolar
          </p>
        </div>
      </div>

      <!-- Quick links -->
      <div class="space-y-2 mb-6">
        <router-link
          to="/admin/disputes"
          class="flex items-center gap-3 p-4 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)]"
        >
          <AlertTriangle :size="20" class="text-[var(--color-danger)]" />
          <div class="flex-1">
            <p class="font-semibold text-sm">Nizo markazi</p>
            <p class="text-xs text-[var(--color-text-secondary)]">
              {{ openDisputes.length }} ta ochiq nizo
            </p>
          </div>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>

        <router-link
          to="/admin/users"
          class="flex items-center gap-3 p-4 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)]"
        >
          <Users :size="20" class="text-[var(--color-info)]" />
          <div class="flex-1">
            <p class="font-semibold text-sm">Foydalanuvchilar</p>
            <p class="text-xs text-[var(--color-text-secondary)]">
              {{ allUsers.length }} ta ro'yxatdan o'tgan
            </p>
          </div>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>
      </div>

      <!-- Platform earnings -->
      <div class="bg-[var(--color-success-light)] rounded-xl p-4 mb-6">
        <p class="text-sm text-[var(--color-success)] mb-1">
          Platforma daromadi
        </p>
        <p class="text-2xl font-bold text-[var(--color-success)]">
          {{ formatPrice(platformEarnings) }}
        </p>
        <p class="text-xs text-[var(--color-success)] mt-1">
          Yakunlangan bitimlardan
        </p>
      </div>

      <!-- Recent activity -->
      <h3 class="font-semibold mb-3">So'nggi bitimlar</h3>
      <div class="space-y-2">
        <div
          v-for="deal in recentDeals"
          :key="deal.id"
          class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">
              {{ getListingTitle(deal.listingId) }}
            </p>
            <p class="text-xs text-[var(--color-text-secondary)]">
              {{ getTenantName(deal.tenantId) }} →
              {{ getOwnerName(deal.ownerId) }}
            </p>
          </div>
          <StatusBadge :status="deal.escrowStatus" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDealsStore } from "@/stores/deals";
import { useListingsStore } from "@/stores/listings";
import {
  mockUsers,
  formatPrice,
  getUserById,
  ESCROW_STATUS,
} from "@/data/mock";
import StatusBadge from "@/components/StatusBadge.vue";
import { AlertTriangle, Users, ChevronRight } from "lucide-vue-next";
import AppHeader from "@/components/AppHeader.vue";

const dealsStore = useDealsStore();
const listingsStore = useListingsStore();

const allUsers = mockUsers;
const allListings = computed(() => listingsStore.listings);
const openDisputes = computed(() => dealsStore.openDisputes);
const recentDeals = computed(() => dealsStore.deals.slice(0, 5));
const platformEarnings = computed(() =>
  dealsStore.deals
    .filter((d) =>
      [ESCROW_STATUS.RELEASED, ESCROW_STATUS.RENTAL_ACTIVE].includes(
        d.escrowStatus,
      ),
    )
    .reduce((sum, d) => sum + d.platformFee, 0),
);

function getListingTitle(id) {
  return listingsStore.getListingById(id)?.title || "E'lon";
}
function getTenantName(id) {
  return getUserById(id)?.name || "";
}
function getOwnerName(id) {
  return getUserById(id)?.name || "Noma'lum foydalanuvchi";
}
</script>
