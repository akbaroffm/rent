<template>
  <div class="min-h-dvh flex flex-col bg-white px-6 py-12">
    <div class="flex-1 flex flex-col items-center justify-center">
      <h1 class="text-xl font-bold text-center mb-2">Rolni tanlang</h1>
      <p class="text-sm text-[var(--color-text-secondary)] text-center mb-8">
        Siz qanday foydalanmoqchisiz?
      </p>

      <div class="w-full max-w-[340px] space-y-3">
        <button
          v-for="r in roles"
          :key="r.value"
          @click="selectRole(r.value)"
          class="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-secondary)] transition-colors text-left"
          :class="
            selected === r.value
              ? 'border-[var(--color-secondary)] bg-[var(--color-bg-secondary)]'
              : ''
          "
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            :class="r.bgClass"
          >
            <component :is="r.icon" :size="22" :class="r.iconClass" />
          </div>
          <div>
            <h3 class="font-semibold text-[15px]">{{ r.label }}</h3>
            <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">
              {{ r.desc }}
            </p>
          </div>
        </button>
      </div>
    </div>

    <button
      @click="confirm"
      :disabled="!selected"
      class="btn-primary mt-8 max-w-[340px] mx-auto rounded-xl"
    >
      Davom etish
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { UserRound, Shield } from "lucide-vue-next";

const router = useRouter();
const auth = useAuthStore();
const selected = ref(null);

const roles = [
  {
    value: "user",
    label: "Foydalanuvchi",
    desc: "E'lon joylayman va ijaraga olaman",
    icon: UserRound,
    bgClass: "bg-[var(--color-success-light)]",
    iconClass: "text-[var(--color-success)]",
  },
  {
    value: "admin",
    label: "Admin",
    desc: "Platformani boshqaraman",
    icon: Shield,
    bgClass: "bg-[var(--color-primary-light)]",
    iconClass: "text-[var(--color-primary)]",
  },
];

function selectRole(role) {
  selected.value = role;
}

function confirm() {
  if (selected.value) {
    auth.selectRole(selected.value);
    if (selected.value === "user") {
      const target =
        auth.user?.personaRole === "owner" ? "/owner/bookings" : "/tenant";
      router.push(target);
      return;
    }
    router.push("/admin");
  }
}
</script>
