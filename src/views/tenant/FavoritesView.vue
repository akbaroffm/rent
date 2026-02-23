<template>
  <div class="page bg-white">
    <AppHeader title="Sevimlilar" />

    <div class="px-4 py-4">
      <div v-if="listingsStore.favoriteListings.length === 0">
        <EmptyState title="Sevimlilar bo'sh" description="Yoqtirgan e'lonlarni ❤️ belgisi bilan saqlang" />
      </div>
      <div v-else class="grid grid-cols-1 gap-6">
        <ListingCard v-for="l in listingsStore.favoriteListings" :key="l.id" :listing="l" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useListingsStore } from '@/stores/listings'
import AppHeader from '@/components/AppHeader.vue'
import ListingCard from '@/components/ListingCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const listingsStore = useListingsStore()
</script>
