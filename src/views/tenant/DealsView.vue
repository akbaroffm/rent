<template>
  <div class="page bg-white">
    <AppHeader title="Bitimlarim" />

    <div class="px-4 py-4">
      <div v-if="deals.length === 0">
        <EmptyState title="Bitimlar yo'q" description="Uy bron qilganingizda bu yerda ko'rinadi" />
      </div>

      <div v-else class="space-y-3">
        <router-link
          v-for="deal in deals"
          :key="deal.id"
          :to="`/tenant/escrow/${deal.id}`"
          class="block p-4 border border-[var(--color-border)] rounded-xl no-underline text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-secondary)]"
        >
          <div class="flex items-start gap-3">
            <img v-if="getListing(deal.listingId)" :src="getListing(deal.listingId).photos[0]" class="w-14 h-14 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm truncate">{{ getListing(deal.listingId)?.title || 'E\'lon' }}</p>
              <div v-if="deal.escrowStatus === 'RENTAL_ACTIVE' && deal.payments?.length" class="mt-1">
                <p class="text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold">Oxirgi to'lov</p>
                <p class="text-xs font-semibold">{{ formatPrice(deal.payments[deal.payments.length - 1].amount) }} ({{ PAYMENT_STATUS_LABELS[deal.payments[deal.payments.length - 1].status] }})</p>
              </div>
              <p v-else class="text-xs text-[var(--color-text-secondary)] mt-0.5">{{ formatPrice(deal.total) }}</p>
              <div class="mt-2">
                <StatusBadge :status="deal.escrowStatus" />
              </div>
            </div>
            <ChevronRight :size="18" class="text-[var(--color-text-tertiary)] shrink-0 mt-1" />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDealsStore } from '@/stores/deals'
import { useListingsStore } from '@/stores/listings'
import { useAuthStore } from '@/stores/auth'
import { formatPrice, PAYMENT_STATUS_LABELS } from '@/data/mock'
import AppHeader from '@/components/AppHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { ChevronRight } from 'lucide-vue-next'

const dealsStore = useDealsStore()
const listingsStore = useListingsStore()
const auth = useAuthStore()

const deals = computed(() => dealsStore.getDealsByTenant(auth.user?.id || 'u1'))

function getListing(id) {
  return listingsStore.getListingById(id)
}
</script>
