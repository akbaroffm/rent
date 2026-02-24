<template>
  <div class="page bg-white">
    <AppHeader title="Profilim" />

    <div class="px-4 py-4">
      <!-- Profile card -->
      <div class="mb-4 p-6 bg-[var(--color-bg-secondary)] rounded-2xl">
        <div class="flex items-start gap-4 mb-4">
          <div
            class="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0"
          >
            <Building2 :size="28" class="text-white" />
          </div>
          <div class="flex-1">
            <h2 class="font-bold text-lg">{{ auth.user?.name }}</h2>
            <p class="text-sm text-[var(--color-text-secondary)]">
              {{ auth.user?.phone }}
            </p>
            <span class="badge badge-info mt-2 text-xs">Foydalanuvchi</span>
          </div>
        </div>

        <!-- Stats in card -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white backdrop-blur rounded-lg p-3 text-center">
            <p class="text-lg font-bold text-[var(--color-primary)]">
              {{ myListings.length }}
            </p>
            <p class="text-[10px] text-[var(--color-text-secondary)]">
              E'lonlar
            </p>
          </div>
          <div class="bg-white backdrop-blur rounded-lg p-3 text-center">
            <p class="text-lg font-bold text-[var(--color-primary)]">
              {{ myDeals.length }}
            </p>
            <p class="text-[10px] text-[var(--color-text-secondary)]">
              Bitimlar
            </p>
          </div>
        </div>
      </div>

      <!-- Menu -->
      <div class="space-y-1">
        <router-link
          to="/owner/listings"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors no-underline text-[var(--color-text)]"
        >
          <Building2 :size="18" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">E'lonlarim</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>
        <router-link
          to="/owner/chat"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors no-underline text-[var(--color-text)]"
        >
          <MessageSquare
            :size="18"
            class="text-[var(--color-text-secondary)]"
          />
          <span class="text-sm font-medium flex-1">Xabarlar</span>
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
      <div class="space-y-1 mb-2">
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
            @click="switchRole('user')"
            class="btn-outline text-xs py-2.5 border border-[var(--color-border)]"
          >
            Foydalanuvchi
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
  MessageSquare,
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
    user: "/tenant",
    admin: "/admin",
  };
  router.push(routes[role]);
}

function handleLogout() {
  auth.logout();
  router.push("/");
}
</script>
