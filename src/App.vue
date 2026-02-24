<template>
  <div class="min-h-dvh bg-white">
    <router-view v-slot="{ Component, route }">
      <Transition :name="route.meta.transition || 'page-fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>
    <BottomNav v-if="showNav" />
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import BottomNav from "@/components/BottomNav.vue";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// Only hide nav on these specific full-screen pages
const hideNavRoutes = ["login", "role-select"];
const showNav = computed(() => {
  if (route.name && hideNavRoutes.includes(route.name)) return false;
  return !!auth.effectiveRole;
});

// Redirect to login if auth is cleared but still on protected page
watch(
  [() => auth.effectiveRole, () => route.name],
  ([newRole, routeName]) => {
    const authPages = ["login", "role-select"];
    if (!newRole && routeName && !authPages.includes(routeName)) {
      router.push("/");
    }
  },
  { immediate: true },
);
</script>

<style>
/* Page transition: fade + slight slide up */
.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
