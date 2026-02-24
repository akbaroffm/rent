<template>
  <div class="page bg-white h-dvh flex flex-col">
    <!-- Header -->
    <div
      class="px-4 py-3 flex items-center gap-3 border-b border-[var(--color-border)]"
    >
      <button @click="$router.back()" class="p-2 -ml-2">
        <ArrowLeft :size="20" />
      </button>
      <div class="flex-1 relative">
        <Search
          :size="16"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
        />
        <input
          v-model="searchQuery"
          @input="applySearch"
          type="text"
          placeholder="Tuman, manzil, kalit so'z..."
          class="w-full bg-[var(--color-bg-secondary)] rounded-full py-2 pl-9 pr-4 text-sm outline-none border border-transparent focus:border-[var(--color-border-dark)]"
        />
      </div>
    </div>

    <!-- Category Chips -->
    <div
      class="px-4 py-2 border-b border-[var(--color-border)] flex gap-2 overflow-x-auto no-scrollbar bg-white z-10 relative"
    >
      <button
        @click="toggleSpecialCategory(null)"
        class="shrink-0 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors cursor-pointer"
        :class="
          !store.filters.specialCategory
            ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
            : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
        "
      >
        Barchasi
      </button>
      <button
        v-for="cat in specialCategories"
        :key="cat.key"
        @click="toggleSpecialCategory(cat.key)"
        class="shrink-0 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors cursor-pointer"
        :class="
          store.filters.specialCategory === cat.key
            ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
            : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
        "
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Map -->
    <div class="flex-1 relative">
      <MapComponent
        :markers="mapMarkers"
        mode="search"
        @marker-click="onMarkerClick"
      />

      <!-- Floating Listing Card -->
      <Transition name="slide-up">
        <div
          v-if="selectedListing"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-[1000]"
        >
          <div
            class="bg-white rounded-2xl shadow-xl overflow-hidden flex gap-3 p-3 relative"
          >
            <button
              @click="selectedListing = null"
              class="absolute top-2 right-2 p-1 bg-white/80 rounded-full z-10"
            >
              <X :size="14" />
            </button>
            <img
              :src="selectedListing.photos[0]"
              class="w-24 h-24 rounded-xl object-cover shrink-0"
            />
            <div class="flex-1 min-w-0 pr-4">
              <h3 class="font-bold text-sm truncate">
                {{ selectedListing.title }}
              </h3>
              <p
                class="text-[11px] text-[var(--color-text-secondary)] truncate"
              >
                {{ selectedListing.address }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <span class="font-bold text-sm">{{
                  formatPrice(selectedListing.price)
                }}</span>
                <span class="text-[10px] text-[var(--color-text-tertiary)]"
                  >/ oy</span
                >
              </div>
              <router-link
                :to="`/tenant/listing/${selectedListing.id}`"
                class="inline-block mt-2 text-[11px] font-bold text-[var(--color-primary)] no-underline"
              >
                Ko'rib chiqish →
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useListingsStore } from "@/stores/listings";
import { formatPrice } from "@/data/mock";
import MapComponent from "@/components/MapComponent.vue";
import { ArrowLeft, Search, X, SlidersHorizontal } from "lucide-vue-next";

const store = useListingsStore();
const searchQuery = ref(store.filters.search);
const selectedListing = ref(null);

const mapMarkers = computed(() => {
  return store.filteredListings
    .map((l) => ({
      id: l.id,
      lat: l.geo?.lat,
      lng: l.geo?.lng,
      title: l.title,
      price: formatPrice(l.price),
    }))
    .filter((m) => m.lat && m.lng);
});

const specialCategories = [
  { key: "new", label: "Yangi" },
  { key: "cheapest", label: "Hamyonbop" },
  { key: "popular", label: "Ommabop" },
  { key: "premium", label: "Premium" },
];

function toggleSpecialCategory(key) {
  store.setFilters({ specialCategory: key, sortBy: "newest" });
}

function applySearch() {
  store.setFilters({ search: searchQuery.value });
}

function onMarkerClick(marker) {
  selectedListing.value = store.getListingById(marker.id);
}
</script>

<style scoped>
.page {
  padding-bottom: 0 !important;
}
</style>
