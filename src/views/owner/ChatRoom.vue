<template>
  <div
    class="page bg-white flex flex-col h-dvh pb-[calc(64px+env(safe-area-inset-bottom))]"
  >
    <AppHeader title="Suhbat" backBtn />

    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex"
        :class="
          msg.senderId === auth.user?.id ? 'justify-end' : 'justify-start'
        "
      >
        <div
          class="max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
          :class="
            msg.senderId === auth.user?.id
              ? 'bg-[var(--color-primary)] text-white rounded-br-md'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] rounded-bl-md'
          "
        >
          <p>{{ msg.text }}</p>
          <p
            class="text-[10px] mt-1 text-right"
            :class="
              msg.senderId === auth.user?.id
                ? 'text-white/70'
                : 'text-[var(--color-text-tertiary)]'
            "
          >
            {{ formatTime(msg.timestamp) }}
          </p>
        </div>
      </div>
    </div>

    <div class="px-4 py-3">
      <div class="flex items-center gap-2">
        <input
          v-model="messageText"
          type="text"
          placeholder="Xabar yozing..."
          class="input-field flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-sm focus:outline-none"
          @keyup.enter="sendMessage"
        />
        <button
          @click="sendMessage"
          :disabled="!messageText.trim()"
          class="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0 disabled:bg-[var(--color-border)]"
        >
          <Send :size="16" class="text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useChatStore } from "@/stores/chat";
import { useAuthStore } from "@/stores/auth";
import AppHeader from "@/components/AppHeader.vue";
import { Send } from "lucide-vue-next";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const chatStore = useChatStore();
const auth = useAuthStore();
const messageText = ref("");

const messages = computed(() => chatStore.getMessages(props.id));

function sendMessage() {
  if (!messageText.value.trim()) return;

  const otherId = messages.value[0]?.receiverId || messages.value[0]?.senderId;
  chatStore.sendMessage(
    props.id,
    auth.user?.id || "u2",
    otherId,
    messageText.value,
  );
  messageText.value = "";
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
