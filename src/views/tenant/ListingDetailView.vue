<template>
  <div class="page bg-white">
    <AppHeader :title="listing.title">
      <template #actions>
        <button
          @click="listingsStore.toggleFavorite(listing.id)"
          class="w-9 h-9 flex items-center justify-center"
        >
          <Heart
            :size="20"
            :fill="isFav ? 'var(--color-primary)' : 'none'"
            :class="isFav ? 'text-[var(--color-primary)]' : ''"
          />
        </button>
      </template>
    </AppHeader>

    <!-- Gallery -->
    <div class="relative">
      <div class="overflow-x-auto flex snap-x snap-mandatory" ref="gallery">
        <div
          v-for="(photo, i) in listing.photos"
          :key="i"
          class="w-full shrink-0 snap-center"
        >
          <img
            :src="photo"
            class="w-full aspect-[4/3] object-cover"
            :alt="listing.title"
          />
        </div>
      </div>
      <span
        class="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full"
      >
        {{ currentPhoto + 1 }} / {{ listing.photos.length }} rasm
      </span>
    </div>

    <div class="px-4 py-4">
      <!-- Title + views -->
      <div class="flex items-start justify-between gap-3 mb-1">
        <h1 class="text-xl font-bold leading-tight">{{ listing.title }}</h1>
        <div
          class="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] shrink-0 mt-1"
        >
          <Eye :size="14" />
          <span>{{ listing.views }}</span>
        </div>
      </div>
      <p class="text-sm text-[var(--color-text-secondary)] mb-4">
        {{ listing.address }}
      </p>

      <!-- Key stats -->
      <div class="grid grid-cols-3 gap-3 mb-5">
        <div class="text-center py-3 bg-[var(--color-bg-secondary)] rounded-xl">
          <p class="font-bold text-lg">{{ listing.rooms }}</p>
          <p class="text-xs text-[var(--color-text-secondary)]">xona</p>
        </div>
        <div class="text-center py-3 bg-[var(--color-bg-secondary)] rounded-xl">
          <p class="font-bold text-lg">{{ listing.area }}</p>
          <p class="text-xs text-[var(--color-text-secondary)]">m²</p>
        </div>
        <div class="text-center py-3 bg-[var(--color-bg-secondary)] rounded-xl">
          <p class="font-bold text-lg">
            {{ listing.floor }}/{{ listing.totalFloors }}
          </p>
          <p class="text-xs text-[var(--color-text-secondary)]">qavat</p>
        </div>
      </div>

      <!-- Utilities badge -->
      <div class="flex items-center gap-2 mb-5">
        <span
          class="px-3 py-1.5 rounded-full text-xs font-medium"
          :class="
            listing.utilitiesType === 'included'
              ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
              : 'bg-[var(--color-warning-light)] text-[var(--color-warning)]'
          "
        >
          {{
            listing.utilitiesType === "included"
              ? "Kommunal kiritilgan"
              : listing.utilitiesType === "partial"
                ? "Qisman kiritilgan"
                : "Kommunal alohida"
          }}
        </span>
        <span
          class="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-bg-secondary)]"
        >
          Depozit: {{ formatPrice(listing.deposit) }}
        </span>
      </div>

      <!-- Features -->
      <div class="mb-5">
        <h3 class="font-semibold mb-3">Xususiyatlar</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="f in activeFeatures" :key="f.key" class="badge">
            {{ f.label }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-5">
        <h3 class="font-semibold mb-2">Tavsif</h3>
        <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {{ listing.description }}
        </p>
      </div>

      <!-- Rules -->
      <div v-if="listing.rules" class="mb-5">
        <h3 class="font-semibold mb-2">Uy qoidalari</h3>
        <p class="text-sm text-[var(--color-text-secondary)]">
          {{ listing.rules }}
        </p>
      </div>

      <!-- Availability Calendar -->
      <div class="mb-5">
        <h3 class="font-semibold mb-3">Mavjud sanalar</h3>
        <div class="border border-[var(--color-border)] rounded-xl p-3">
          <!-- ... calendar header and grid ... -->
          <div class="flex items-center justify-between mb-3">
            <button @click="prevMonth" class="p-1">
              <ChevronLeft :size="18" />
            </button>
            <span class="font-semibold text-sm">{{ calendarTitle }}</span>
            <button @click="nextMonth" class="p-1">
              <ChevronRight :size="18" />
            </button>
          </div>
          <div class="grid grid-cols-7 gap-1 text-center text-xs">
            <span
              v-for="d in ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']"
              :key="d"
              class="text-[var(--color-text-tertiary)] py-1"
              >{{ d }}</span
            >
            <div
              v-for="(day, i) in calendarDays"
              :key="i"
              class="py-1.5 rounded-lg text-xs transition-colors"
              :class="getDayClass(day)"
            >
              {{ day?.getDate() || "" }}
            </div>
          </div>
          <div
            class="flex items-center gap-2 mt-3 pt-2 border-t border-[var(--color-border)] text-xs"
          >
            <CalendarDays :size="14" class="text-[var(--color-success)]" />
            <span class="text-[var(--color-text-secondary)]">
              {{ formatDate(listing.availableFrom) }}
              <template v-if="listing.availableTo">
                — {{ formatDate(listing.availableTo) }}</template
              >
              <template v-else> dan bo'sh</template>
            </span>
          </div>
        </div>
      </div>

      <!-- Location Map -->
      <div class="mb-8">
        <h3 class="font-semibold mb-3">Joylashuv</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mb-3">
          {{ listing.address }}
        </p>
        <div
          class="h-[200px] rounded-xl overflow-hidden border border-[var(--color-border)]"
        >
          <MapComponent
            v-if="listing.geo"
            :modelValue="listing.geo"
            mode="view"
            :zoom="14"
          />
        </div>
      </div>

      <!-- Owner info -->
      <div class="mb-5">
        <h3 class="font-semibold mb-3">Uy egasi</h3>
        <div
          class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl"
        >
          <div
            class="w-11 h-11 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center shrink-0"
          >
            <UserIcon :size="18" class="text-[var(--color-text-secondary)]" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <p class="font-semibold text-sm">{{ contactUser?.name }}</p>
              <span
                v-if="contactUser?.verified"
                class="badge badge-success text-[10px] py-0.5"
              >
                <BadgeCheck :size="10" /> Tasdiqlangan
              </span>
            </div>
            <p
              v-if="contactUser?.rating"
              class="text-xs text-[var(--color-text-secondary)]"
            >
              ⭐ {{ contactUser.rating }} · {{ contactUser.dealsCount }} ta
              bitim
            </p>
          </div>
          <router-link
            v-if="chatConvId"
            :to="`/tenant/chat/${chatConvId}`"
            class="p-2 rounded-full border border-[var(--color-border)] no-underline text-[var(--color-text)]"
          >
            <MessageCircle :size="18" />
          </router-link>
        </div>
      </div>

      <!-- Schedule viewing -->
      <div
        class="mb-5 border border-[var(--color-border)] rounded-xl overflow-hidden"
      >
        <button
          @click="showViewing = !showViewing"
          class="w-full flex items-center justify-between p-4 text-left"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0"
            >
              <CalendarCheck :size="18" class="text-[var(--color-primary)]" />
            </div>
            <div>
              <p class="font-semibold text-sm">Ko'rishni belgilash</p>
              <p class="text-xs text-[var(--color-text-secondary)]">
                Uy egasi bilan uchrashish
              </p>
            </div>
          </div>
          <ChevronDown
            :size="16"
            class="text-[var(--color-text-tertiary)] transition-transform"
            :class="showViewing ? 'rotate-180' : ''"
          />
        </button>

        <div
          v-if="showViewing"
          class="px-4 pb-4 space-y-3 border-t border-[var(--color-border)] pt-3"
        >
          <p class="text-xs text-[var(--color-text-secondary)]">
            Bron qilishdan oldin uyni ko'rishni tavsiya etamiz. Uy egasi bilan
            qanday bog'lanmoqchisiz?
          </p>

          <!-- Chat option -->
          <router-link
            v-if="chatConvId"
            :to="`/tenant/chat/${chatConvId}`"
            class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <MessageCircle :size="18" class="text-[var(--color-primary)]" />
            <div class="flex-1">
              <p class="text-sm font-medium">Chat orqali yozish</p>
              <p class="text-xs text-[var(--color-text-secondary)]">
                Vaqt va joyni kelishib oling
              </p>
            </div>
            <ChevronRight
              :size="16"
              class="text-[var(--color-text-tertiary)]"
            />
          </router-link>

          <!-- Phone option -->
          <a
            :href="`tel:${contactUser?.phone}`"
            class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <Phone :size="18" class="text-[var(--color-success)]" />
            <div class="flex-1">
              <p class="text-sm font-medium">Telefon qilish</p>
              <p class="text-xs text-[var(--color-text-secondary)]">
                {{ contactUser?.phone }}
              </p>
            </div>
            <ChevronRight
              :size="16"
              class="text-[var(--color-text-tertiary)]"
            />
          </a>

          <!-- Info about who confirms -->
          <div
            class="bg-[var(--color-bg-secondary)] rounded-lg p-3 text-xs text-[var(--color-text-secondary)]"
          >
            <strong>Eslatma:</strong> Bu e'lonni uy egasi joylashtirgan. Bron
            qilganingizda, uy egasi tasdiqlaydi.
          </div>
        </div>
      </div>

      <!-- Price breakdown -->
      <PriceBreakdown class="mb-10" :rentAmount="listing.price" />

      <!-- Sticky CTA -->
      <div
        class="fixed bottom-[50px] left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white p-4 z-999"
      >
        <router-link
          :to="`/tenant/booking/${listing.id}`"
          class="btn-primary no-underline"
        >
          Bron qilish · {{ formatPrice(listing.price) }} / oy
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useListingsStore } from "@/stores/listings";
import { useChatStore } from "@/stores/chat";
import { useAuthStore } from "@/stores/auth";
import { formatPrice, formatDate, getUserById, FEATURES } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import PriceBreakdown from "@/components/PriceBreakdown.vue";
import MapComponent from "@/components/MapComponent.vue";
import {
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  CalendarCheck,
  Phone,
  User as UserIcon,
  BadgeCheck,
  MessageCircle,
} from "lucide-vue-next";

