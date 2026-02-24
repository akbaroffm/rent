import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { mockUsers } from "@/data/mock";

function parseStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function normalizePhone(value = "") {
  const digits = String(value).replace(/\D/g, "");
  if (digits.startsWith("998")) return "+" + digits;
  return "+998" + digits;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref(parseStorage("rent_user", null));
  const role = ref(localStorage.getItem("rent_role") || null); // user, admin
  const effectiveRole = computed(() => role.value || user.value?.role || null);
  const isAuthenticated = computed(() => !!user.value);
  const phone = ref("");
  const smsCode = ref("");
  const step = ref("phone"); // phone, code, role

  const cards = ref(
    parseStorage("rent_cards", [
      {
        id: "c1",
        number: "•••• •••• •••• 1234",
        expiry: "12/26",
        type: "UZCARD",
        active: true,
      },
      {
        id: "c2",
        number: "•••• •••• •••• 5678",
        expiry: "05/27",
        type: "HUMO",
        active: false,
      },
    ]),
  );

  watch(
    cards,
    (newCards) => {
      localStorage.setItem("rent_cards", JSON.stringify(newCards));
    },
    { deep: true },
  );

  function sendSms(phoneNumber) {
    phone.value = normalizePhone(phoneNumber);
    step.value = "code";
  }

  function verifyCode(code) {
    smsCode.value = code;
    // Mock: accept any 4-digit code
    if (code.length === 4) {
      step.value = "role";
      return true;
    }
    return false;
  }

  function selectRole(selectedRole) {
    role.value = selectedRole;
    localStorage.setItem("rent_role", selectedRole);
    const normalizedPhone = normalizePhone(phone.value);

    let mockUser = null;
    if (selectedRole === "user") {
      mockUser =
        mockUsers.find(
          (u) =>
            normalizePhone(u.phone) === normalizedPhone &&
            ["tenant", "owner"].includes(u.role),
        ) || mockUsers.find((u) => u.role === "tenant");
    } else {
      mockUser = mockUsers.find((u) => u.role === selectedRole);
    }

    const baseUser = mockUser || {
      id: "u_new",
      name: "Foydalanuvchi",
      phone: normalizedPhone,
      role: selectedRole,
      verified: false,
    };

    user.value = {
      ...baseUser,
      phone: normalizedPhone,
      role: selectedRole,
      personaRole: mockUser?.role || selectedRole,
    };
    localStorage.setItem("rent_user", JSON.stringify(user.value));
  }

  function loginAs(selectedRole) {
    role.value = selectedRole;
    const mockUser =
      mockUsers.find((u) => u.role === selectedRole) || mockUsers[0];
    user.value = { ...mockUser, role: selectedRole };
    phone.value = mockUser.phone;
    step.value = "done";

    localStorage.setItem("rent_role", selectedRole);
    localStorage.setItem("rent_user", JSON.stringify(user.value));
  }

  function logout() {
    user.value = null;
    role.value = null;
    phone.value = "";
    smsCode.value = "";
    step.value = "phone";
    localStorage.removeItem("rent_user");
    localStorage.removeItem("rent_role");
    // We keep cards even on logout for demo purposes, or we could clear them
  }

  function addCard(card) {
    const newCard = {
      id: "c" + Date.now(),
      number: "•••• •••• •••• " + card.number.slice(-4),
      expiry: card.expiry,
      type: card.number.startsWith("8600") ? "UZCARD" : "HUMO",
      active: cards.value.length === 0,
    };
    cards.value.push(newCard);
    return newCard;
  }

  function removeCard(id) {
    cards.value = cards.value.filter((c) => c.id !== id);
  }

  function setMainCard(id) {
    cards.value.forEach((c) => (c.active = c.id === id));
  }

  return {
    user,
    role,
    effectiveRole,
    isAuthenticated,
    phone,
    smsCode,
    step,
    cards,
    sendSms,
    verifyCode,
    selectRole,
    loginAs,
    logout,
    addCard,
    removeCard,
    setMainCard,
  };
});
