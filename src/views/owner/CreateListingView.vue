<template>
  <div class="page bg-white">
    <AppHeader :title="isEdit ? 'E\'lonni tahrirlash' : 'Yangi e\'lon'" />

    <div class="px-4 py-4">
      <!-- Step indicator -->
      <div class="flex items-center gap-1 mb-6">
        <div
          v-for="s in 3"
          :key="s"
          class="flex-1 h-1 rounded-full transition-colors"
          :class="
            s <= step ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
          "
        ></div>
      </div>

      <!-- Step 1: Basic info -->
      <div v-if="step === 1" class="space-y-4">
        <h2 class="text-lg font-bold">Asosiy ma'lumotlar</h2>

        <div>
          <label class="text-sm font-medium mb-1.5 block"
            >E'lon sarlavhasi</label
          >
          <input
            v-model="form.title"
            class="input-field"
            placeholder="Masalan: Zamonaviy 2-xonali kvartira"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium mb-1.5 block">Xonalar soni</label>
            <select v-model="form.rooms" class="input-field">
              <option v-for="r in [1, 2, 3, 4, 5]" :key="r" :value="r">
                {{ r }} xona
              </option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium mb-1.5 block">Maydon (m²)</label>
            <input
              v-model.number="form.area"
              type="number"
              class="input-field"
              placeholder="65"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium mb-1.5 block">Qavat</label>
            <input
              v-model.number="form.floor"
              type="number"
              class="input-field"
              placeholder="7"
            />
          </div>
          <div>
            <label class="text-sm font-medium mb-1.5 block"
              >Jami qavatlar</label
            >
            <input
              v-model.number="form.totalFloors"
              type="number"
              class="input-field"
              placeholder="9"
            />
          </div>
        </div>

        <div>
          <label class="text-sm font-medium mb-1.5 block">Tuman</label>
          <select v-model="form.district" class="input-field">
            <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>

        <div class="relative">
          <label class="text-sm font-medium mb-1.5 block">Aniq manzil</label>
          <input
            v-model="form.address"
            class="input-field pr-10"
            placeholder="Ko'cha, uy raqami"
          />
          <div v-if="isGeocoding" class="absolute right-3 top-9">
            <Loader2
              :size="16"
              class="animate-spin text-[var(--color-primary)]"
            />
          </div>
        </div>

        <!-- Map Location Picker -->
        <div>
          <label class="text-sm font-medium mb-2 block"
            >Xaritada belgilash</label
          >
          <p class="text-xs text-[var(--color-text-tertiary)] mb-3">
            Uyning aniq joylashuvini xaritada belgilang
          </p>
          <div class="h-[200px] mb-2">
            <MapComponent v-model="form.geo" mode="select" :zoom="14" />
          </div>
          <p class="text-[10px] text-center text-[var(--color-text-tertiary)]">
            Koordinatalar: {{ form.geo.lat.toFixed(6) }},
            {{ form.geo.lng.toFixed(6) }}
          </p>
        </div>

        <!-- Photos upload -->
        <div>
          <label class="text-sm font-medium mb-1.5 block"
            >Rasmlar ({{ form.photos.length }}/10)</label
          >
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(photo, i) in form.photos"
              :key="i"
              class="w-20 h-20 rounded-lg overflow-hidden relative"
            >
              <img :src="photo" class="w-full h-full object-cover" />
              <button
                @click="removePhoto(i)"
                class="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X :size="12" class="text-white" />
              </button>
            </div>
            <label
              v-if="form.photos.length < 10"
              class="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              <Camera :size="20" class="text-[var(--color-text-tertiary)]" />
              <span class="text-[10px] text-[var(--color-text-tertiary)] mt-0.5"
                >Qo'shish</span
              >
              <input
                type="file"
                accept="image/*"
                multiple
                @change="handlePhotos"
                class="hidden"
              />
            </label>
          </div>
        </div>

        <button
          @click="step = 2"
          class="btn-primary mt-2"
          :disabled="!form.title || !form.address"
        >
          Davom etish
        </button>
      </div>

      <!-- Step 2: Price & Features -->
      <div v-if="step === 2" class="space-y-4">
        <h2 class="text-lg font-bold">Narx va xususiyatlar</h2>

        <div>
          <label class="text-sm font-medium mb-1.5 block"
            >Oylik ijara narxi (so'm)</label
          >
          <input
            v-model.number="form.price"
            type="number"
            class="input-field"
            placeholder="3500000"
            @input="autoDeposit"
          />
        </div>

        <div>
          <label class="text-sm font-medium mb-1.5 block"
            >Garov / Depozit (so'm)</label
          >
          <input
            v-model.number="form.deposit"
            type="number"
            class="input-field"
            placeholder="Avtomatik — oylik narxga teng"
          />
          <p class="text-xs text-[var(--color-text-tertiary)] mt-1">
            Odatda oylik ijara narxiga teng
          </p>
        </div>

        <!-- Utilities radio -->
        <div>
          <label class="text-sm font-medium mb-2 block"
            >Kommunal xizmatlar</label
          >
          <div class="space-y-2">
            <label
              v-for="opt in utilitiesOptions"
              :key="opt.value"
              class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors"
              :class="
                form.utilitiesType === opt.value
                  ? 'border-[var(--color-secondary)] bg-[var(--color-bg-secondary)]'
                  : 'border-[var(--color-border)]'
              "
            >
              <input
                type="radio"
                v-model="form.utilitiesType"
                :value="opt.value"
                class="accent-[var(--color-primary)]"
              />
              <span class="text-sm">{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <!-- Features -->
        <div>
          <label class="text-sm font-medium mb-2 block">Xususiyatlar</label>
          <div class="grid grid-cols-2 gap-2">
            <label
              v-for="f in featuresList"
              :key="f.key"
              class="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition-colors text-sm"
              :class="
                form.features[f.key]
                  ? 'border-[var(--color-secondary)] bg-[var(--color-bg-secondary)]'
                  : 'border-[var(--color-border)]'
              "
            >
              <input
                type="checkbox"
                v-model="form.features[f.key]"
                class="accent-[var(--color-primary)]"
              />
              {{ f.label }}
            </label>
          </div>
        </div>

        <div class="flex gap-3 mt-2">
          <button @click="step = 1" class="btn-secondary flex-1">Orqaga</button>
          <button
            @click="step = 3"
            class="btn-primary flex-1"
            :disabled="!form.price"
          >
            Davom etish
          </button>
        </div>
      </div>

      <!-- Step 3: Description, Calendar & Submit -->
      <div v-if="step === 3" class="space-y-4">
        <h2 class="text-lg font-bold">Tavsif va sanalar</h2>

        <div>
          <label class="text-sm font-medium mb-1.5 block">Tavsif</label>
          <textarea
            v-model="form.description"
            class="input-field min-h-[100px] resize-none"
            placeholder="Uy haqida batafsil..."
          ></textarea>
        </div>

        <div>
          <label class="text-sm font-medium mb-1.5 block">Uy qoidalari</label>
          <textarea
            v-model="form.rules"
            class="input-field min-h-[80px] resize-none"
            placeholder="Masalan: Chekish mumkin emas"
          ></textarea>
        </div>

        <!-- Calendar UI -->
        <div>
          <label class="text-sm font-medium mb-2 block">Mavjud sanalar</label>
          <p class="text-xs text-[var(--color-text-tertiary)] mb-3">
            Kalendarda boshlang'ich sanani bosing, keyin tugash sanasini bosing
            (ixtiyoriy)
          </p>

          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label
                class="text-xs text-[var(--color-text-secondary)] mb-1 block"
                >Qachondan bo'sh *</label
              >
              <input
                v-model="form.availableFrom"
                type="date"
                class="input-field text-sm"
              />
            </div>
            <div>
              <label
                class="text-xs text-[var(--color-text-secondary)] mb-1 block"
                >Qachongacha (ixtiyoriy)</label
              >
              <input
                v-model="form.availableTo"
                type="date"
                class="input-field text-sm"
              />
            </div>
          </div>

          <!-- Calendar visual — click to set dates -->
          <div class="border border-[var(--color-border)] rounded-xl p-3">
            <div class="flex items-center justify-between mb-3">
              <button @click="prevMonth" type="button" class="p-1">
                <ChevronLeft :size="18" />
              </button>
              <span class="font-semibold text-sm">{{ calendarTitle }}</span>
              <button @click="nextMonth" type="button" class="p-1">
                <ChevronRight :size="18" />
              </button>
            </div>
            <div class="grid grid-cols-7 gap-1 text-center text-xs">
              <span
                v-for="d in ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']"
                :key="d"
                class="text-[var(--color-text-tertiary)] py-1"
                >{{ d }}</span
              >
              <div
                v-for="(day, i) in calendarDays"
                :key="i"
                class="py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                :class="getDayClass(day)"
                @click="onDayClick(day)"
              >
                {{ day?.getDate() || "" }}
              </div>
            </div>
            <div class="flex items-center gap-4 mt-3 text-xs">
              <div class="flex items-center gap-1.5">
                <div
                  class="w-3 h-3 rounded-sm bg-[var(--color-success)] border border-[var(--color-success)]"
                ></div>
                <span>Boshlanish / Tugash</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div
                  class="w-3 h-3 rounded-sm bg-[var(--color-success-light)] border border-[var(--color-success)]"
                ></div>
                <span>Mavjud kunlar</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="bg-[var(--color-bg-secondary)] rounded-xl p-4">
          <h4
            class="text-sm font-semibold mb-2 text-[var(--color-text-secondary)]"
          >
            Ijarachi ko'radi:
          </h4>
          <PriceBreakdown :rentAmount="form.price || 0" />
        </div>

        <div class="flex gap-3 mt-2">
          <button @click="step = 2" class="btn-secondary flex-1">Orqaga</button>
          <button
            @click="submitListing"
            class="btn-primary flex-1"
            :disabled="submitted"
          >
            {{
              submitted
                ? isEdit
                  ? "Saqlandi ✓"
                  : "E'lon yaratildi ✓"
                : isEdit
                  ? "Saqlash"
                  : "E'lon yaratish"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useListingsStore } from "@/stores/listings";
import { useAuthStore } from "@/stores/auth";
import {
  DISTRICTS,
  FEATURES,
  UTILITIES_OPTIONS,
  DEFAULT_FEATURES,
} from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import PriceBreakdown from "@/components/PriceBreakdown.vue";
import MapComponent from "@/components/MapComponent.vue";
import { X, Camera, ChevronLeft, ChevronRight, Loader2 } from "lucide-vue-next";
import { watch } from "vue";

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const route = useRoute();
const router = useRouter();
const listingsStore = useListingsStore();
const auth = useAuthStore();

const step = ref(1);
const submitted = ref(false);
const districts = DISTRICTS;
const featuresList = FEATURES;
const utilitiesOptions = UTILITIES_OPTIONS;

const isEdit = computed(() => !!route.params.id);
const editId = computed(() => route.params.id);

const form = reactive({
  title: "",
  rooms: 2,
  area: null,
  floor: null,
  totalFloors: null,
  district: DISTRICTS[0],
  address: "",
  photos: [],
  price: null,
  deposit: null,
  utilitiesType: "separate",
  features: DEFAULT_FEATURES(),
  description: "",
  rules: "",
  availableFrom: "",
  availableTo: "",
  geo: { lat: 41.311081, lng: 69.240562 },
});

const isGeocoding = ref(false);
let skipGeoWatch = false;

// Address -> Coordinates (Geocoding)
const updateMapFromAddress = debounce(async (address) => {
  if (!address || address.length < 5 || skipGeoWatch) return;
  isGeocoding.value = true;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ", Tashkent")}&format=json&limit=1`,
    );
    const data = await res.json();
    if (data && data.length > 0) {
      skipGeoWatch = true;
      form.geo = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      setTimeout(() => {
        skipGeoWatch = false;
      }, 500);
    }
  } catch (e) {
    console.error("Geocoding error:", e);
  } finally {
    isGeocoding.value = false;
  }
}, 1000);

watch(
  () => form.address,
  (newVal) => {
    updateMapFromAddress(newVal);
  },
);

// Coordinates -> Address (Reverse Geocoding)
watch(
  () => form.geo,
  async (newGeo) => {
    if (skipGeoWatch) return;
    isGeocoding.value = true;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${newGeo.lat}&lon=${newGeo.lng}&format=json`,
      );
      const data = await res.json();
      if (data && data.display_name) {
        skipGeoWatch = true;
        // Extract a cleaner address (Nominatim can be very verbose)
        const parts = data.display_name.split(", ");
        // Take first few parts (street, house, district) and skip the country/postcode etc
        form.address = parts.slice(0, 4).join(", ");
        setTimeout(() => {
          skipGeoWatch = false;
        }, 500);
      }
    } catch (e) {
      console.error("Reverse geocoding error:", e);
    } finally {
      isGeocoding.value = false;
    }
  },
  { deep: true },
);

