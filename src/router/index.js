import { createRouter, createWebHistory } from "vue-router";

// Auth
import LoginView from "@/views/auth/LoginView.vue";
import RoleSelectView from "@/views/auth/RoleSelectView.vue";

// Tenant
import TenantHome from "@/views/tenant/HomeView.vue";
import TenantSearch from "@/views/tenant/SearchView.vue";
import ListingDetail from "@/views/tenant/ListingDetailView.vue";
import BookingCheckout from "@/views/tenant/BookingCheckout.vue";
import EscrowStatusView from "@/views/tenant/EscrowStatusView.vue";
import TenantDeals from "@/views/tenant/DealsView.vue";
import TenantPayments from "@/views/tenant/PaymentsView.vue";
import TenantFavorites from "@/views/tenant/FavoritesView.vue";
import TenantChat from "@/views/tenant/ChatView.vue";
import TenantProfile from "@/views/tenant/ProfileView.vue";
import ChatRoom from "@/views/tenant/ChatRoom.vue";
import MapSearchView from "@/views/tenant/MapSearchView.vue";
import RentalAgreement from "@/views/shared/RentalAgreementView.vue";

// Owner
import OwnerDashboard from "@/views/owner/DashboardView.vue";
import OwnerListings from "@/views/owner/MyListingsView.vue";
import CreateListing from "@/views/owner/CreateListingView.vue";
import OwnerBookings from "@/views/owner/BookingRequestsView.vue";
import OwnerPayouts from "@/views/owner/PayoutsView.vue";
import OwnerProfile from "@/views/owner/OwnerProfile.vue";

// Admin
import AdminDashboard from "@/views/admin/AdminDashboard.vue";
import DisputeCenter from "@/views/admin/DisputeCenter.vue";
import UsersManagement from "@/views/admin/UsersManagement.vue";
import AdminProfile from "@/views/admin/AdminProfile.vue";

const routes = [
  // Auth
  { path: "/", name: "login", component: LoginView },
  { path: "/role-select", name: "role-select", component: RoleSelectView },

  // Tenant
  { path: "/tenant", name: "tenant-home", component: TenantHome },
  { path: "/tenant/search", name: "tenant-search", component: TenantSearch },
  {
    path: "/tenant/listing/:id",
    name: "listing-detail",
    component: ListingDetail,
    props: true,
  },
  {
    path: "/tenant/booking/:id",
    name: "booking-checkout",
    component: BookingCheckout,
    props: true,
  },
  {
    path: "/tenant/escrow/:id",
    name: "escrow-status",
    component: EscrowStatusView,
    props: true,
  },
  { path: "/tenant/deals", name: "tenant-deals", component: TenantDeals },
  {
    path: "/tenant/payments",
    name: "tenant-payments",
    component: TenantPayments,
  },
  {
    path: "/tenant/favorites",
    name: "tenant-favorites",
    component: TenantFavorites,
  },
  { path: "/tenant/chat", name: "tenant-chat", component: TenantChat },
  {
    path: "/tenant/chat/:id",
    name: "chat-room",
    component: ChatRoom,
    props: true,
  },
  { path: "/tenant/profile", name: "tenant-profile", component: TenantProfile },
  {
    path: "/tenant/cards",
    name: "tenant-cards",
    component: () => import("../views/tenant/CardsView.vue"),
  },
  { path: "/tenant/map", name: "tenant-map", component: MapSearchView },
  {
    path: "/tenant/notifications",
    name: "tenant-notifications",
    component: () => import("../views/shared/NotificationsView.vue"),
  },

  // Owner
  { path: "/owner", name: "owner-dashboard", component: OwnerDashboard },
  { path: "/owner/listings", name: "owner-listings", component: OwnerListings },
  { path: "/owner/create", name: "create-listing", component: CreateListing },
  {
    path: "/owner/edit/:id",
    name: "edit-listing",
    component: CreateListing,
    props: true,
  },
  { path: "/owner/bookings", name: "owner-bookings", component: OwnerBookings },
  { path: "/owner/payouts", name: "owner-payouts", component: OwnerPayouts },
  { path: "/owner/profile", name: "owner-profile", component: OwnerProfile },
  {
    path: "/owner/notifications",
    name: "owner-notifications",
    component: () => import("../views/shared/NotificationsView.vue"),
  },

  // Admin
  { path: "/admin", name: "admin-dashboard", component: AdminDashboard },
  { path: "/admin/disputes", name: "admin-disputes", component: DisputeCenter },
  { path: "/admin/users", name: "admin-users", component: UsersManagement },
  { path: "/admin/profile", name: "admin-profile", component: AdminProfile },

  // Shared
  {
    path: "/shared/agreement/:id",
    name: "rental-agreement",
    component: RentalAgreement,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