const route = useRoute();
const listingsStore = useListingsStore();
const chatStore = useChatStore();
const auth = useAuthStore();

const currentPhoto = ref(0);
const gallery = ref(null);
const showViewing = ref(false);
const currentUserId = computed(() => auth.user?.id || "u1");

const listing = computed(
  () => listingsStore.getListingById(route.params.id) || {},
);
const isFav = computed(() => listingsStore.isFavorite(listing.value.id));

const contactUser = computed(() => getUserById(listing.value.ownerId));

const chatConvId = computed(() => {
  const otherId = contactUser.value?.id;
  if (!otherId || !listing.value.id) return null;
  const conv = chatStore.conversations.find(
    (c) =>
      c.listingId === listing.value.id &&
      c.participants.includes(currentUserId.value) &&
      c.participants.includes(otherId),
  );
  return conv?.id || null;
});

const activeFeatures = computed(() => {
  if (!listing.value.features) return [];
  return FEATURES.filter((f) => listing.value.features[f.key]);
});

// Calendar
const calendarMonth = ref(new Date().getMonth());
const calendarYear = ref(new Date().getFullYear());

const calendarTitle = computed(() => {
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  return `${months[calendarMonth.value]} ${calendarYear.value}`;
});

const calendarDays = computed(() => {
  const first = new Date(calendarYear.value, calendarMonth.value, 1);
  const lastDay = new Date(
    calendarYear.value,
    calendarMonth.value + 1,
    0,
  ).getDate();
  let startDay = first.getDay();
  if (startDay === 0) startDay = 7;
  startDay--;
  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= lastDay; d++) {
    days.push(new Date(calendarYear.value, calendarMonth.value, d));
  }
  return days;
});

