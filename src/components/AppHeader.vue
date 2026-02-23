<template>
  <header class="sticky top-0 z-40 bg-white border-b border-[var(--color-border)]">
    <div class="flex items-center justify-between px-4 h-14">
      <div class="flex items-center gap-3">
        <button v-if="showBack" @click="goBack" class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--color-bg-secondary)] transition-colors">
          <ArrowLeft :size="20" />
        </button>
        <h1 class="text-base font-semibold truncate">{{ title }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true }
})

const router = useRouter()
function goBack() { router.back() }
</script>
