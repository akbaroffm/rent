<template>
  <div class="page bg-white">
    <AppHeader title="Foydalanuvchilar" />

    <div class="px-4 py-4">
      <!-- Search -->
      <div class="relative mb-4">
        <Search
          :size="18"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Ism yoki telefon..."
          class="input-field pl-10"
        />
      </div>

      <!-- Users list -->
      <div class="space-y-2">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl"
        >
          <div
            class="w-11 h-11 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center shrink-0"
          >
            <component
              :is="roleIcon(user.role)"
              :size="18"
              class="text-[var(--color-text-secondary)]"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-semibold text-sm">{{ user.name }}</p>
              <span
                v-if="user.verified"
                class="badge badge-success text-[10px] py-0.5"
              >
                <BadgeCheck :size="10" /> Tasdiqlangan
              </span>
            </div>
            <p class="text-xs text-[var(--color-text-secondary)]">
              {{ user.phone }}
            </p>
            <span class="badge text-[10px] mt-1">{{
              roleLabel(user.role)
            }}</span>
          </div>
          <div class="flex gap-1">
            <button
              v-if="!user.verified"
              @click="verify(user)"
              class="btn-outline text-xs py-1.5 px-2.5 w-auto text-[var(--color-success)]"
            >
              Tasdiqlash
            </button>
            <button
              @click="block(user)"
              class="btn-outline text-xs py-1.5 px-2.5 w-auto text-[var(--color-danger)]"
            >
              Bloklash
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { mockUsers } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import { Search, BadgeCheck, User, Home, Shield } from "lucide-vue-next";

const searchQuery = ref("");
const users = ref([...mockUsers]);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(
    (u) => u.name.toLowerCase().includes(q) || u.phone.includes(q),
  );
});

function roleIcon(role) {
  return { tenant: User, owner: Home, admin: Shield }[role] || User;
}

function roleLabel(role) {
  return (
    { tenant: "Ijarachi", owner: "Uy egasi", admin: "Admin" }[role] || role
  );
}

function verify(user) {
  user.verified = true;
}

function block(user) {
  users.value = users.value.filter((u) => u.id !== user.id);
}
</script>
