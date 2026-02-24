<template>
  <div class="page bg-white pb-20">
    <!-- Header -->
    <AppHeader title="IjaraSafe" :showBack="false">
      <template #actions>
        <router-link
          to="/tenant/notifications"
          class="relative w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text)] no-underline"
        >
          <Bell :size="20" />
          <span
            v-if="unreadCount > 0"
            class="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[var(--color-primary)] ring-2 ring-white"
          ></span>
        </router-link>
      </template>
    </AppHeader>

    <div class="px-4 pt-4">
      <!-- Search bar -->
      <router-link
        to="/tenant/search"
        class="flex items-center gap-3 px-4 py-3 rounded-full border border-[var(--color-border)] bg-white no-underline text-[var(--color-text)]"
      >
        <Search :size="18" class="text-[var(--color-text-secondary)]" />
        <div>
          <p class="text-sm font-medium">Qayerdan qidirasiz?</p>
          <p class="text-xs text-[var(--color-text-tertiary)]">
            Tuman · xona soni · narx
          </p>
        </div>
      </router-link>
    </div>

    <!-- Categorized Sections -->
    <div class="space-y-4 mt-4 mb-8">
      <div v-for="sec in sections" :key="sec.key">
        <div class="flex items-center justify-between mb-3 px-4">
          <h2 class="text-lg font-bold">{{ sec.title }}</h2>
          <button
            @click="seeAll(sec.key)"
            class="text-sm font-semibold text-[var(--color-primary)] flex items-center gap-1"
          >
            Barchasi <ChevronRight :size="16" />
          </button>
        </div>

        <div class="flex gap-4 overflow-x-auto pb-4 px-4">
          <div
            v-for="listing in sec.listings"
            :key="listing.id"
            class="w-[calc(50%-8px)] shrink-0 snap-start"
          >
            <ListingCard :listing="listing" />
          </div>

          <!-- See all card at the end -->
          <div class="w-[calc(50%-8px)] shrink-0 snap-start flex flex-col">
            <button
              @click="seeAll(sec.key)"
              class="w-full aspect-[4/3] flex flex-col items-center justify-center gap-2 text-[var(--color-primary)] active:scale-95 transition-transform border border-dashed border-[var(--color-primary)] rounded-xl bg-[var(--color-primary-light)]/30"
            >
              <div
                class="w-10 h-10 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center bg-white shadow-sm"
              >
                <ArrowRight :size="18" />
              </div>
              <span
                class="text-[11px] font-bold uppercase tracking-wider text-center"
                >Barchasini<br />ko'rish</span
              >
            </button>
          </div>
        </div>

        <!-- Empty fallback if logic fails -->
        <div
          v-if="sec.listings.length === 0"
          class="px-4 text-xs text-[var(--color-text-tertiary)] italic"
        >
          Bu bo'limda hozircha e'lonlar yo'q
        </div>
      </div>
    </div>

    <!-- Floating Map Button -->
    <button
      @click="goToMap"
      class="fixed bottom-18 left-1/2 -translate-x-1/2 z-40 bg-[var(--color-secondary)] text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl font-bold text-sm transition-transform"
    >
      <Map :size="18" /> Xaritada ko'rish
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useListingsStore } from "@/stores/listings";
import { useNotificationsStore } from "@/stores/notifications";
import { useAuthStore } from "@/stores/auth";
import AppHeader from "@/components/AppHeader.vue";
import ListingCard from "@/components/ListingCard.vue";
import { Search, Bell, Map, ArrowRight, ChevronRight } from "lucide-vue-next";

const store = useListingsStore();
const notificationsStore = useNotificationsStore();
const authStore = useAuthStore();
const router = useRouter();

const unreadCount = computed(() =>
  notificationsStore.getUnreadCount(authStore.user?.id || "u1"),
);

const sections = computed(() => [
  { key: "new", title: "Yangi e'lonlar", listings: store.newListings },
  {
    key: "cheapest",
    title: "Hamyonbop variantlar",
    listings: store.cheapestListings,
  },
  { key: "popular", title: "Ommabop", listings: store.popularListings },
  { key: "premium", title: "Premium uylar", listings: store.premiumListings },
]);

function seeAll(category) {
  store.clearFilters();
  store.setFilters({ specialCategory: category });
  router.push("/tenant/search");
}

function goToMap() {
  store.clearFilters();
  router.push("/tenant/map");
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
