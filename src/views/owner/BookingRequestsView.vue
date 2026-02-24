<template>
  <div class="page bg-white">
    <AppHeader title="Bron so'rovlari" />

    <div class="px-4 py-4">
      <div v-if="bookings.length === 0">
        <EmptyState
          title="So'rovlar yo'q"
          description="Ijarachalar bron qilganida bu yerda ko'rinadi"
        />
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="deal in bookings"
          :key="deal.id"
          class="border border-[var(--color-border)] rounded-xl p-4 active:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
          @click="selectedDeal = deal"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold text-sm truncate">
                {{ getListing(deal.listingId)?.title }}
              </p>
              <StatusBadge :status="deal.escrowStatus" />
            </div>
            <div class="flex items-center gap-2 mb-3">
              <div
                class="w-8 h-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0"
              >
                <User :size="14" class="text-[var(--color-primary)]" />
              </div>
              <div>
                <p class="text-[13px] font-medium">
                  {{ getTenant(deal.tenantId)?.name }}
                </p>
                <p class="text-[11px] text-[var(--color-text-secondary)]">
                  {{ getTenant(deal.tenantId)?.phone }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="bg-[var(--color-bg-secondary)] rounded-lg p-2">
                <p
                  class="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider"
                >
                  Ijara
                </p>
                <p class="font-bold text-sm">
                  {{ formatPrice(deal.rentAmount) }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]"
          >
            <span class="text-[10px] text-[var(--color-text-tertiary)]">{{
              timeAgo(deal.createdAt)
            }}</span>
            <span class="text-[11px] font-medium text-[var(--color-primary)]"
              >Tafsilotlar →</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Deal Detail Overlay -->
    <Teleport to="body">
      <div
        v-if="selectedDeal"
        class="fixed inset-0 z-999 flex items-end justify-center pointer-events-none"
      >
        <!-- Backdrop -->
        <Transition name="fade" appear>
          <div
            v-if="selectedDeal"
            class="absolute inset-0 bg-black/40 pointer-events-auto"
            @click="selectedDeal = null"
          ></div>
        </Transition>

        <!-- Content Panel -->
        <Transition name="slide-up" appear>
          <div
            v-if="selectedDeal"
            class="relative w-full max-w-[450px] bg-white rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto pointer-events-auto z-999"
          >
            <div
              class="w-12 h-1.5 bg-[var(--color-border-dark)] rounded-full mx-auto mb-6"
              @click="selectedDeal = null"
            ></div>

            <div class="flex items-center justify-between mb-2">
              <h2 class="text-xl font-bold">Ariza tafsilotlari</h2>
              <button
                @click="selectedDeal = null"
                class="p-2 -mr-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
              >
                <X :size="24" />
              </button>
            </div>

            <!-- Listing Summary -->
            <div
              v-if="getListing(selectedDeal.listingId)"
              class="flex gap-4 p-4 border border-[var(--color-border)] rounded-2xl mb-6"
            >
              <img
                :src="getListing(selectedDeal.listingId)?.photos[0]"
                class="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-sm mb-1 truncate">
                  {{ getListing(selectedDeal.listingId)?.title }}
                </h3>
                <p
                  class="text-xs text-[var(--color-text-secondary)] mb-2 truncate"
                >
                  {{ getListing(selectedDeal.listingId)?.address }}
                </p>
                <StatusBadge :status="selectedDeal.escrowStatus" />
              </div>
            </div>

            <!-- Applicant Details -->
            <div class="space-y-4 mb-4">
              <h3
                class="text-sm font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2"
              >
                Ijarachi ma'lumotlari
              </h3>
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center shrink-0"
                >
                  <User :size="20" class="text-[var(--color-text-secondary)]" />
                </div>
                <div class="flex-1">
                  <p class="font-bold text-base">
                    {{ getTenant(selectedDeal.tenantId)?.name }}
                  </p>
                  <div class="flex items-center gap-4 mt-1">
                    <a
                      :href="'tel:' + getTenant(selectedDeal.tenantId)?.phone"
                      class="flex items-center gap-1.5 text-xs text-[var(--color-info)] no-underline"
                    >
                      <Phone :size="12" />
                      {{ getTenant(selectedDeal.tenantId)?.phone }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financials -->
            <div
              class="bg-[var(--color-bg-secondary)] rounded-2xl p-5 space-y-3 mb-4"
            >
              <div class="flex justify-between items-center text-sm">
                <span class="text-[var(--color-text-secondary)]"
                  >Ijara narxi:</span
                >
                <span class="font-bold">{{
                  formatPrice(selectedDeal.rentAmount)
                }}</span>
              </div>
              <div
                class="flex justify-between items-center text-sm pt-3 border-t border-[var(--color-border)]"
              >
                <span class="font-bold">Jami summa:</span>
                <span class="font-black text-lg">{{
                  formatPrice(selectedDeal.total)
                }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 space-y-3">
              <div
                v-if="
                  selectedDeal.escrowStatus ===
                    ESCROW_STATUS.AWAITING_OWNER_CONFIRM &&
                  selectedDeal.ownerId === auth.user?.id
                "
                class="flex gap-3"
              >
                <button
                  @click="confirmBooking(selectedDeal.id)"
                  class="btn-primary flex-1 rounded-xl"
                >
                  <CheckCircle :size="18" /> Tasdiqlash
                </button>
                <button
                  @click="cancelBooking(selectedDeal.id)"
                  class="btn-secondary flex-1 text-[var(--color-danger)] border-[var(--color-danger)] rounded-xl"
                >
                  Rad etish
                </button>
              </div>
              <div
                v-else-if="
                  selectedDeal.escrowStatus === ESCROW_STATUS.RENTAL_ACTIVE
                "
                class="space-y-4"
              >
                <div class="h-px bg-[var(--color-border)]"></div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-[var(--color-text-secondary)]"
                    >Oxirgi to'lov:</span
                  >
                  <span
                    class="text-sm font-bold"
                    :class="
                      selectedDeal.payments?.[selectedDeal.payments.length - 1]
                        ?.status === 'PAID'
                        ? 'text-[var(--color-success)]'
                        : 'text-[var(--color-warning)]'
                    "
                  >
                    {{
                      PAYMENT_STATUS_LABELS[
                        selectedDeal.payments?.[
                          selectedDeal.payments.length - 1
                        ]?.status
                      ]
                    }}
                  </span>
                </div>
                <router-link
                  :to="`/shared/agreement/${selectedDeal.id}`"
                  class="btn-secondary w-full text-center py-3 text-sm font-bold no-underline flex items-center justify-center gap-2"
                >
                  <FileText :size="16" /> Shartnomani ko'rish
                </router-link>
              </div>
              <button
                v-else
                @click="selectedDeal = null"
                class="btn-primary w-full"
              >
                Yopish
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDealsStore } from "@/stores/deals";
import { useListingsStore } from "@/stores/listings";
import { useAuthStore } from "@/stores/auth";
import { formatPrice, getUserById, timeAgo, ESCROW_STATUS } from "@/data/mock";
import AppHeader from "@/components/AppHeader.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import { User, FileText, X, Phone, CheckCircle } from "lucide-vue-next";
import { PAYMENT_STATUS_LABELS } from "@/data/mock";

const route = useRoute();
const auth = useAuthStore();
const dealsStore = useDealsStore();
const listingsStore = useListingsStore();

const bookings = computed(() =>
  dealsStore.getDealsByOwner(auth.user?.id || "u2"),
);

const selectedDeal = ref(null);

watch(selectedDeal, (val) => {
  if (val) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

onMounted(() => {
  if (route.query.dealId) {
    const deal = bookings.value.find((d) => d.id === route.query.dealId);
    if (deal) selectedDeal.value = deal;
  }
});

function getListing(id) {
  return listingsStore.getListingById(id);
}
function getTenant(id) {
  return getUserById(id);
}

function confirmBooking(id) {
  dealsStore.updateDealStatus(
    id,
    ESCROW_STATUS.CONFIRMED,
    "Uy egasi tasdiqladi",
  );
  selectedDeal.value = null;
}
function cancelBooking(id) {
  dealsStore.updateDealStatus(id, ESCROW_STATUS.CANCELLED, "Uy egasi rad etdi");
  selectedDeal.value = null;
}
</script>
