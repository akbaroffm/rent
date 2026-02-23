<template>
  <div class="flex flex-col items-center justify-center py-16 px-8 text-center">
    <div class="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mb-4">
      <component :is="iconComponent" :size="28" class="text-[var(--color-text-tertiary)]" />
    </div>
    <h3 class="text-base font-semibold mb-1">{{ title }}</h3>
    <p class="text-sm text-[var(--color-text-secondary)] max-w-[260px]">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
import { Inbox } from 'lucide-vue-next'

defineProps({
  title: { type: String, default: "Hech narsa topilmadi" },
  description: { type: String, default: "" },
  iconComponent: { type: Object, default: () => Inbox }
})
</script>
