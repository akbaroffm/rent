<template>
  <div class="page bg-white">
    <AppHeader title="Nizo markazi" />

    <div class="px-4 py-4">
      <div v-if="allDisputes.length === 0">
        <EmptyState title="Nizolar yo'q" description="Hozircha hech qanday nizo yo'q" />
      </div>

      <div v-else class="space-y-4">
        <div v-for="dispute in allDisputes" :key="dispute.id" class="border border-[var(--color-border)] rounded-xl overflow-hidden">
          <!-- Header -->
          <div class="p-4 border-b border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm">Nizo #{{ dispute.id }}</h3>
              <span v-if="dispute.adminDecision" class="badge badge-success text-[10px]">Hal qilindi</span>
              <span v-else class="badge badge-danger text-[10px]">Ochiq</span>
            </div>
            <p class="text-xs text-[var(--color-text-secondary)]">{{ timeAgo(dispute.createdAt) }}</p>
          </div>

          <!-- Deal info -->
          <div class="p-4 bg-[var(--color-bg-secondary)]">
            <div v-if="getDeal(dispute.dealId)" class="text-sm">
              <div class="flex justify-between mb-1">
                <span class="text-[var(--color-text-secondary)]">E'lon</span>
                <span class="font-medium">{{ getListingTitle(getDeal(dispute.dealId).listingId) }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-[var(--color-text-secondary)]">Ijarachi</span>
                <span class="font-medium">{{ getUserName(getDeal(dispute.dealId).tenantId) }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-[var(--color-text-secondary)]">Uy egasi</span>
                <span class="font-medium">{{ getUserName(getDeal(dispute.dealId).ownerId) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--color-text-secondary)]">Summa</span>
                <span class="font-bold">{{ formatPrice(getDeal(dispute.dealId).total) }}</span>
              </div>
            </div>
          </div>

          <!-- Reason -->
          <div class="p-4">
            <h4 class="text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Sabab:</h4>
            <p class="text-sm">{{ dispute.reason }}</p>
          </div>

          <!-- Evidence -->
          <div v-if="dispute.evidence?.length" class="px-4 pb-4">
            <h4 class="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Dalillar:</h4>
            <div class="flex gap-2 overflow-x-auto">
              <img v-for="(img, i) in dispute.evidence" :key="i" :src="img" class="w-20 h-20 rounded-lg object-cover shrink-0" />
            </div>
          </div>

          <!-- Admin actions -->
          <div v-if="!dispute.adminDecision" class="p-4 border-t border-[var(--color-border)]">
            <h4 class="text-xs font-semibold text-[var(--color-text-secondary)] mb-3">Admin qarori:</h4>
            <div class="flex gap-2">
              <button @click="resolve(dispute.id, 'refund_full')" class="btn-outline text-xs flex-1 py-2.5 text-[var(--color-danger)] border-[var(--color-danger)]">
                To'liq qaytarish
              </button>
              <button @click="resolve(dispute.id, 'refund_partial')" class="btn-outline text-xs flex-1 py-2.5 text-[var(--color-warning)] border-[var(--color-warning)]">
                Qisman qaytarish
              </button>
              <button @click="resolve(dispute.id, 'release')" class="btn-outline text-xs flex-1 py-2.5 text-[var(--color-success)] border-[var(--color-success)]">
                Chiqarish
              </button>
            </div>
          </div>

          <!-- Decision shown -->
          <div v-else class="p-4 border-t border-[var(--color-border)]">
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-[var(--color-success)]" />
              <span class="text-sm font-medium">
                Qaror: {{ decisionLabel(dispute.adminDecision) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDealsStore } from '@/stores/deals'
import { useListingsStore } from '@/stores/listings'
import { formatPrice, getUserById, timeAgo } from '@/data/mock'
import AppHeader from '@/components/AppHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import { CheckCircle } from 'lucide-vue-next'

const dealsStore = useDealsStore()
const listingsStore = useListingsStore()

const allDisputes = computed(() => dealsStore.disputes)

function getDeal(id) { return dealsStore.getDealById(id) }
function getListingTitle(id) { return listingsStore.getListingById(id)?.title || 'E\'lon' }
function getUserName(id) { return getUserById(id)?.name || '' }

function resolve(disputeId, decision) {
  dealsStore.resolveDispute(disputeId, decision)
}

function decisionLabel(decision) {
  const map = {
    refund_full: "To'liq qaytarildi",
    refund_partial: "Qisman qaytarildi",
    release: "Mablag' chiqarildi"
  }
  return map[decision] || decision
}
</script>
