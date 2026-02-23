<template>
  <div
    class="flex flex-col h-dvh bg-white pb-[calc(64px+env(safe-area-inset-bottom))]"
  >
    <AppHeader :title="otherUser?.name || 'Chat'" />

    <!-- Messages -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-4 py-4 space-y-3"
    >
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex"
        :class="
          msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
        "
      >
        <div
          class="max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
          :class="
            msg.senderId === currentUserId
              ? 'bg-[var(--color-primary)] text-white rounded-br-md'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] rounded-bl-md'
          "
        >
          <p>{{ msg.text }}</p>
          <p
            class="text-[10px] mt-1 text-right"
            :class="
              msg.senderId === currentUserId
                ? 'text-white/70'
                : 'text-[var(--color-text-tertiary)]'
            "
          >
            {{ formatMsgTime(msg.timestamp) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="px-4 py-3">
      <div class="flex items-center gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Xabar yozing..."
          class="input-field flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-sm focus:outline-none"
          @keyup.enter="send"
        />
        <button
          @click="send"
          :disabled="!newMessage.trim()"
          class="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0 disabled:bg-[var(--color-border)]"
        >
          <Send :size="16" class="text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useChatStore } from "@/stores/chat";
import { useAuthStore } from "@/stores/auth";
import { getUserById } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import { Send } from "lucide-vue-next";

const route = useRoute();
const chatStore = useChatStore();
const auth = useAuthStore();

const newMessage = ref("");
const messagesContainer = ref(null);
const currentUserId = computed(() => auth.user?.id || "u1");

const conversation = computed(() =>
  chatStore.conversations.find((c) => c.id === route.params.id),
);
const messages = computed(() => chatStore.getMessages(route.params.id));

const otherUser = computed(() => {
  if (!conversation.value) return null;
  const otherId = conversation.value.participants.find(
    (p) => p !== currentUserId.value,
  );
  return getUserById(otherId);
});

function send() {
  if (!newMessage.value.trim() || !conversation.value) return;
  const otherId = conversation.value.participants.find(
    (p) => p !== currentUserId.value,
  );
  chatStore.sendMessage(
    route.params.id,
    currentUserId.value,
    otherId,
    newMessage.value.trim(),
  );
  newMessage.value = "";
  scrollToBottom();
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

function formatMsgTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(scrollToBottom);
watch(messages, scrollToBottom, { deep: true });
</script>
