<template>
  <div class="page bg-white">
    <AppHeader title="Qidirish" />

    <div class="px-4 py-4">
      <!-- Search -->
      <div class="relative mb-4">
        <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
        <input v-model="searchQuery" type="text" placeholder="Manzil, tuman, kalit so'z..." class="input-field pl-10 rounded-full"
          @input="applySearch" />
      </div>

      <!-- Filter chips (scrollable) -->
      <div class="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
        <button @click="showFilters = !showFilters"
          class="shrink-0 flex items-center gap-1.5 px-3.5 py-2 border rounded-full text-sm font-medium transition-colors"
          :class="activeFiltersCount > 0 ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)]'">
          <SlidersHorizontal :size="14" />
          Filtr{{ activeFiltersCount > 0 ? ` (${activeFiltersCount})` : '' }}
        </button>
        <button v-for="d in DISTRICTS" :key="d"
          @click="toggleDistrict(d)"
          class="shrink-0 px-3.5 py-2 border rounded-full text-sm transition-colors"
          :class="listingsStore.filters.district === d ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white' : 'border-[var(--color-border)]'">
          {{ d }}
        </button>
      </div>

      <!-- Expanded filters panel -->
      <div v-if="showFilters" class="border border-[var(--color-border)] rounded-xl p-4 mb-4 space-y-4">
        <!-- Rooms -->
        <div>
          <label class="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 block">Xonalar soni</label>
          <div class="flex gap-2">
            <button v-for="r in [1,2,3,4,5]" :key="r"
              @click="listingsStore.setFilters({ rooms: listingsStore.filters.rooms === r ? null : r })"
              class="w-10 h-10 rounded-lg border text-sm font-medium transition-colors"
              :class="listingsStore.filters.rooms === r ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white' : 'border-[var(--color-border)]'">
              {{ r }}
            </button>
          </div>
        </div>

        <!-- Price range -->
        <div>
          <label class="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 block">Narx oralig'i</label>
          <div class="grid grid-cols-2 gap-2">
            <input v-model.number="minPrice" type="number" placeholder="dan" class="input-field text-sm py-2.5" @change="applyPrice" />
            <input v-model.number="maxPrice" type="number" placeholder="gacha" class="input-field text-sm py-2.5" @change="applyPrice" />
          </div>
          <!-- Quick price buttons -->
          <div class="flex gap-1.5 mt-2 flex-wrap">
            <button v-for="p in pricePresets" :key="p.label" @click="setPresetPrice(p)"
              class="px-2.5 py-1.5 border border-[var(--color-border)] rounded-full text-xs hover:bg-[var(--color-bg-secondary)] transition-colors">
              {{ p.label }}
            </button>
          </div>
        </div>

        <!-- Utilities -->
        <div>
          <label class="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 block">Kommunal xizmatlar</label>
          <div class="flex gap-2">
            <button @click="listingsStore.setFilters({ utilitiesType: listingsStore.filters.utilitiesType === 'included' ? null : 'included' })"
              class="px-3 py-2 border rounded-full text-xs transition-colors"
              :class="listingsStore.filters.utilitiesType === 'included' ? 'border-[var(--color-success)] bg-[var(--color-success-light)] text-[var(--color-success)]' : 'border-[var(--color-border)]'">
              Kiritilgan
            </button>
            <button @click="listingsStore.setFilters({ utilitiesType: listingsStore.filters.utilitiesType === 'separate' ? null : 'separate' })"
              class="px-3 py-2 border rounded-full text-xs transition-colors"
              :class="listingsStore.filters.utilitiesType === 'separate' ? 'border-[var(--color-warning)] bg-[var(--color-warning-light)] text-[var(--color-warning)]' : 'border-[var(--color-border)]'">
              Alohida
            </button>
          </div>
        </div>

        <!-- Feature filters -->
        <div>
          <label class="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 block">Xususiyatlar</label>
          <div class="flex gap-2 flex-wrap">
            <button v-for="f in filterFeatures" :key="f.key"
              @click="toggleFeature(f.key)"
              class="px-3 py-2 border rounded-full text-xs transition-colors"
              :class="listingsStore.filters[f.key] ? 'border-[var(--color-secondary)] bg-[var(--color-bg-secondary)] font-medium' : 'border-[var(--color-border)]'">
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- Clear -->
        <button @click="clearAll" class="text-sm text-[var(--color-primary)] font-medium">Filtrlarni tozalash</button>
      </div>

      <!-- Special Category Badge -->
      <div v-if="listingsStore.filters.specialCategory" class="flex items-center justify-between bg-[var(--color-primary-light)] border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl p-3 mb-4">
        <div class="flex items-center gap-2">
          <Sparkles :size="18" />
          <span class="text-sm font-bold">{{ specialCategoryName }}</span>
        </div>
        <button @click="clearSpecialCategory" class="p-1 hover:bg-white/50 rounded-full transition-colors">
          <X :size="16" />
        </button>
      </div>

      <!-- Results count -->
      <p class="text-xs text-[var(--color-text-tertiary)] mb-3">{{ listingsStore.filteredListings.length }} ta natija</p>

      <!-- Results -->
      <div v-if="listingsStore.filteredListings.length === 0">
        <EmptyState title="E'lonlar topilmadi" description="Boshqa filtrlar bilan qidirib ko'ring" />
      </div>
      <div v-else class="grid grid-cols-1 gap-6">
        <ListingCard v-for="l in listingsStore.filteredListings" :key="l.id" :listing="l" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useListingsStore } from '@/stores/listings'
