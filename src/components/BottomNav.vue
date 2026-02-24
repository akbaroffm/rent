<template>
  <nav
    class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-[var(--color-border)] z-[90]"
  >
    <div
      class="flex items-center justify-around py-2 pb-[max(8px,env(safe-area-inset-bottom))]"
    >
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-0.5 px-2 py-1 no-underline min-w-[56px]"
        :class="
          isActive(item.to)
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-text-tertiary)]'
        "
      >
        <component
          :is="item.icon"
          :size="22"
          :stroke-width="isActive(item.to) ? 2.5 : 1.5"
        />
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  Home,
  User,
  Building2,
  ClipboardList,
  Plus,
  Shield,
  AlertTriangle,
  Users,
} from "lucide-vue-next";

const route = useRoute();
const auth = useAuthStore();

function isActive(to) {
  // Exact match for root dashboard routes
  const roots = ["/tenant", "/admin"];
  if (roots.includes(to)) return route.path === to;
  return route.path === to || route.path.startsWith(to + "/");
}

const navItems = computed(() => {
  switch (auth.effectiveRole) {
    case "user": {
      const ownerPersona = auth.user?.personaRole === "owner";
      return [
        { to: "/tenant", icon: Home, label: "Bosh sahifa" },
        ownerPersona
          ? { to: "/owner/bookings", icon: ClipboardList, label: "So'rovlar" }
          : { to: "/tenant/deals", icon: ClipboardList, label: "Bitimlar" },
        { to: "/owner/listings", icon: Building2, label: "E'lonlarim" },
        { to: "/owner/create", icon: Plus, label: "Qo'shish" },
        { to: "/tenant/profile", icon: User, label: "Profil" },
      ];
    }
    case "admin":
      return [
        { to: "/admin", icon: Shield, label: "Panel" },
        { to: "/admin/disputes", icon: AlertTriangle, label: "Nizolar" },
        { to: "/admin/users", icon: Users, label: "Foydalanuvchilar" },
        { to: "/admin/profile", icon: User, label: "Profil" },
      ];
    default:
      return [];
  }
});
</script>
