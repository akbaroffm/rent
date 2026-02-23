<template>
  <div class="page bg-white">
    <AppHeader title="E'lonlarim" />

    <div class="px-4 py-4">
      <router-link
        :to="createRoute"
        class="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[var(--color-border)] rounded-xl no-underline text-[var(--color-primary)] font-medium mb-5 hover:bg-[var(--color-bg-secondary)] transition-colors"
      >
        <Plus :size="20" /> Yangi e'lon qo'shish
      </router-link>

      <div v-if="listings.length === 0">
        <EmptyState
          title="E'lonlar yo'q"
          description="Birinchi e'loningizni qo'shing"
        />
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="l in listings"
          :key="l.id"
          class="border border-[var(--color-border)] rounded-xl overflow-hidden"
        >
          <router-link
            :to="`/tenant/listing/${l.id}`"
            class="flex gap-3 p-3 no-underline text-[var(--color-text)]"
          >
            <img
              :src="l.photos[0]"
              class="w-20 h-20 rounded-lg object-cover shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-sm truncate">{{ l.title }}</h3>
              <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {{ l.address }}
              </p>
              <p class="text-sm font-semibold mt-1">
                {{ formatPrice(l.price)
                }}<span class="font-normal text-[var(--color-text-secondary)]">
                  / oy</span
                >
              </p>
              <div class="flex items-center gap-2 mt-1.5">
                <span
                  class="badge text-[10px]"
                  :class="l.status === 'active' ? 'badge-success' : ''"
                >
                  {{ l.status === "active" ? "Faol" : "Band" }}
                </span>
                <span class="text-xs text-[var(--color-text-tertiary)]">
                  <Eye :size="10" class="inline" /> {{ l.views }}
                </span>
              </div>
            </div>
          </router-link>
          <div class="flex border-t border-[var(--color-border)]">
            <router-link
              :to="editRoute(l.id)"
              class="flex-1 py-2.5 text-xs font-medium text-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors no-underline"
            >
              <Pencil :size="12" class="inline" /> Tahrirlash
            </router-link>
            <div class="w-px bg-[var(--color-border)]"></div>
            <button
              @click="toggleStatus(l)"
              class="flex-1 py-2.5 text-xs font-medium text-center hover:bg-[var(--color-bg-secondary)] transition-colors"
              :class="
                l.status === 'active'
                  ? 'text-[var(--color-warning)]'
                  : 'text-[var(--color-success)]'
              "
            >
              {{ l.status === "active" ? "Band qilish" : "Faollashtirish" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useListingsStore } from "@/stores/listings";
import { useAuthStore } from "@/stores/auth";
import { formatPrice } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import EmptyState from "@/components/EmptyState.vue";
import { Plus, Eye, Pencil } from "lucide-vue-next";

const auth = useAuthStore();
const listingsStore = useListingsStore();

const listings = computed(() =>
  listingsStore.getOwnerListings(auth.user?.id || "u2"),
);

const createRoute = computed(() => "/owner/create");
function editRoute(id) {
  return `/owner/edit/${id}`;
}

function toggleStatus(listing) {
  listingsStore.updateListingStatus(
    listing.id,
    listing.status === "active" ? "occupied" : "active",
  );
}
</script>
