<template>
  <div class="page bg-white">
    <AppHeader title="Profil" />

    <div class="px-4 py-4">
      <!-- User card -->
      <div class="mb-4 bg-[var(--color-bg-secondary)] rounded-2xl p-6">
        <div class="flex items-start gap-4 mb-4">
          <div
            class="w-16 h-16 rounded-full bg-[var(--color-info)] flex items-center justify-center shrink-0"
          >
            <User :size="28" class="text-white" />
          </div>
          <div class="flex-1">
            <h2 class="font-bold text-lg">
              {{ auth.user?.name || "Foydalanuvchi" }}
            </h2>
            <p class="text-sm text-[var(--color-text-secondary)]">
              {{ auth.user?.phone }}
            </p>
            <div class="flex items-center gap-1.5 mt-2">
              <span
                v-if="auth.user?.verified"
                class="badge badge-success text-[10px]"
              >
                <BadgeCheck :size="10" /> Tasdiqlangan
              </span>
              <span class="badge text-[10px]">Foydalanuvchi</span>
            </div>
          </div>
        </div>

        <!-- Stats in card -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-white/60 backdrop-blur rounded-lg p-3 text-center">
            <p class="text-lg font-bold text-[var(--color-info)]">
              {{ myDeals.length }}
            </p>
            <p class="text-[10px] text-[var(--color-text-secondary)]">
              Bitimlar
            </p>
          </div>
          <div class="bg-white/60 backdrop-blur rounded-lg p-3 text-center">
            <p class="text-lg font-bold text-[var(--color-danger)]">
              {{ favCount }}
            </p>
            <p class="text-[10px] text-[var(--color-text-secondary)]">
              Sevimlilar
            </p>
          </div>
          <div class="bg-white/60 backdrop-blur rounded-lg p-3 text-center">
            <p class="text-lg font-bold text-[var(--color-success)]">
              {{ activeDeals }}
            </p>
            <p class="text-[10px] text-[var(--color-text-secondary)]">Faol</p>
          </div>
        </div>
      </div>

      <!-- Menu items -->
      <div class="space-y-1">
        <router-link
          to="/tenant/deals"
          class="flex items-center gap-3 p-3 rounded-xl no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <ClipboardList
            :size="20"
            class="text-[var(--color-text-secondary)]"
          />
          <span class="text-sm font-medium flex-1">Bitimlarim</span>
          <span
            v-if="activeDeals > 0"
            class="badge badge-warning text-[10px]"
            >{{ activeDeals }}</span
          >
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>

        <router-link
          to="/tenant/payments"
          class="flex items-center gap-3 p-3 rounded-xl no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <Wallet :size="20" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">To'lovlarim</span>
          <span
            v-if="pendingPaymentsCount > 0"
            class="badge badge-danger text-[10px]"
            >{{ pendingPaymentsCount }}</span
          >
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>

        <router-link
          to="/tenant/cards"
          class="flex items-center gap-3 p-3 rounded-xl no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <CreditCard :size="20" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">Mening kartalarim</span>
          <span v-if="auth.cards.length > 0" class="badge text-[10px]">{{
            auth.cards.length
          }}</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>

        <router-link
          to="/tenant/favorites"
          class="flex items-center gap-3 p-3 rounded-xl no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <Heart :size="20" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">Sevimlilar</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>

        <router-link
          to="/tenant/chat"
          class="flex items-center gap-3 p-3 rounded-xl no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <MessageCircle
            :size="20"
            class="text-[var(--color-text-secondary)]"
          />
          <span class="text-sm font-medium flex-1">Xabarlar</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </router-link>

        <button
          class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <Globe :size="20" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">Til: O'zbekcha</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </button>

        <button
          class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <HelpCircle :size="20" class="text-[var(--color-text-secondary)]" />
          <span class="text-sm font-medium flex-1">Yordam</span>
          <ChevronRight :size="16" class="text-[var(--color-text-tertiary)]" />
        </button>

        <!-- Quick role switch (demo) -->
        <div class="py-3">
          <p class="text-xs text-[var(--color-text-tertiary)] mb-2 px-3">
            Demo: Rolni o'zgartirish
          </p>
          <div class="grid grid-cols-2 gap-2 px-3">
            <button
              @click="switchRole('user')"
              class="btn-outline text-xs py-2.5 border border-[var(--color-border)]"
              :class="
                auth.user?.role === 'user'
                  ? ' bg-[var(--color-bg-secondary)]'
                  : ''
              "
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

        <button @click="handleLogout" class="btn-danger rounded-xl">
          <LogOut :size="16" /> Chiqish
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useDealsStore } from "@/stores/deals";
import { useListingsStore } from "@/stores/listings";
import { ESCROW_STATUS } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import {
  User,
  BadgeCheck,
  ChevronRight,
  ClipboardList,
  Heart,
  MessageCircle,
  Globe,
  HelpCircle,
  LogOut,
  Wallet,
  CreditCard,
} from "lucide-vue-next";

const router = useRouter();
const auth = useAuthStore();
const dealsStore = useDealsStore();
const listingsStore = useListingsStore();

const myDeals = computed(() =>
  dealsStore.getDealsByTenant(auth.user?.id || "u1"),
);
const activeDeals = computed(
  () =>
    myDeals.value.filter(
      (d) =>
        ![
          ESCROW_STATUS.RELEASED,
          ESCROW_STATUS.REFUNDED,
          ESCROW_STATUS.CANCELLED,
        ].includes(d.escrowStatus),
    ).length,
);
const pendingPaymentsCount = computed(() => {
  return myDeals.value.reduce((count, d) => {
    return (
      count +
      (d.payments?.filter(
        (p) => p.status === "PENDING" || p.status === "OVERDUE",
      ).length || 0)
    );
  }, 0);
});
const favCount = computed(() => listingsStore.favorites.length);

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
