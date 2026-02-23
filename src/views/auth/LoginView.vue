<template>
  <div class="min-h-dvh flex flex-col justify-between bg-white px-6 py-12">
    <!-- Logo & Branding -->
    <div class="flex-1 flex flex-col items-center justify-center">
      <div
        class="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mb-4"
      >
        <Shield :size="32" class="text-white" />
      </div>
      <h1 class="text-2xl font-bold text-center mb-1">IjaraSafe</h1>
      <p class="text-sm text-[var(--color-text-secondary)] text-center mb-10">
        Xavfsiz ijara platformasi
      </p>

      <!-- Phone input -->
      <div v-if="auth.step === 'phone'" class="w-full max-w-[340px]">
        <label class="text-sm font-medium mb-2 block">Telefon raqamingiz</label>
        <div class="flex gap-2 mb-4">
          <div
            class="flex items-center px-3 bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)]"
          >
            +998
          </div>
          <input
            v-model="phoneInput"
            type="tel"
            placeholder="90 123 45 67"
            maxlength="12"
            class="input-field flex-1"
            @keyup.enter="handleSendSms"
          />
        </div>
        <button
          @click="handleSendSms"
          :disabled="phoneInput.length < 9"
          class="btn-primary rounded-lg"
        >
          Davom etish
        </button>
      </div>

      <!-- SMS Code input -->
      <div v-if="auth.step === 'code'" class="w-full max-w-[340px]">
        <label class="text-sm font-medium mb-1 block">Tasdiqlash kodi</label>
        <p class="text-sm text-[var(--color-text-secondary)] mb-4">
          +998 {{ phoneInput }} raqamiga SMS yuborildi
        </p>
        <div class="flex gap-3 justify-center mb-6">
          <input
            v-for="(_, i) in 4"
            :key="i"
            :ref="(el) => (codeInputs[i] = el)"
            v-model="codeDigits[i]"
            type="tel"
            maxlength="1"
            class="w-14 h-14 text-center text-xl font-semibold rounded-xl border border-[var(--color-border-dark)] bg-white focus:border-[var(--color-secondary)] outline-none transition-colors"
            @input="onCodeInput(i)"
            @keydown.backspace="onCodeBackspace(i)"
          />
        </div>
        <button
          @click="handleVerify"
          :disabled="codeDigits.join('').length < 4"
          class="btn-primary mb-3"
        >
          Tasdiqlash
        </button>
        <button @click="auth.step = 'phone'" class="btn-secondary">
          Orqaga
        </button>
      </div>

      <!-- Quick demo access -->
      <div v-if="auth.step === 'phone'" class="w-full max-w-[340px] mt-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-1 h-px bg-[var(--color-border)]"></div>
          <span class="text-xs text-[var(--color-text-tertiary)]"
            >yoki demo rejim</span
          >
          <div class="flex-1 h-px bg-[var(--color-border)]"></div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="quickLogin('tenant')"
            class="btn-outline text-xs py-3"
          >
            <Home :size="14" /> Ijarachi
          </button>
          <button @click="quickLogin('owner')" class="btn-outline text-xs py-3">
            <Building2 :size="14" /> Uy egasi
          </button>
          <button @click="quickLogin('admin')" class="btn-outline text-xs py-3">
            <ShieldCheck :size="14" /> Admin
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <p class="text-center text-xs text-[var(--color-text-tertiary)] mt-8">
      Davom etish orqali siz
      <span class="underline">foydalanish shartlari</span>ga rozilik bildirasiz
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Shield, Home, Building2, ShieldCheck } from "lucide-vue-next";

const router = useRouter();
const auth = useAuthStore();

const phoneInput = ref("");
const codeDigits = ref(["", "", "", ""]);
const codeInputs = ref([]);

function handleSendSms() {
  if (phoneInput.value.length >= 9) {
    auth.sendSms("+998" + phoneInput.value);
  }
}

function onCodeInput(index) {
  if (codeDigits.value[index] && index < 3) {
    codeInputs.value[index + 1]?.focus();
  }
}

function onCodeBackspace(index) {
  if (!codeDigits.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }
}

function handleVerify() {
  const code = codeDigits.value.join("");
  if (auth.verifyCode(code)) {
    router.push("/role-select");
  }
}

function quickLogin(role) {
  auth.loginAs(role);
  const routes = {
    tenant: "/tenant",
    owner: "/owner",
    admin: "/admin",
  };
  router.push(routes[role]);
}
</script>
