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
      <div class="grid grid-cols-3 gap-3 mb-3">
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
      <div class="flex items-center gap-2 mb-4">
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
      <div class="mb-4">
        <h3 class="font-semibold mb-1">Xususiyatlar</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="f in activeFeatures" :key="f.key" class="badge">
            {{ f.label }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-4">
        <h3 class="font-semibold mb-1">Tavsif</h3>
        <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {{ listing.description }}
        </p>
      </div>

      <!-- Rules -->
      <div v-if="listing.rules" class="mb-4">
        <h3 class="font-semibold mb-1">Uy qoidalari</h3>
        <p class="text-sm text-[var(--color-text-secondary)]">
          {{ listing.rules }}
        </p>
      </div>

      <!-- Location Map -->
      <div class="mb-6">
        <h3 class="font-semibold mb-1">Joylashuv</h3>
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
      <div class="mb-4">
        <h3 class="font-semibold mb-1">Uy egasi</h3>
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
          <!-- <router-link
            v-if="chatConvId"
            :to="`/tenant/chat/${chatConvId}`"
            class="p-2 rounded-full border border-[var(--color-border)] no-underline text-[var(--color-text)]"
          >
            <MessageCircle :size="18" />
          </router-link> -->
        </div>
      </div>

      <!-- Quick contact options -->
      <div class="p-4 bg-[var(--color-bg-secondary)] rounded-xl">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-xs text-[var(--color-text-secondary)]">Oy narxi</p>
            <p class="text-lg font-bold">{{ formatPrice(listing.price) }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-[var(--color-text-secondary)]">Depozit</p>
            <p class="text-lg font-bold">{{ formatPrice(listing.deposit) }}</p>
          </div>
        </div>
        <p class="text-xs text-[var(--color-text-secondary)] mb-3">
          Uy egasi bilan bog'lanish yoki to'g'ridan-to'g'ri bron qilish:
        </p>
        <div class="flex gap-2">
          <!-- Chat option -->
          <router-link
            v-if="chatConvId"
            :to="`/tenant/chat/${chatConvId}`"
            class="flex-1 flex items-center justify-center gap-1.5 p-2 border border-[var(--color-border)] rounded-lg no-underline text-[var(--color-text)] hover:bg-white transition-colors text-xs font-medium bg-white"
          >
            <MessageCircle :size="14" class="text-[var(--color-primary)]" />
            Chat
          </router-link>

          <!-- Phone option -->
          <a
            :href="`tel:${contactUser?.phone}`"
            class="flex-1 flex items-center justify-center gap-1.5 p-2 border border-[var(--color-border)] rounded-lg no-underline text-[var(--color-text)] hover:bg-white transition-colors text-xs font-medium bg-white"
          >
            <Phone :size="14" class="text-[var(--color-success)]" />
            Telefon
          </a>

          <!-- Book button -->
          <router-link
            :to="`/tenant/booking/${listing.id}`"
            class="flex-1 flex items-center justify-center gap-1.5 p-2 bg-[var(--color-primary)] text-white rounded-lg no-underline font-medium text-xs hover:opacity-90 transition-opacity"
          >
            Bron
          </router-link>
        </div>
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
