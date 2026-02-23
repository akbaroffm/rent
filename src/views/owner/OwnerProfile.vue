<template>
  <div class="page bg-white">
    <AppHeader title="Profilim" />

    <div class="px-4 py-4">
      <!-- Profile card -->
      <div class="text-center mb-6 pb-5 border-b border-[var(--color-border)]">
        <div
          class="w-20 h-20 mx-auto rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mb-3"
        >
          <Building2 :size="32" class="text-[var(--color-primary)]" />
        </div>
        <h2 class="font-bold text-lg">{{ auth.user?.name }}</h2>
        <p class="text-sm text-[var(--color-text-secondary)]">
          {{ auth.user?.phone }}
        </p>
        <span class="badge badge-info mt-2">Uy egasi</span>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-3 mb-6">
        <div
          class="bg-[var(--color-bg-secondary)] rounded-xl p-3 text-center col-span-2"
        >
          <p class="text-xl font-bold">{{ myListings.length }}</p>
          <p class="text-[10px] text-[var(--color-text-secondary)]">E'lonlar</p>
        </div>
        <div
          class="bg-[var(--color-bg-secondary)] rounded-xl p-3 text-center col-span-2"
        >
          <p class="text-xl font-bold">{{ myDeals.length }}</p>
          <p class="text-[10px] text-[var(--color-text-secondary)]">Bitimlar</p>
        </div>
        <div
          class="bg-[var(--color-success-light)] rounded-xl p-3 text-center col-span-4"
        >
          <p class="text-xl font-bold text-[var(--color-success)]">
            {{ formatPrice(totalEarnings) }}
          </p>
          <p class="text-[10px] text-[var(--color-text-secondary)]">Daromad</p>
        </div>
      </div>

      <!-- Menu -->
      <div class="space-y-1 mb-6">
        <router-link
          to="/owner/listings"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors no-underline text-[var(--color-text)]"
        >
          <Building2 :size="18" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">E'lonlarim</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>
        <router-link
          to="/owner/bookings"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors no-underline text-[var(--color-text)]"
        >
          <ClipboardList
            :size="18"
            class="text-[var(--color-text-secondary)]"
          />
          <span class="text-sm font-medium flex-1">Bron so'rovlari</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>
        <router-link
          to="/owner/payouts"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors no-underline text-[var(--color-text)]"
        >
          <Wallet :size="18" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">To'lovlar</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>
      </div>

      <!-- Settings -->
      <div class="space-y-1 mb-6">
        <button
          class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <Settings :size="18" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">Sozlamalar</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </button>
        <button
          class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <HelpCircle :size="18" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">Yordam</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </button>
      </div>

      <!-- Demo role switch -->
      <div class="py-3 mb-4">
        <p class="text-xs text-[var(--color-text-tertiary)] mb-2 px-3">
          Demo: Rolni o'zgartirish
        </p>
        <div class="grid grid-cols-2 gap-2 px-3">
          <button
            @click="switchRole('tenant')"
            class="btn-outline text-xs py-2.5 border border-[var(--color-border)]"
          >
            Ijarachi
          </button>
          <button
            @click="switchRole('owner')"
            class="btn-outline text-xs py-2.5 border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
          >
            Uy egasi
          </button>
          <button
            @click="switchRole('admin')"
            class="btn-outline text-xs py-2.5 border border-[var(--color-border)]"
          >
            Admin
          </button>
        </div>
      </div>

      <!-- Logout -->
      <button @click="handleLogout" class="btn-danger rounded-xl">
        <LogOut :size="16" /> Chiqish
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useListingsStore } from "@/stores/listings";
import { useDealsStore } from "@/stores/deals";
import { formatPrice, ESCROW_STATUS } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import {
  Building2,
  ClipboardList,
  Wallet,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-vue-next";

const router = useRouter();
const auth = useAuthStore();
const listingsStore = useListingsStore();
const dealsStore = useDealsStore();

const myListings = computed(() =>
  listingsStore.getOwnerListings(auth.user?.id || "u2"),
);
const myDeals = computed(() =>
  dealsStore.getDealsByOwner(auth.user?.id || "u2"),
);
const totalEarnings = computed(() =>
  myDeals.value
    .filter((d) => d.escrowStatus === ESCROW_STATUS.RELEASED)
    .reduce((sum, d) => sum + d.rentAmount, 0),
);

function switchRole(role) {
  auth.loginAs(role);
  const routes = {
    tenant: "/tenant",
    owner: "/owner",
    admin: "/admin",
  };
  router.push(routes[role]);
}

function handleLogout() {
  auth.logout();
  router.push("/");
}
</script>