import { DISTRICTS } from '@/data/mock'
import AppHeader from '@/components/AppHeader.vue'
import ListingCard from '@/components/ListingCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-vue-next'

const listingsStore = useListingsStore()

const searchQuery = ref('')
const showFilters = ref(false)
const minPrice = ref(null)
const maxPrice = ref(null)

const filterFeatures = [
  { key: 'furnished', label: 'Mebelli' },
  { key: 'familyOnly', label: 'Faqat oila' },
  { key: 'studentsOk', label: 'Talabalar' },
  { key: 'petsOk', label: 'Hayvon ✓' },
  { key: 'parking', label: 'Parking' },
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'ac', label: 'Konditsioner' },
  { key: 'elevator', label: 'Lift' },
  { key: 'newBuilding', label: 'Yangi bino' },
  { key: 'balcony', label: 'Balkon' }
]

const pricePresets = [
  { label: "2M gacha", min: null, max: 2000000 },
  { label: "2-4M", min: 2000000, max: 4000000 },
  { label: "4-6M", min: 4000000, max: 6000000 },
  { label: "6M+", min: 6000000, max: null }
]

const activeFiltersCount = computed(() => {
  let count = 0
  const f = listingsStore.filters
  if (f.rooms) count++
  if (f.minPrice || f.maxPrice) count++
  if (f.utilitiesType) count++
  filterFeatures.forEach(feat => { if (f[feat.key]) count++ })
  return count
})

function applySearch() {
  listingsStore.setFilters({ search: searchQuery.value })
}

function toggleDistrict(d) {
  listingsStore.setFilters({ district: listingsStore.filters.district === d ? null : d })
}

function toggleFeature(key) {
  listingsStore.setFilters({ [key]: listingsStore.filters[key] ? null : true })
}

function applyPrice() {
  listingsStore.setFilters({ minPrice: minPrice.value, maxPrice: maxPrice.value })
}

function setPresetPrice(p) {
  minPrice.value = p.min
  maxPrice.value = p.max
  applyPrice()
}

function clearAll() {
  searchQuery.value = ''
  minPrice.value = null
  maxPrice.value = null
  showFilters.value = false
  listingsStore.clearFilters()
}

const specialCategoryName = computed(() => {
  const map = {
    'new': "Yangi e'lonlar",
    'cheapest': 'Hamyonbop variantlar',
    'popular': 'Ommabop',
    'premium': 'Premium uylar'
  }
  return map[listingsStore.filters.specialCategory] || ''
})

function clearSpecialCategory() {
  listingsStore.setFilters({ specialCategory: null, sortBy: 'newest' })
}
</script>
