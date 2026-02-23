<template>
  <div class="page bg-white">
    <AppHeader title="Xabarlar" />

    <div class="">
      <div v-if="conversations.length === 0">
        <EmptyState
          title="Xabarlar yo'q"
          description="Uy egasi bilan suhbat boshlang"
        />
      </div>

      <div v-else class="space-y-1">
        <router-link
          v-for="conv in conversations"
          :key="conv.id"
          :to="`/tenant/chat/${conv.id}`"
          class="flex items-center gap-3 p-3 rounded-xl no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <div
            class="w-12 h-12 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center shrink-0"
          >
            <User :size="20" class="text-[var(--color-text-secondary)]" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p class="font-semibold text-sm truncate">
                {{ getOtherUser(conv)?.name }}
              </p>
              <span
                class="text-xs text-[var(--color-text-tertiary)] shrink-0"
                >{{ timeAgo(conv.lastMessageAt) }}</span
              >
            </div>
            <p
              class="text-xs text-[var(--color-text-secondary)] truncate mt-0.5"
            >
              {{ conv.lastMessage }}
            </p>
          </div>
          <div
            v-if="conv.unread"
            class="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0"
          >
            <span class="text-white text-[10px] font-semibold">{{
              conv.unread
            }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useChatStore } from "@/stores/chat";
import { useAuthStore } from "@/stores/auth";
import { getUserById, timeAgo } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import EmptyState from "@/components/EmptyState.vue";
import { User } from "lucide-vue-next";

const chatStore = useChatStore();
const auth = useAuthStore();

const conversations = computed(() =>
  chatStore.getConversationsForUser(auth.user?.id || "u1"),
);

function getOtherUser(conv) {
  const otherId = conv.participants.find((p) => p !== (auth.user?.id || "u1"));
  return getUserById(otherId);
}
</script>
