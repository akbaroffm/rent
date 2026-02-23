<template>
  <div
    ref="mapContainer"
    class="w-full h-full rounded-xl overflow-hidden border border-[var(--color-border)]"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object, // { lat, lng }
    default: () => ({ lat: 41.311081, lng: 69.240562 }), // Tashkent center
  },
  markers: {
    type: Array, // Array of { lat, lng, title, price, id }
    default: () => [],
  },
  mode: {
    type: String, // 'view' or 'select' or 'search'
    default: "view",
  },
  zoom: {
    type: Number,
    default: 13,
  },
});

const emit = defineEmits(["update:modelValue", "marker-click"]);

const mapContainer = ref(null);
let map = null;
let mainMarker = null;
let markersGroup = null;

onMounted(() => {
  if (!window.L) {
    console.error("Leaflet not loaded");
    return;
  }

  const L = window.L;

  // Initialize map
  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
  }).setView([props.modelValue.lat, props.modelValue.lng], props.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // Add zoom control to bottom right
  L.control.zoom({ position: "bottomright" }).addTo(map);

  if (props.mode === "select") {
    // Selection mode: single marker that moves on click
    mainMarker = L.marker([props.modelValue.lat, props.modelValue.lng], {
      draggable: true,
    }).addTo(map);

    mainMarker.on("dragend", () => {
      const { lat, lng } = mainMarker.getLatLng();
      emit("update:modelValue", { lat, lng });
    });

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      mainMarker.setLatLng([lat, lng]);
      emit("update:modelValue", { lat, lng });
    });
  } else if (props.mode === "view") {
    // View mode: single static marker
    mainMarker = L.marker([props.modelValue.lat, props.modelValue.lng]).addTo(
      map,
    );
  } else if (props.mode === "search") {
    // Search mode: many markers
    markersGroup = L.layerGroup().addTo(map);
    updateSearchMarkers();
  }

  // To fix layout issues when map is hidden/shown
  setTimeout(() => {
    map.invalidateSize();
  }, 400);
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

// Watch for external coordinate changes (e.g. initial load or parent update)
watch(
  () => props.modelValue,
  (newVal) => {
    if (map && (props.mode === "view" || props.mode === "select")) {
      const latlng = [newVal.lat, newVal.lng];
      map.setView(latlng);
      if (mainMarker) mainMarker.setLatLng(latlng);
    }
  },
  { deep: true },
);

// Watch for search markers updates
watch(
  () => props.markers,
  () => {
    if (props.mode === "search") {
      updateSearchMarkers();
    }
  },
  { deep: true },
);

function updateSearchMarkers() {
  if (!map || !markersGroup || !window.L) return;
  const L = window.L;
  markersGroup.clearLayers();

  props.markers.forEach((m) => {
    if (!m.lat || !m.lng) return;
    const marker = L.marker([m.lat, m.lng]);

    if (m.title || m.price) {
      const popupContent = `
        <div style="font-family: var(--font-sans); padding: 4px;">
          <p style="font-weight: 700; margin-bottom: 2px; font-size: 13px; margin-top: 0;">${m.price ? m.price : ""}</p>
          <p style="font-size: 11px; color: var(--color-text-secondary); margin: 0;">${m.title || ""}</p>
        </div>
      `;
      marker.bindPopup(popupContent, { closeButton: false });
    }

    marker.on("click", () => {
      emit("marker-click", m);
    });

    marker.addTo(markersGroup);
  });

  // Fit bounds if multiple markers exist
  if (props.markers.length > 0) {
    const group = L.featureGroup(markersGroup.getLayers());
    map.fitBounds(group.getBounds().pad(0.1));
  }
}
</script>

<style>
/* Leaflet popup overrides to match design */
.leaflet-popup-content-wrapper {
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
.leaflet-popup-tip-container {
  display: none;
}
</style>