function autoDeposit() {
  if (form.price && !form._depositManual) {
    form.deposit = form.price;
  }
}

// Photo upload
function handlePhotos(e) {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    if (form.photos.length >= 10) return;
    const url = URL.createObjectURL(file);
    form.photos.push(url);
  });
  e.target.value = "";
}

function removePhoto(index) {
  form.photos.splice(index, 1);
}

// Calendar
const calendarMonth = ref(new Date().getMonth());
const calendarYear = ref(new Date().getFullYear());

const calendarTitle = computed(() => {
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  return `${months[calendarMonth.value]} ${calendarYear.value}`;
});

const calendarDays = computed(() => {
  const first = new Date(calendarYear.value, calendarMonth.value, 1);
  const lastDay = new Date(
    calendarYear.value,
    calendarMonth.value + 1,
    0,
  ).getDate();
  let startDay = first.getDay();
  if (startDay === 0) startDay = 7;
  startDay--;
  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= lastDay; d++) {
    days.push(new Date(calendarYear.value, calendarMonth.value, d));
  }
  return days;
});

function getDayClass(day) {
  if (!day) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (day < today)
    return "text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)]";
  const from = form.availableFrom ? new Date(form.availableFrom) : null;
  const to = form.availableTo ? new Date(form.availableTo) : null;
  // Start/end date markers
  if (from && day.toDateString() === from.toDateString())
    return "bg-[var(--color-success)] text-white font-bold";
  if (to && day.toDateString() === to.toDateString())
    return "bg-[var(--color-success)] text-white font-bold";
  // Range between from and to
  if (from && to && day > from && day < to)
    return "bg-[var(--color-success-light)] text-[var(--color-success)] font-medium";
  // If only from is set (open-ended), highlight all future days from that date
  if (from && !to && day > from)
    return "bg-[var(--color-success-light)] text-[var(--color-success)]";
  return "hover:bg-[var(--color-bg-secondary)]";
}

