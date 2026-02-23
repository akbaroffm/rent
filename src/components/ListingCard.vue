<template>
  <router-link
    :to="`/tenant/listing/${listing.id}`"
    class="block w-full no-underline text-[var(--color-text)]"
  >
    <!-- Photo -->
    <div
      class="relative rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]"
      style="aspect-ratio: 4/3"
    >
      <img
        :src="listing.photos[0]"
        :alt="listing.title"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Favorite -->
      <button
        @click.prevent="toggleFav"
        class="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"
      >
        <Heart
          :size="16"
          :fill="isFav ? 'var(--color-primary)' : 'none'"
          :class="
            isFav
              ? 'text-[var(--color-primary)]'
              : 'text-[var(--color-text-secondary)]'
          "
        />
      </button>

      <!-- Photos count -->
      <span
        class="absolute bottom-2 right-2 z-10 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full"
      >
        {{ listing.photos.length }} ta rasm
      </span>

      <!-- Feature chips on image -->
      <div
        v-if="listing.features.furnished"
        class="absolute bottom-2 left-2 z-10"
      >
        <span
          class="bg-white/90 text-[var(--color-text)] text-[10px] font-medium px-2 py-0.5 rounded-full"
        >
          Mebelli
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="pt-2.5 pb-1">
      <div class="flex items-center justify-between">
        <span class="font-semibold text-sm">{{ listing.district }}</span>
        <div
          class="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]"
        >
          <Eye :size="12" />
          <span>{{ listing.views }}</span>
        </div>
      </div>
      <p class="text-[13px] text-[var(--color-text-secondary)] truncate mt-0.5">
        {{ listing.title }}
      </p>
      <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">
        {{ listing.rooms }} xona · {{ listing.area }} m² ·
        {{ listing.floor }}-qavat
      </p>
      <div class="flex items-center gap-2 mt-1.5">
        <p class="font-bold text-[15px]">{{ formatPrice(listing.price) }}</p>
        <span class="text-xs text-[var(--color-text-tertiary)]">/ oy</span>
      </div>
      <!-- Utilities badge -->
      <span
        class="text-[10px] mt-1 inline-block px-2 py-0.5 rounded-full"
        :class="
          listing.utilitiesType === 'included'
            ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]'
        "
      >
        {{
          listing.utilitiesType === "included"
            ? "Kommunal kiritilgan"
            : "Kommunal alohida"
        }}
      </span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from "vue";
import { useListingsStore } from "@/stores/listings";
import { formatPrice } from "@/data/mock";
import { Heart, Eye } from "lucide-vue-next";

const props = defineProps({ listing: Object });
const listingsStore = useListingsStore();

const isFav = computed(() => listingsStore.isFavorite(props.listing.id));
function toggleFav() {
  listingsStore.toggleFavorite(props.listing.id);
}
</script>
