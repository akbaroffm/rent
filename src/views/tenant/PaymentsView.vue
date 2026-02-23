<template>
  <div class="page min-h-dvh">
    <AppHeader title="To'lovlarim" />

    <div class="px-4 py-4">
      <!-- Financial Summary -->
      <div class="bg-white rounded-2xl p-5  border border-[var(--color-border)] mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider">Jami to'langan</p>
            <p class="text-2xl font-black text-[var(--color-text)]">{{ formatPrice(totalPaid) }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-[var(--color-success-light)] flex items-center justify-center">
            <Wallet :size="20" class="text-[var(--color-success)]" />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
          <div>
            <p class="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold">Kutilmoqda</p>
            <p class="font-bold text-[var(--color-warning)]">{{ formatPrice(totalPending) }}</p>
          </div>
          <div>
            <p class="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold">Muddati o'tgan</p>
            <p class="font-bold text-red-600">{{ formatPrice(totalOverdue) }}</p>
          </div>
        </div>
      </div>

      <!-- Active Rentals Ledger -->
      <h3 class="font-bold text-lg mb-4">Ijara to'lovlari grafigi</h3>
      <div v-if="activeRentals.length === 0" class="bg-white p-8 rounded-2xl text-center border border-[var(--color-border)]">
        <p class="text-[var(--color-text-secondary)] text-sm">Hozircha faol ijaralar yo'q</p>
      </div>

      <div v-else class="space-y-6">
        <div v-for="deal in activeRentals" :key="deal.id" class="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div class="p-4 bg-[var(--color-bg-secondary)] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Home :size="18" class="text-[var(--color-primary)]" />
              <p class="font-bold text-sm truncate">{{ getListing(deal.listingId)?.title }}</p>
            </div>
            <router-link :to="`/tenant/escrow/${deal.id}`" class="text-[10px] font-bold text-[var(--color-primary)] uppercase">
              Tafsilotlar →
            </router-link>
          </div>
          
          <PaymentLedger 
            :payments="deal.payments" 
            showAction 
            @pay="(pid) => handlePay(deal, pid)"
          />
        </div>
      </div>

      <!-- Payment Confirmation Drawer -->
      <PaymentDrawer 
        :is-open="isPaymentDrawerOpen"
        :amount="selectedInstallment?.amount"
        :month="formatMonth(selectedInstallment?.month)"
        @close="isPaymentDrawerOpen = false"
        @confirm="handleConfirmPayment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDealsStore } from '@/stores/deals'
import { useListingsStore } from '@/stores/listings'
import { useAuthStore } from '@/stores/auth'
import { formatPrice, ESCROW_STATUS } from '@/data/mock'
import AppHeader from '@/components/AppHeader.vue'
import PaymentLedger from '@/components/PaymentLedger.vue'
import PaymentDrawer from '@/components/PaymentDrawer.vue'
import { Wallet, Home } from 'lucide-vue-next'

const auth = useAuthStore()
const dealsStore = useDealsStore()
const listingsStore = useListingsStore()

const isPaymentDrawerOpen = ref(false)
const selectedDeal = ref(null)
const selectedInstallment = ref(null)

const myDeals = computed(() => dealsStore.getDealsByTenant(auth.user?.id || 'u1'))
const activeRentals = computed(() => myDeals.value.filter(d => d.escrowStatus === ESCROW_STATUS.RENTAL_ACTIVE))

const totalPaid = computed(() => {
  return myDeals.value.reduce((sum, d) => {
    return sum + (d.payments?.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0) || 0)
  }, 0)
})

const totalPending = computed(() => {
  return myDeals.value.reduce((sum, d) => {
    return sum + (d.payments?.filter(p => p.status === 'PENDING').reduce((s, p) => s + p.amount, 0) || 0)
  }, 0)
})

const totalOverdue = computed(() => {
  return myDeals.value.reduce((sum, d) => {
    return sum + (d.payments?.filter(p => p.status === 'OVERDUE').reduce((s, p) => s + p.amount, 0) || 0)
  }, 0)
})

function getListing(id) { return listingsStore.getListingById(id) }

function handlePay(deal, paymentId) {
  selectedDeal.value = deal
  selectedInstallment.value = deal.payments.find(p => p.id === paymentId)
  isPaymentDrawerOpen.value = true
}

function handleConfirmPayment() {
  if (selectedDeal.value && selectedInstallment.value) {
    dealsStore.payInstallment(selectedDeal.value.id, selectedInstallment.value.id)
    isPaymentDrawerOpen.value = false
    selectedDeal.value = null
    selectedInstallment.value = null
  }
}

function formatMonth(monthStr) {
  if (!monthStr) return ''
  const [year, month] = monthStr.split('-')
  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
  return `${months[parseInt(month) - 1]} ${year}`
}
</script>
