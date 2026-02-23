<template>
  <span
    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full"
    :class="colorClasses"
  >
    <component :is="icon" v-if="icon" :size="12" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { ESCROW_STATUS_LABELS, ESCROW_STATUS_COLORS } from '@/data/mock'
import { Clock, CheckCircle, AlertCircle, XCircle, Shield, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  status: { type: String, required: true }
})

const label = computed(() => ESCROW_STATUS_LABELS[props.status] || props.status)

const colorClasses = computed(() => {
  const color = ESCROW_STATUS_COLORS[props.status] || 'default'
  const map = {
    success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
    info: 'bg-[var(--color-info-light)] text-[var(--color-info)]',
    default: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
  }
  return map[color] || map.default
})

const icon = computed(() => {
  const map = {
    CREATED: Clock,
    AWAITING_OWNER_CONFIRM: Clock,
    CONFIRMED: CheckCircle,
    FUNDS_HELD: Shield,
    CHECKIN_PENDING: ArrowRight,
    DISPUTE_OPEN: AlertCircle,
    REFUNDED: XCircle,
    RELEASED: CheckCircle,
    CANCELLED: XCircle
  }
  return map[props.status] || null
})
</script>
