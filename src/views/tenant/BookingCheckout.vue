<template>
  <div class="page bg-white">
    <AppHeader title="Bron qilish" />

    <div class="px-4 pt-4">
      <!-- Listing summary -->
      <div
        v-if="listing"
        class="flex gap-3 mb-4 p-3 border border-[var(--color-border)] rounded-xl"
      >
        <img
          :src="listing.photos[0]"
          class="w-16 h-16 rounded-lg object-cover shrink-0"
        />
        <div>
          <h3 class="font-semibold text-sm">{{ listing.title }}</h3>
          <p class="text-xs text-[var(--color-text-secondary)]">
            {{ listing.address }}
          </p>
          <p class="text-sm font-semibold mt-1">
            {{ formatPrice(listing.price)
            }}<span class="font-normal text-[var(--color-text-secondary)]">
              / oy</span
            >
          </p>
        </div>
      </div>

      <!-- Escrow explanation — collapsible -->
      <div class="bg-[var(--color-info-light)] rounded-xl p-4 mb-4">
        <button
          @click="showEscrowInfo = !showEscrowInfo"
          class="flex items-start gap-3 w-full text-left"
        >
          <ShieldCheck
            :size="20"
            class="text-[var(--color-info)] shrink-0 mt-0.5"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-sm text-[var(--color-info)] mb-1">
              Xavfsiz to'lov
            </h3>
            <p class="text-xs text-[var(--color-info)] leading-relaxed">
              Pulingiz platformada xavfsiz saqlanadi. Faqat siz ko'chib
              kirganingizni tasdiqlaganingizdan keyin uy egasiga o'tkaziladi.
            </p>
          </div>
          <ChevronDown
            :size="16"
            class="text-[var(--color-info)] shrink-0 mt-1 transition-transform"
            :class="showEscrowInfo ? 'rotate-180' : ''"
          />
        </button>

        <div
          v-if="showEscrowInfo"
          class="mt-3 pt-3 border-t border-[var(--color-info)]/20 space-y-2.5 text-xs"
        >
          <div class="flex items-start gap-2">
            <span class="text-base">🛡️</span>
            <div>
              <p class="font-semibold text-[var(--color-text)]">
                Aldanib qolganingizdan ko'ra, 3% to'lab, 100% xavfsizlikni
                olasiz
              </p>
              <p class="text-[var(--color-text-secondary)]">
                O'rtacha firibgarlik zararasi 3-5 mln so'm. 3% to'lov orqali
                pulingiz to'liq himoyalanadi.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-base">⚖️</span>
            <div>
              <p class="font-semibold text-[var(--color-text)]">
                Muammo bo'lsa — platforma hal qiladi
              </p>
              <p class="text-[var(--color-text-secondary)]">
                E'lon bilan haqiqiy holat farq qilsa, mablag' muzlatiladi va
                admin adolatli qaror qiladi.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-base">⏰</span>
            <div>
              <p class="font-semibold text-[var(--color-text)]">
                24 soat ko'rib chiqish oynasi
              </p>
              <p class="text-[var(--color-text-secondary)]">
                Ko'chib kirgandan keyin 24 soat ichida uyni tekshirishingiz va
                muammo bildirishingiz mumkin.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-base">✅</span>
            <div>
              <p class="font-semibold text-[var(--color-text)]">
                Uy egasi tekshirilgan
              </p>
              <p class="text-[var(--color-text-secondary)]">
                Platforma uy egalarini va e'lonlarni moderatsiya qiladi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Price breakdown -->
      <PriceBreakdown :rentAmount="listing?.price || 0" />

      <div class="h-px bg-[var(--color-border)] my-5"></div>

      <!-- Payment method -->
      <h3 class="font-semibold mb-2">To'lov usuli</h3>

      <div v-if="auth.cards.length > 0" class="space-y-2 mb-4">
        <label
          v-for="card in auth.cards"
          :key="card.id"
          class="flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors"
          :class="
            selectedCardId === card.id
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
              : 'border-[var(--color-border)]'
          "
        >
          <input
            type="radio"
            :value="card.id"
            v-model="selectedCardId"
            class="accent-[var(--color-primary)]"
          />
          <div class="flex-1">
            <p class="text-sm font-medium">
              {{ card.type }} • {{ card.number.slice(-4) }}
            </p>
            <p class="text-[10px] text-[var(--color-text-secondary)]">
              Muddati: {{ card.expiry }}
            </p>
          </div>
          <span class="text-lg">💳</span>
        </label>

        <button
          @click="selectedCardId = 'new'"
          class="w-full flex items-center gap-2 p-3 text-sm font-semibold text-[var(--color-primary)] border border-dashed border-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
          v-if="selectedCardId !== 'new'"
        >
          <Plus :size="16" /> Yangi karta qo'shish
        </button>
      </div>

      <!-- New Card Form -->
      <div
        v-if="selectedCardId === 'new' || auth.cards.length === 0"
        class="space-y-3 mb-6 p-4 border border-[var(--color-primary)] rounded-xl bg-[var(--color-bg-secondary)]"
      >
        <div class="flex justify-between items-center mb-1">
          <h4
            class="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]"
          >
            Karta ma'lumotlari
          </h4>
          <button
            v-if="auth.cards.length > 0"
            @click="selectedCardId = auth.cards[0].id"
            class="text-[10px] font-bold text-[var(--color-primary)] uppercase"
          >
            Bekor qilish
          </button>
        </div>

        <input
          v-model="newCard.number"
          type="tel"
          placeholder="Karta raqami (8600...)"
          maxlength="19"
          class="input-field bg-white"
          @input="formatCardNumber"
        />
        <div class="grid grid-cols-2 gap-3">
          <input
            v-model="newCard.expiry"
            type="tel"
            placeholder="MM/YY"
            maxlength="5"
            class="input-field bg-white text-center"
            @input="formatExpiry"
          />
          <input
            v-model="newCard.cvv"
            type="tel"
            placeholder="CVV"
            maxlength="3"
            class="input-field bg-white text-center"
          />
        </div>

        <label class="flex items-center gap-2 cursor-pointer pt-1">
          <input
            v-model="saveCard"
            type="checkbox"
            class="w-4 h-4 rounded accent-[var(--color-primary)]"
          />
          <span class="text-xs font-medium">Ushbu kartani saqlab qolish</span>
        </label>
      </div>

      <p
        class="text-[10px] text-[var(--color-text-tertiary)] text-center italic mb-4"
      >
        To'lovlar faqat bank kartasi orqali platformada amalga oshiriladi
      </p>

      <!-- How it works -->
      <h3 class="font-semibold mb-3">Jarayon qanday ishlaydi</h3>
      <div class="space-y-3 mb-6">
        <div v-for="(s, i) in steps" :key="i" class="flex items-start gap-3">
          <div
            class="w-7 h-7 rounded-full bg-[var(--color-bg-secondary)] text-xs font-bold flex items-center justify-center shrink-0"
          >
            {{ i + 1 }}
          </div>
          <div>
            <p class="text-sm font-medium">{{ s.title }}</p>
            <p class="text-xs text-[var(--color-text-secondary)]">
              {{ s.desc }}
            </p>
          </div>
        </div>
      </div>

      <!-- Booking footer -->
      <div class="mt-6 mb-4 pb-4 border-t border-[var(--color-border)]">
        <div class="flex items-center gap-3 mt-4">
          <div class="flex-1">
            <p class="text-xs text-[var(--color-text-secondary)]">
              Jami to'lov
            </p>
            <p class="text-lg font-bold">
              {{
                formatPrice(
                  (listing?.price || 0) +
                    calculatePlatformFee(listing?.price || 0),
                )
              }}
            </p>
          </div>
          <button
            @click="handleBook"
            class="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            :disabled="booked"
          >
            <span>{{ booked ? "Yuborildi ✓" : "Bron qilish" }}</span>
          </button>
        </div>
        <p
          class="text-[10px] text-[var(--color-text-tertiary)] text-center mt-2"
        >
          Ijara + 3% platforma haqi
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useListingsStore } from "@/stores/listings";
import { useDealsStore } from "@/stores/deals";
import { useAuthStore } from "@/stores/auth";
import { formatPrice, calculatePlatformFee } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import PriceBreakdown from "@/components/PriceBreakdown.vue";
import { ShieldCheck, ChevronDown, Plus } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const listingsStore = useListingsStore();
const dealsStore = useDealsStore();
const auth = useAuthStore();

