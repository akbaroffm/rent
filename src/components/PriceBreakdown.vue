<template>
  <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4">
    <h4 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
      Narx tafsilotlari
    </h4>
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span>Oylik ijara</span>
        <span class="font-medium">{{ formatPrice(rentAmount) }}</span>
      </div>

      <!-- Platform fee with collapse -->
      <div>
        <button
          @click="showFeeInfo = !showFeeInfo"
          class="w-full flex justify-between items-center text-sm group"
        >
          <span class="flex items-center gap-1.5">
            Platforma xizmati (3%)
            <Info
              :size="13"
              class="text-[var(--color-info)] opacity-70 group-hover:opacity-100 transition-opacity"
            />
          </span>
          <span class="font-medium">{{ formatPrice(platformFee) }}</span>
        </button>

        <!-- Collapsible explanation -->
        <div
          v-if="showFeeInfo"
          class="mt-2 bg-[var(--color-info-light)] rounded-lg p-3 space-y-2 text-xs leading-relaxed"
        >
          <p class="font-semibold text-[var(--color-info)]">
            Nima uchun 3% to'lanadi?
          </p>
          <div class="space-y-1.5 text-[var(--color-text-secondary)]">
            <div class="flex items-start gap-2">
              <ShieldCheck
                :size="13"
                class="text-[var(--color-success)] shrink-0 mt-0.5"
              />
              <span
                ><strong>Pulingiz xavfsiz.</strong> Aldanib qolganingizdan ko'ra
                3% to'lab, pulingiz kafolatlangan bo'lishi yaxshiroq.</span
              >
            </div>
            <div class="flex items-start gap-2">
              <Lock
                :size="13"
                class="text-[var(--color-info)] shrink-0 mt-0.5"
              />
              <span
                ><strong>Escrow himoyasi.</strong> Pul platformada saqlanadi —
                faqat siz ko'chib kirganingizni tasdiqlaganingizdan keyin uy
                egasiga o'tkaziladi.</span
              >
            </div>
            <div class="flex items-start gap-2">
              <Scale
                :size="13"
                class="text-[var(--color-warning)] shrink-0 mt-0.5"
              />
              <span
                ><strong>Nizo bo'lsa — admin hal qiladi.</strong> Muammo chiqsa,
                mablag' muzlatiladi va platforma adolatli qaror qiladi.</span
              >
            </div>
            <div class="flex items-start gap-2">
              <BadgeCheck
                :size="13"
                class="text-[var(--color-primary)] shrink-0 mt-0.5"
              />
              <span
                ><strong>Tasdiqlangan uy egasi.</strong> Platforma uy egalarini
                tekshiradi — soxta e'lonlar bloklanadi.</span
              >
            </div>
          </div>
          <div class="pt-1.5 border-t border-[var(--color-info)]/20">
            <p class="text-[var(--color-info)] font-medium">
              💡 O'rtacha ijarachi firibgarlikda 3-5 mln so'm yo'qotadi. 3%
              to'lab, 100% xavfsizlikni olasiz.
            </p>
          </div>
        </div>
      </div>

      <div class="h-px bg-[var(--color-border)] my-1"></div>
      <div class="flex justify-between text-sm font-bold">
        <span>Jami</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { formatPrice, calculatePlatformFee } from "@/data/mock";
import { Info, ShieldCheck, Lock, Scale, BadgeCheck } from "lucide-vue-next";

const props = defineProps({
  rentAmount: { type: Number, default: 0 },
});

const showFeeInfo = ref(false);
const platformFee = computed(() => calculatePlatformFee(props.rentAmount));
const total = computed(() => props.rentAmount + platformFee.value);
</script>
