<template>
  <div class="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden mt-4">
    <div class="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] ">
      <h4 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">To'lovlar tarixi</h4>
    </div>
    <div class="divide-y divide-[var(--color-border)]">
      <div v-for="pay in payments" :key="pay.id" class="p-4 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-sm">{{ formatMonth(pay.month) }}</span>
            <span 
              class="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase"
              :class="getStatusClass(pay.status)"
            >
              {{ PAYMENT_STATUS_LABELS[pay.status] }}
            </span>
          </div>
          <div class="text-xs text-[var(--color-text-tertiary)] flex items-center gap-2">
            <span>{{ pay.type === 'first_month' ? '1-oylik (to\'liq)' : 'Ijara haqi' }}</span>
            <template v-if="pay.paidAt">
              <span class="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{{ formatDate(pay.paidAt) }}</span>
            </template>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold text-sm">{{ formatPrice(pay.amount) }}</p>
          <button 
            v-if="pay.status !== 'PAID' && showAction" 
            @click="$emit('pay', pay.id)"
            class="mt-2 px-3 py-1 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-lg hover:bg-[var(--color-primary-hover)]"
          >
            To'lash
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!payments?.length" class="p-8 text-center">
      <p class="text-sm text-[var(--color-text-tertiary)]">To'lovlar topilmadi</p>
    </div>
  </div>
</template>

<script setup>
import { formatPrice, formatDate, PAYMENT_STATUS_LABELS } from '@/data/mock'

const props = defineProps({
  payments: {
    type: Array,
    default: () => []
  },
  showAction: {
    type: Boolean,
    default: false
  }
})

defineEmits(['pay'])

function formatMonth(monthStr) {
  const [year, month] = monthStr.split('-')
  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
  return `${months[parseInt(month) - 1]} ${year}`
}

function getStatusClass(status) {
  switch (status) {
    case 'PAID': return 'bg-[var(--color-success-light)] text-[var(--color-success)]'
    case 'PENDING': return 'bg-[var(--color-warning-light)] text-[var(--color-warning)]'
    case 'OVERDUE': return 'bg-red-100 text-red-600'
    case 'PARTIAL': return 'bg-blue-100 text-blue-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}
</script>