const listing = computed(() => listingsStore.getListingById(route.params.id));
const booked = ref(false);
const showEscrowInfo = ref(false);

const selectedCardId = ref(auth.cards.length > 0 ? auth.cards[0].id : "new");
const saveCard = ref(true);
const newCard = ref({ number: "", expiry: "", cvv: "" });

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

const isNewCardValid = computed(() => {
  return (
    newCard.value.number.replace(/\s/g, "").length === 16 &&
    newCard.value.expiry.length === 5 &&
    newCard.value.cvv.length === 3
  );
});

const paymentMethods = [
  { value: "payme", label: "Payme", icon: "💳" },
  { value: "click", label: "Click", icon: "📱" },
  { value: "card", label: "Bank kartasi", icon: "🏦" },
];

const steps = [
  { title: "To'lov qiling", desc: "1-oy uchun to'lov platformada saqlanadi" },
  {
    title: "Shartnoma tuziladi",
    desc: "Raqamli ijara shartnomasi shakllanadi",
  },
  { title: "Ko'chib kiring", desc: "24 soat ichida tasdiqlang" },
  {
    title: "Oylik to'lovlar",
    desc: "Keyingi oylardan faqat ijara haqi to'lanadi",
  },
];

function handleBook() {
  if (!listing.value) return;

  // If new card and invalid, don't proceed
  if (selectedCardId.value === "new" && !isNewCardValid.value) {
    alert("Iltimos, karta ma'lumotlarini to'liq kiriting");
    return;
  }

  // Save card if requested
  if (selectedCardId.value === "new" && saveCard.value) {
    auth.addCard({ ...newCard.value });
  }

  const platformFee = calculatePlatformFee(listing.value.price);

  const confirmerId = listing.value.createdBy || listing.value.ownerId;

  const dealId = dealsStore.createDeal({
    listingId: listing.value.id,
    tenantId: auth.user?.id || "u1",
    ownerId: listing.value.ownerId,
    confirmerId,
    rentAmount: listing.value.price,
    platformFee,
    total: listing.value.price + platformFee,
    paymentMethod: "card",
  });

  booked.value = true;
  setTimeout(() => router.push(`/tenant/escrow/${dealId}`), 1000);
}
</script>