function onDayClick(day) {
  if (!day) return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (day < today) return;
  const dateStr = day.toISOString().split("T")[0];
  if (!form.availableFrom || (form.availableFrom && form.availableTo)) {
    // First click or reset: set start date
    form.availableFrom = dateStr;
    form.availableTo = "";
  } else {
    // Second click: set end date (must be after start)
    if (new Date(dateStr) > new Date(form.availableFrom)) {
      form.availableTo = dateStr;
    } else {
      form.availableFrom = dateStr;
      form.availableTo = "";
    }
  }
}

function prevMonth() {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11;
    calendarYear.value--;
  } else calendarMonth.value--;
}

function nextMonth() {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0;
    calendarYear.value++;
  } else calendarMonth.value++;
}

// Edit mode — load existing listing
onMounted(() => {
  if (editId.value) {
    const listing = listingsStore.getListingById(editId.value);
    if (listing) {
      Object.assign(form, {
        title: listing.title,
        rooms: listing.rooms,
        area: listing.area,
        floor: listing.floor,
        totalFloors: listing.totalFloors,
        district: listing.district,
        address: listing.address,
        photos: [...listing.photos],
        price: listing.price,
        deposit: listing.deposit,
        utilitiesType: listing.utilitiesType || "separate",
        features: { ...DEFAULT_FEATURES(), ...listing.features },
        description: listing.description || "",
        rules: listing.rules || "",
        availableFrom: listing.availableFrom || "",
        availableTo: listing.availableTo || "",
        geo: listing.geo
          ? { ...listing.geo }
          : { lat: 41.311081, lng: 69.240562 },
      });
    }
  }
});

function submitListing() {
  const data = {
    ...form,
    ownerId: auth.user?.id || "u2",
    createdBy: auth.user?.id || "u2",
    currency: "so'm",
    geo: form.geo,
  };

  if (data.photos.length === 0) {
    data.photos = [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    ];
  }

  if (isEdit.value) {
    listingsStore.updateListing(editId.value, data);
  } else {
    listingsStore.addListing(data);
  }
  submitted.value = true;

  const backRoute = "/owner/listings";
  setTimeout(() => router.push(backRoute), 1000);
}
</script>
