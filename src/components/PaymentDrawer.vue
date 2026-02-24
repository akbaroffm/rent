<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none"
    >
      <!-- Backdrop -->
      <Transition name="fade" appear>
        <div
          v-if="isOpen"
          class="absolute inset-0 bg-black/40 pointer-events-auto"
          @click="$emit('close')"
        ></div>
      </Transition>

      <!-- Content Panel -->
      <Transition name="slide-up" appear>
        <div
          v-if="isOpen"
          class="relative w-full max-w-[450px] bg-white rounded-t-3xl p-6 pointer-events-auto z-[101] shadow-2xl"
        >
          <div
            class="w-12 h-1.5 bg-[var(--color-border-dark)] rounded-full mx-auto mb-6"
            @click="$emit('close')"
          ></div>

          <h2 class="text-xl font-black mb-1">To'lovni tasdiqlash</h2>
          <p class="text-sm text-[var(--color-text-secondary)] mb-4">
            {{ month }} oyi ijara to'lovi uchun
          </p>

          <!-- Amount Box -->
          <div
            class="bg-[var(--color-bg-secondary)] rounded-xl p-4 mb-4 flex justify-between items-center border border-[var(--color-border)]"
          >
            <span class="text-sm font-medium">To'lov summasi:</span>
            <span class="text-xl font-black text-[var(--color-primary)]">{{
              formatPrice(amount)
            }}</span>
          </div>

          <!-- Card Selection -->
          <h3
            class="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-3"
          >
            Kartani tanlang
          </h3>
          <div class="space-y-2 mb-8">
            <template v-if="auth.cards.length > 0">
              <label
                v-for="card in auth.cards"
                :key="card.id"
                class="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all"
                :class="
                  selectedCardId === card.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-dark)]'
                "
              >
                <input
                  type="radio"
                  :value="card.id"
                  v-model="selectedCardId"
                  class="accent-[var(--color-primary)] w-4 h-4"
                />
                <span class="text-xl">💳</span>
                <div class="flex-1">
                  <p class="text-sm font-bold">{{ card.number }}</p>
                  <p
                    class="text-[10px] text-[var(--color-text-secondary)] uppercase"
                  >
                    {{ card.type }}
                  </p>
                </div>
              </label>
            </template>

            <div
              v-else
              class="text-center py-4 border border-dashed border-[var(--color-border)] rounded-xl mb-4"
            >
              <p class="text-xs text-[var(--color-text-secondary)]">
                Hech qanday karta qo'shilmagan
              </p>
            </div>

            <button
              @click="$router.push('/tenant/cards')"
              class="w-full flex items-center gap-3 p-4 border border-dashed border-[var(--color-border-dark)] rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-left"
            >
              <Plus :size="18" class="text-[var(--color-text-secondary)]" />
              <span
                class="text-sm font-medium text-[var(--color-text-secondary)]"
                >Yangi karta qo'shish</span
              >
            </button>
          </div>

          <!-- Action -->
          <button
            @click="handlePay"
            class="btn-primary w-full py-4 text-base font-black shadow-lg shadow-[var(--color-primary)]/20 active:scale-95 transition-transform rounded-xl"
            :disabled="paying"
          >
            <template v-if="!paying">
              <Lock :size="18" /> {{ formatPrice(amount) }} to'lash
            </template>
            <template v-else>
              <div class="flex items-center justify-center gap-2">
                <Loader2 class="animate-spin" :size="20" />
                <span>To'lanmoqda...</span>
              </div>
            </template>
          </button>

          <p
            class="text-[10px] text-[var(--color-text-tertiary)] text-center mt-4"
          >
            To'lov xavfsiz va shifrlangan. <br />
            Ijara shartnomasi shartlariga muvofiq amalga oshiriladi.
          </p>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { formatPrice } from "@/data/mock";
import { Plus, Lock, Loader2 } from "lucide-vue-next";

const props = defineProps({
  isOpen: Boolean,
  amount: Number,
  month: String,
});

const auth = useAuthStore();
const emit = defineEmits(["close", "confirm"]);

const selectedCardId = ref(
  auth.cards.find((c) => c.active)?.id || auth.cards[0]?.id || "",
);
const paying = ref(false);

// Lock body scroll when drawer is open
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
);

onUnmounted(() => {
  document.body.style.overflow = "";
});

function handlePay() {
  paying.value = true;
  setTimeout(() => {
    emit("confirm");
    paying.value = false;
    document.body.style.overflow = "";
  }, 1500);
}
</script>
