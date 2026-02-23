<template>
  <div class="page min-h-dvh pb-20">
    <AppHeader title="Ijara shartnomasi" />

    <div v-if="deal" class="mt-6">
      <div class="bg-white rounded-2xl p-6 max-w-[600px] mx-auto">
        <!-- Logo & Header -->
        <div
          class="text-center mb-8 border-b border-dashed border-[var(--color-border)] pb-6"
        >
          <div
            class="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg"
          >
            <ShieldCheck :size="32" />
          </div>
          <h2 class="text-xl font-bold uppercase tracking-wide">
            Ijara Safely
          </h2>
          <p
            class="text-[10px] text-[var(--color-text-tertiary)] uppercase mt-1"
          >
            Raqamli ijara shartnomasi № {{ deal.id.toUpperCase() }}
          </p>
        </div>

        <!-- Agreement Body -->
        <div class="space-y-6 text-sm leading-relaxed text-[var(--color-text)]">
          <div class="flex justify-between items-start gap-4">
            <div>
              <p
                class="text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold"
              >
                Ijaraga beruvchi
              </p>
              <p class="font-bold text-lg">{{ owner?.name }}</p>
              <p class="text-xs text-[var(--color-text-secondary)]">
                {{ owner?.phone }}
              </p>
            </div>
            <div class="text-right">
              <p
                class="text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold"
              >
                Ijarachi
              </p>
              <p class="font-bold text-lg">{{ tenant?.name }}</p>
              <p class="text-xs text-[var(--color-text-secondary)]">
                {{ tenant?.phone }}
              </p>
            </div>
          </div>

          <div
            class="bg-[var(--color-bg-secondary)] rounded-xl p-4 border border-[var(--color-border)]"
          >
            <p
              class="text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold mb-2"
            >
              Ko'chmas mulk obyekti
            </p>
            <p class="font-bold">{{ listing?.title }}</p>
            <p class="text-xs text-[var(--color-text-secondary)]">
              {{ listing?.address }}
            </p>
          </div>

          <div>
            <h4
              class="font-bold border-b border-[var(--color-border)] pb-2 mb-3"
            >
              1. Shartnoma predmeti
            </h4>
            <p>
              Mazkur shartnomaga muvofiq, Ijaraga beruvchi o'ziga tegishli
              bo'lgan turar-joyni Ijarachiga vaqtincha foydalanish uchun
              topshiradi. Ijarachi esa belgilangan muddatda ijara haqini to'lash
              majburiyatini oladi.
            </p>
          </div>

          <div>
            <h4
              class="font-bold border-b border-[var(--color-border)] pb-2 mb-3"
            >
              2. To'lov shartlari
            </h4>
            <ul class="list-disc pl-5 space-y-2">
              <li>
                Oylik ijara haqi:
                <strong>{{ formatPrice(deal.rentAmount) }}</strong>
              </li>
              <li>
                To'lov turi:
                <strong
                  >Faqat bank kartasi orqali (IjaraSafe platformasi)</strong
                >
              </li>
              <li>
                Platforma xizmat haqi (faqat 1-oy uchun):
                {{ formatPrice(deal.platformFee) }}
              </li>
            </ul>
          </div>

          <div>
            <h4
              class="font-bold border-b border-[var(--color-border)] pb-2 mb-3"
            >
              3. Tomonlarning majburiyatlari
            </h4>
            <p>
              Ijarachi turar-joyni toza saqlashi, qo'shnilar tinchligini
              buzmasligi va kommunal to'lovlarni o'z vaqtida amalga oshirishi
              shart. Ijaraga beruvchi esa turar-joyning yashash uchun yaroqli
              holatda bo'lishini ta'minlaydi.
            </p>
          </div>

          <!-- Signatures -->
          <div
            class="grid grid-cols-2 gap-8 pt-8 border-t border-[var(--color-border)]"
          >
            <div>
              <p
                class="text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold mb-4"
              >
                Ijaraga beruvchi imzosi
              </p>
              <div class="border-b border-black h-12 relative">
                <span
                  class="absolute bottom-2 left-0 font-serif italic text-lg opacity-80"
                  >{{ owner?.name?.split(" ")[0] }}</span
                >
              </div>
              <p class="text-[10px] text-center mt-1 italic">
                Raqamli tasdiqlangan: {{ formatDate(deal.agreementDate) }}
              </p>
            </div>
            <div>
              <p
                class="text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold mb-4"
              >
                Ijarachi imzosi
              </p>
              <div class="border-b border-black h-12 relative">
                <span
                  class="absolute bottom-2 left-0 font-serif italic text-lg opacity-80"
                  >{{ tenant?.name?.split(" ")[0] }}</span
                >
              </div>
              <p class="text-[10px] text-center mt-1 italic">
                Raqamli tasdiqlangan: {{ formatDate(deal.agreementDate) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div
          class="mt-10 pt-6 border-t border-[var(--color-border)] text-center"
        >
          <p class="text-[9px] text-[var(--color-text-tertiary)] uppercase">
            Mazkur hujjat IjaraSafe platformasi orqali shakllantirilgan va
            qonuniy kuchga ega.
          </p>
          <button
            @click="window.print()"
            class="mt-4 flex items-center gap-2 mx-auto text-xs text-[var(--color-primary)] font-bold"
          >
            <Printer :size="14" /> Shartnomani yuklab olish (PDF)
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]"
    >
      Shartnoma topilmadi.
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useDealsStore } from "@/stores/deals";
import { useListingsStore } from "@/stores/listings";
import { getUserById, formatPrice, formatDate } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import { ShieldCheck, Printer } from "lucide-vue-next";

const route = useRoute();
const dealsStore = useDealsStore();
const listingsStore = useListingsStore();

const deal = computed(() => dealsStore.getDealById(route.params.id));
const listing = computed(() =>
  deal.value ? listingsStore.getListingById(deal.value.listingId) : null,
);
const tenant = computed(() =>
  deal.value ? getUserById(deal.value.tenantId) : null,
);
const owner = computed(() =>
  deal.value ? getUserById(deal.value.ownerId) : null,
);
</script>

<style scoped>
@media print {
  .page {
    background: white !important;
    padding: 0 !important;
  }
  button {
    display: none !important;
  }
}
</style>
