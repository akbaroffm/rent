<template>
  <div class="page bg-white">
    <AppHeader title="To'lovlar" />

    <div class="px-4 py-4">
      <!-- Summary -->
      <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4 mb-5">
        <p class="text-sm text-[var(--color-text-secondary)] mb-1">Umumiy daromad</p>
        <p class="text-2xl font-bold text-[var(--color-success)]">{{ formatPrice(totalReleased) }}</p>
        <div class="flex gap-4 mt-3">
          <div>
            <p class="text-xs text-[var(--color-text-secondary)]">Kutilayotgan</p>
            <p class="text-sm font-semibold text-[var(--color-warning)]">{{ formatPrice(totalPending) }}</p>
          </div>
          <div>
            <p class="text-xs text-[var(--color-text-secondary)]">Muzlatilgan</p>
            <p class="text-sm font-semibold text-[var(--color-danger)]">{{ formatPrice(totalFrozen) }}</p>
          </div>
        </div>
      </div>

      <!-- Rentals Section (Per House Tracking) -->
      <h3 class="font-bold text-lg mb-4">Uylar bo'yicha daromad</h3>
      <div v-for="deal in activeRentals" :key="deal.id" class="mb-6 bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden ">
        <div class="p-4 bg-[var(--color-bg-secondary)] flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-center overflow-hidden shrink-0">
               <img v-if="getListing(deal.listingId)" :src="getListing(deal.listingId).photos[0]" class="w-full h-full object-cover" />
               <Home v-else :size="20" class="text-[var(--color-text-tertiary)]" />
            </div>
            <div class="min-w-0">
              <p class="font-bold text-sm truncate">{{ getListing(deal.listingId)?.title }}</p>
              <p class="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">Faol ijara</p>
            </div>
          </div>
          <router-link :to="`/shared/agreement/${deal.id}`" class="text-[10px] font-bold text-[var(--color-primary)] uppercase flex items-center gap-1">
            Shartnoma <ArrowUpRight :size="12" />
          </router-link>
        </div>
        
        <!-- Quick Ledger Bar -->
        <div class="px-4 py-3 flex items-center gap-1 overflow-x-auto">
          <div v-for="pay in deal.payments" :key="pay.id" 
            class="flex-1 min-w-[60px] text-center p-2 rounded-lg border"
            :class="getLedgerItemClass(pay.status)"
          >
            <p class="text-[9px] uppercase font-bold opacity-70">{{ pay.month.split('-')[1] }} / {{ pay.month.split('-')[0].slice(2) }}</p>
            <p class="text-[11px] font-bold mt-0.5">{{ formatPriceShort(pay.amount) }}</p>
          </div>
        </div>

        <div class="p-4 border-t border-[var(--color-border)] flex justify-between items-center">
          <div>
            <p class="text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold">Jami olingan</p>
            <p class="font-bold text-[var(--color-success)]">{{ formatPrice(getPaidTotalForDeal(deal)) }}</p>
          </div>
          <p class="text-[11px] text-[var(--color-text-secondary)] italic">Keyingi to'lov: {{ getNextPaymentDate(deal) }}</p>
        </div>
      </div>

      <!-- General History -->
      <h3 class="font-semibold mb-3 mt-8">Barcha operatsiyalar</h3>
      <div class="space-y-2">
        <div v-for="deal in allDeals" :key="deal.id" class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl">
          <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            :class="deal.escrowStatus === 'RELEASED' ? 'bg-[var(--color-success-light)]' : 'bg-[var(--color-warning-light)]'">
            <component :is="deal.escrowStatus === 'RELEASED' ? ArrowDownLeft : Clock" :size="16"
              :class="deal.escrowStatus === 'RELEASED' ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ getListing(deal.listingId)?.title }}</p>
            <p class="text-xs text-[var(--color-text-secondary)]">{{ timeAgo(deal.createdAt) }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold"
              :class="deal.escrowStatus === 'RELEASED' ? 'text-[var(--color-success)]' : ''">
              {{ deal.escrowStatus === 'RELEASED' ? '+' : '' }}{{ formatPrice(deal.rentAmount) }}
            </p>
            <StatusBadge :status="deal.escrowStatus" />
          </div>
        </div>
      </div>

      <EmptyState v-if="allDeals.length === 0" title="To'lovlar yo'q" description="Bitimlar yakunlanganda bu yerda ko'rinadi" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDealsStore } from '@/stores/deals'
import { useListingsStore } from '@/stores/listings'
import { useAuthStore } from '@/stores/auth'
import { formatPrice, timeAgo, ESCROW_STATUS } from '@/data/mock'
import AppHeader from '@/components/AppHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { ArrowDownLeft, Clock, Home, ArrowUpRight } from 'lucide-vue-next'

const auth = useAuthStore()
const dealsStore = useDealsStore()
const listingsStore = useListingsStore()

const allDeals = computed(() => dealsStore.getDealsByOwner(auth.user?.id || 'u2'))
const activeRentals = computed(() => allDeals.value.filter(d => d.escrowStatus === ESCROW_STATUS.RENTAL_ACTIVE))

const totalReleased = computed(() => {
  return allDeals.value.reduce((sum, d) => {
    const paidInstallments = d.payments?.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0) || 0
    // In new model, we sum paid installments. In old model, we use rentAmount if RELEASED
    return sum + (d.escrowStatus === ESCROW_STATUS.RELEASED ? d.rentAmount : paidInstallments)
  }, 0)
})

const totalPending = computed(() => {
  return allDeals.value.reduce((sum, d) => {
    const pendingInstallments = d.payments?.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE').reduce((s, p) => s + p.amount, 0) || 0
    return sum + ([ESCROW_STATUS.FUNDS_HELD, ESCROW_STATUS.CHECKIN_PENDING, ESCROW_STATUS.AWAITING_OWNER_CONFIRM].includes(d.escrowStatus) ? d.rentAmount : pendingInstallments)
  }, 0)
})

const totalFrozen = computed(() => allDeals.value
  .filter(d => d.escrowStatus === ESCROW_STATUS.DISPUTE_OPEN)
  .reduce((sum, d) => sum + d.rentAmount, 0))

function getListing(id) { return listingsStore.getListingById(id) }

function formatPriceShort(val) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
  return (val / 1000).toFixed(0) + 'K'
}

function getLedgerItemClass(status) {
  if (status === 'PAID') return 'bg-[var(--color-success-light)] border-[var(--color-success)] text-[var(--color-success)]'
  if (status === 'OVERDUE') return 'bg-red-50 border-red-200 text-red-600'
  return 'bg-gray-50 border-gray-100 text-gray-400'
}

function getPaidTotalForDeal(deal) {
  return deal.payments?.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0) || 0
}

function getNextPaymentDate(deal) {
  const next = deal.payments?.find(p => p.status !== 'PAID')
  if (!next) return 'Noma\'lum'
  return next.month
}
</script>
