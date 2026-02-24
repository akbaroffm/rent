<template>
  <div class="page bg-white">
    <AppHeader title="Admin profili" />

    <div class="px-4 py-4">
      <!-- Profile card -->
      <div class="mb-4 bg-[var(--color-bg-secondary)] rounded-2xl p-6">
        <div class="flex items-start gap-4">
          <div
            class="w-16 h-16 rounded-full bg-[var(--color-danger)] flex items-center justify-center shrink-0"
          >
            <Shield :size="28" class="text-white" />
          </div>
          <div class="flex-1">
            <h2 class="font-bold text-lg">{{ auth.user?.name }}</h2>
            <p class="text-sm text-[var(--color-text-secondary)]">
              {{ auth.user?.phone }}
            </p>
            <span class="badge badge-danger mt-2 text-xs">Admin</span>
          </div>
        </div>
      </div>

      <!-- Platform stats -->
      <h3 class="font-semibold mb-3">Platforma statistikasi</h3>
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4 text-center">
          <p class="text-2xl font-bold">{{ allUsers.length }}</p>
          <p class="text-xs text-[var(--color-text-secondary)]">
            Foydalanuvchilar
          </p>
        </div>
        <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4 text-center">
          <p class="text-2xl font-bold">{{ allListings.length }}</p>
          <p class="text-xs text-[var(--color-text-secondary)]">E'lonlar</p>
        </div>
        <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4 text-center">
          <p class="text-2xl font-bold">{{ dealsStore.totalDeals }}</p>
          <p class="text-xs text-[var(--color-text-secondary)]">Bitimlar</p>
        </div>
        <div class="bg-[var(--color-danger-light)] rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-[var(--color-danger)]">
            {{ dealsStore.openDisputes.length }}
          </p>
          <p class="text-xs text-[var(--color-text-secondary)]">
            Ochiq nizolar
          </p>
        </div>
      </div>

      <!-- Quick links -->
      <h3 class="font-semibold mb-3">Boshqaruv</h3>
      <div class="space-y-2 mb-6">
        <router-link
          to="/admin"
          class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)]"
        >
          <LayoutDashboard
            :size="18"
            class="text-[var(--color-text-secondary)]"
          />
          <span class="text-sm font-medium flex-1">Boshqaruv paneli</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>
        <router-link
          to="/admin/disputes"
          class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)]"
        >
          <AlertTriangle :size="18" class="text-[var(--color-danger)]" />
          <span class="text-sm font-medium flex-1">Nizo markazi</span>
          <span
            v-if="dealsStore.openDisputes.length"
            class="badge badge-danger text-[10px]"
            >{{ dealsStore.openDisputes.length }}</span
          >
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>
        <router-link
          to="/admin/users"
          class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)]"
        >
          <Users :size="18" class="text-[var(--color-info)]" />
          <span class="text-sm font-medium flex-1">Foydalanuvchilar</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>
      </div>

      <!-- Earnings summary -->
      <div class="bg-[var(--color-success-light)] rounded-xl p-4 mb-6">
        <p class="text-sm text-[var(--color-success)] mb-1">
          Platforma daromadi
        </p>
        <p class="text-2xl font-bold text-[var(--color-success)]">
          {{ formatPrice(platformEarnings) }}
        </p>
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
          <Globe :size="18" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">Til: O'zbekcha</span>
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
            class="btn-outline text-xs py-2.5 border-[var(--color-secondary)] bg-[var(--color-bg-secondary)]"
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
import { useDealsStore } from "@/stores/deals";
import { useListingsStore } from "@/stores/listings";
import { mockUsers, formatPrice, ESCROW_STATUS } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import {
  Shield,
  LayoutDashboard,
  AlertTriangle,
  Users,
  ChevronRight,
  Settings,
  Globe,
  LogOut,
} from "lucide-vue-next";

const router = useRouter();
const auth = useAuthStore();
const dealsStore = useDealsStore();
const listingsStore = useListingsStore();

const allUsers = mockUsers;
const allListings = computed(() => listingsStore.listings);

const platformEarnings = computed(() =>
  dealsStore.deals
    .filter((d) => d.escrowStatus === ESCROW_STATUS.RELEASED)
    .reduce((sum, d) => sum + d.platformFee, 0),
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
