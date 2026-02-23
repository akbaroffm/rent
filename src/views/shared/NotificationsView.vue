<template>
  <div class="page min-h-dvh flex flex-col">
    <!-- Header -->
    <AppHeader title="Bildirishnomalar">
      <template #actions>
        <button
          v-if="unreadCount > 0"
          @click="store.markAllAsRead(auth.user?.id)"
          class="text-sm font-semibold text-[var(--color-primary)]"
        >
          O'qilgan qilish
        </button>
      </template>
    </AppHeader>

    <div class="flex-1 px-4 py-4 space-y-3">
      <div v-if="notifications.length === 0" class="text-center py-10">
        <div
          class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[var(--color-text-tertiary)]"
        >
          <BellOff :size="24" />
        </div>
        <h3 class="font-bold text-lg mb-1">Xabarlar yo'q</h3>
        <p class="text-sm text-[var(--color-text-secondary)]">
          Sizda hozircha bildirishnomalar mavjud emas
        </p>
      </div>

      <div
        v-for="n in notifications"
        :key="n.id"
        @click="handleRead(n)"
        class="bg-white rounded-2xl p-4 flex gap-4 relative transition-all border border-[var(--color-border)]"
        :class="[
          n.read ? 'opacity-80' : '',
          n.link ? 'cursor-pointer active:scale-[0.98]' : '',
        ]"
      >
        <!-- Unread dot -->
        <span
          v-if="!n.read"
          class="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--color-primary)]"
        ></span>

        <!-- Icon -->
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          :class="getIconColor(n.type)"
        >
          <component :is="getIcon(n.type)" :size="20" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pr-4">
          <h4
            class="font-bold text-[15px] mb-1 leading-tight"
            :class="
              !n.read
                ? 'text-[var(--color-text)]'
                : 'text-[var(--color-text-secondary)]'
            "
          >
            {{ n.title }}
          </h4>
          <p
            class="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-2"
          >
            {{ n.message }}
          </p>
          <span
            class="text-[11px] text-[var(--color-text-tertiary)] font-medium"
            >{{ formatTime(n.createdAt) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useNotificationsStore } from "@/stores/notifications";
import { useAuthStore } from "@/stores/auth";
import AppHeader from "@/components/AppHeader.vue";
import {
  BellOff,
  AlertTriangle,
  CheckCircle2,
  Info,
  UserCheck,
  CreditCard,
} from "lucide-vue-next";
import { timeAgo } from "@/data/mock";

const store = useNotificationsStore();
const auth = useAuthStore();
const router = useRouter();

const notifications = computed(() =>
  store.getNotificationsForUser(auth.user?.id || "u1"),
);
const unreadCount = computed(() => store.getUnreadCount(auth.user?.id || "u1"));

function formatTime(isoStr) {
  return timeAgo(isoStr);
}

function handleRead(n) {
  if (!n.read) store.markAsRead(n.id);
  if (n.link) {
    router.push(n.link);
  }
}

function getIcon(type) {
  switch (type) {
    case "warning":
      return AlertTriangle;
    case "success":
      return CheckCircle2;
    case "auth":
      return UserCheck;
    case "payment":
      return CreditCard;
    default:
      return Info;
  }
}

function getIconColor(type) {
  switch (type) {
    case "warning":
      return "bg-[var(--color-warning-light)] text-[var(--color-warning)]";
    case "success":
      return "bg-[var(--color-success-light)] text-[var(--color-success)]";
    case "auth":
      return "bg-[var(--color-secondary-light)] text-[var(--color-secondary)]";
    case "payment":
      return "bg-[var(--color-primary-light)] text-[var(--color-primary)]";
    default:
      return "bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]";
  }
}
</script>
