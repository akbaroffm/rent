import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";
import { mockListings } from "@/data/mock";

export const useListingsStore = defineStore("listings", () => {
  const listings = ref([...mockListings]);
  const favorites = ref([]);
  const filters = ref({
    district: null,
    minPrice: null,
    maxPrice: null,
    rooms: null,
    utilitiesType: null,
    search: "",
    specialCategory: null,
    sortBy: "newest",
    // feature filters
    furnished: null,
    familyOnly: null,
    studentsOk: null,
    petsOk: null,
    parking: null,
    wifi: null,
    ac: null,
    elevator: null,
    newBuilding: null,
    balcony: null,
  });

  const filteredListings = computed(() => {
    let result = listings.value.filter((l) => {
      if (l.status !== "active") return false;
      const f = filters.value;
      if (f.district && l.district !== f.district) return false;
      if (f.minPrice && l.price < f.minPrice) return false;
      if (f.maxPrice && l.price > f.maxPrice) return false;
      if (f.rooms && l.rooms !== f.rooms) return false;
      if (f.utilitiesType && l.utilitiesType !== f.utilitiesType) return false;

      // Special categories filtering limit
      if (f.specialCategory === "cheapest" && l.price > 4000000) return false;
      if (f.specialCategory === "premium" && l.price < 5000000) return false;

      // feature filters
      const featureKeys = [
        "furnished",
        "familyOnly",
        "studentsOk",
        "petsOk",
        "parking",
        "wifi",
        "ac",
        "elevator",
        "newBuilding",
        "balcony",
      ];
      for (const key of featureKeys) {
        if (f[key] === true && !l.features?.[key]) return false;
      }
      if (f.search) {
        const q = f.search.toLowerCase();
        const searchIn =
          `${l.title} ${l.address} ${l.district} ${l.description}`.toLowerCase();
        if (!searchIn.includes(q)) return false;
      }
      return true;
    });

    // Sorting
    const sortBy = filters.value.sortBy || "newest";
    if (
      sortBy === "price_asc" ||
      filters.value.specialCategory === "cheapest"
    ) {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (
      sortBy === "popular" ||
      filters.value.specialCategory === "popular"
    ) {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      // default newest (including specialCategory === 'new')
      result.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    }

    return result;
  });

  // Specialized lists for Home carousels
  const cheapestListings = computed(() =>
    listings.value
      .filter((l) => l.status === "active")
      .sort((a, b) => a.price - b.price)
      .slice(0, 5),
  );
  const premiumListings = computed(() =>
    listings.value
      .filter((l) => l.status === "active" && l.price >= 5000000)
      .sort((a, b) => b.price - a.price)
      .slice(0, 5),
  );
  const popularListings = computed(() =>
    listings.value
      .filter((l) => l.status === "active")
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5),
  );
  const newListings = computed(() =>
    listings.value
      .filter((l) => l.status === "active")
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5),
  );

  function toggleFavorite(listingId) {
    const idx = favorites.value.indexOf(listingId);
    if (idx >= 0) favorites.value.splice(idx, 1);
    else favorites.value.push(listingId);
  }

  function isFavorite(listingId) {
    return favorites.value.includes(listingId);
  }

  const favoriteListings = computed(() => {
    return listings.value.filter((l) => favorites.value.includes(l.id));
  });

  function getListingById(id) {
    return listings.value.find((l) => l.id === id);
  }

  function getOwnerListings(ownerId) {
    return listings.value.filter((l) => l.ownerId === ownerId);
  }

  function getCreatedByListings(userId) {
    return listings.value.filter((l) => l.createdBy === userId);
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters };
  }

  function clearFilters() {
    filters.value = {
      district: null,
      minPrice: null,
      maxPrice: null,
      rooms: null,
      utilitiesType: null,
      search: "",
      specialCategory: null,
      sortBy: "newest",
      furnished: null,
      familyOnly: null,
      studentsOk: null,
      petsOk: null,
      parking: null,
      wifi: null,
      ac: null,
      elevator: null,
      newBuilding: null,
      balcony: null,
    };
  }

  function addListing(listing) {
    const id = "l" + Date.now();
    listings.value.unshift({
      ...listing,
      id,
      status: "active",
      views: 0,
      createdAt: new Date().toISOString(),
    });
    return id;
  }

  function updateListing(id, data) {
    const idx = listings.value.findIndex((l) => l.id === id);
    if (idx >= 0) {
      listings.value[idx] = { ...listings.value[idx], ...data };
    }
  }

  function updateListingStatus(id, status) {
    const listing = listings.value.find((l) => l.id === id);
    if (listing) listing.status = status;
  }

  function incrementViews(id) {
    const listing = listings.value.find((l) => l.id === id);
    if (listing) listing.views = (listing.views || 0) + 1;
  }

  return {
    listings,
    favorites,
    filters,
    filteredListings,
    favoriteListings,
    cheapestListings,
    premiumListings,
    popularListings,
    newListings,
    toggleFavorite,
    isFavorite,
    getListingById,
    getOwnerListings,
    getCreatedByListings,
    setFilters,
    clearFilters,
    addListing,
    updateListing,
    updateListingStatus,
    incrementViews,
  };
});
