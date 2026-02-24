<template>
  <div class="page bg-white min-h-dvh flex flex-col">
    <AppHeader title="Mening kartalarim" />

    <div class="flex-1 px-4 py-6">
      <!-- Cards List -->
      <div v-if="auth.cards.length > 0" class="space-y-4 mb-4">
        <div
          v-for="card in auth.cards"
          :key="card.id"
          class="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform active:scale-[0.98]"
          :class="
            card.type === 'UZCARD'
              ? 'bg-gradient-to-br from-blue-600 to-blue-800'
              : 'bg-gradient-to-br from-orange-500 to-orange-700'
          "
        >
          <div class="flex justify-between items-start mb-8">
            <span class="text-lg font-black tracking-widest italic">{{
              card.type
            }}</span>
            <button
              @click="handleRemove(card.id)"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
            >
              <Trash2 :size="16" />
            </button>
          </div>

          <div class="mb-6">
            <p class="text-xs opacity-70 uppercase tracking-tighter mb-1">
              Karta raqami
            </p>
            <p class="text-xl font-bold tracking-widest">{{ card.number }}</p>
          </div>

          <div class="flex justify-between items-end">
            <div>
              <p class="text-[10px] opacity-70 uppercase mb-0.5">Muddati</p>
              <p class="text-sm font-semibold">{{ card.expiry }}</p>
            </div>

            <div
              v-if="card.active"
              class="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase"
            >
              <Check :size="12" /> Asosiy
            </div>
            <button
              v-else
              @click="auth.setMainCard(card.id)"
              class="text-[10px] font-bold uppercase underline underline-offset-4"
            >
              Asosiy qilish
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CreditCard :size="32" class="text-[var(--color-text-tertiary)]" />
        </div>
        <h3 class="font-bold text-lg mb-2">Kartalar qo'shilmagan</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mb-6">
          Xavfsiz to'lovlar uchun bank kartangizni kiriting
        </p>
      </div>

      <!-- Add New Card Section -->
      <div class="pt-4">
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-1.5 block">Karta raqami</label>
            <input
              v-model="newCard.number"
              type="tel"
              placeholder="8600 0000 0000 0000"
              maxlength="19"
              class="input-field rounded-xl"
              @input="formatCardNumber"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium mb-1.5 block"
                >Amal qilish muddati</label
              >
              <input
                v-model="newCard.expiry"
                type="tel"
                placeholder="MM/YY"
                maxlength="5"
                class="input-field text-center rounded-xl"
                @input="formatExpiry"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-1.5 block">CVV</label>
              <input
                v-model="newCard.cvv"
                type="tel"
                placeholder="000"
                maxlength="3"
                class="input-field text-center rounded-xl"
              />
            </div>
          </div>

          <button
            @click="handleAdd"
            :disabled="!isFormValid"
            class="btn-primary mt-2 rounded-xl"
          >
            <Plus :size="18" /> Karta qo'shish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import AppHeader from "@/components/AppHeader.vue";
import { Plus, Trash2, Check, CreditCard } from "lucide-vue-next";

const auth = useAuthStore();

const newCard = ref({
  number: "",
  expiry: "",
  cvv: "",
});

const isFormValid = computed(() => {
  return (
    newCard.value.number.replace(/\s/g, "").length === 16 &&
    newCard.value.expiry.length === 5 &&
    newCard.value.cvv.length === 3
  );
});

function formatCardNumber() {
  let val = newCard.value.number.replace(/\D/g, "");
  let formatted = "";
  for (let i = 0; i < val.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += " ";
    formatted += val[i];
  }
  newCard.value.number = formatted;
}

function formatExpiry() {
  let val = newCard.value.expiry.replace(/\D/g, "");
  if (val.length > 2) {
    newCard.value.expiry = val.slice(0, 2) + "/" + val.slice(2, 4);
  } else {
    newCard.value.expiry = val;
  }
}

function handleAdd() {
  if (isFormValid.value) {
    auth.addCard({ ...newCard.value });
    newCard.value = { number: "", expiry: "", cvv: "" };
  }
}

function handleRemove(id) {
  if (confirm("Ushbu kartani o'chirmoqchimisiz?")) {
    auth.removeCard(id);
  }
}
</script>