function getDayClass(day) {
  if (!day) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (day < today)
    return "text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)]";
  const from = listing.value.availableFrom
    ? new Date(listing.value.availableFrom)
    : null;
  const to = listing.value.availableTo
    ? new Date(listing.value.availableTo)
    : null;
  // Start/end markers
  if (from && day.toDateString() === from.toDateString())
    return "bg-[var(--color-success)] text-white font-bold";
  if (to && day.toDateString() === to.toDateString())
    return "bg-[var(--color-success)] text-white font-bold";
  // Range
  if (from && to && day > from && day < to)
    return "bg-[var(--color-success-light)] text-[var(--color-success)] font-medium";
  // Open-ended (no end date)
  if (from && !to && day > from)
    return "bg-[var(--color-success-light)] text-[var(--color-success)]";
  return "";
}

function prevMonth() {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11;
    calendarYear.value--;
  } else calendarMonth.value--;
}
function nextMonth() {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0;
    calendarYear.value++;
  } else calendarMonth.value++;
}

onMounted(() => {
  if (listing.value.id) listingsStore.incrementViews(listing.value.id);

  if (listing.value.id && contactUser.value?.id && !chatConvId.value) {
    chatStore.startConversation(
      currentUserId.value,
      contactUser.value.id,
      listing.value.id,
    );
  }

  // scroll gallery observer
  if (gallery.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            currentPhoto.value = Array.from(gallery.value.children).indexOf(
              e.target,
            );
          }
        });
      },
      { root: gallery.value, threshold: 0.5 },
    );
    Array.from(gallery.value.children).forEach((el) => observer.observe(el));
  }
});
</script>
