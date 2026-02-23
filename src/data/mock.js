// IjaraSafe — Mock Data (Uzbek)
// All data simulates real Uzbekistan rental market

export const ESCROW_STATUS = {
  CREATED: "CREATED",
  AWAITING_OWNER_CONFIRM: "AWAITING_OWNER_CONFIRM",
  CONFIRMED: "CONFIRMED",
  FUNDS_HELD: "FUNDS_HELD",
  CHECKIN_PENDING: "CHECKIN_PENDING",
  DISPUTE_OPEN: "DISPUTE_OPEN",
  REFUNDED: "REFUNDED",
  RELEASED: "RELEASED",
  RENTAL_ACTIVE: "RENTAL_ACTIVE",
  CANCELLED: "CANCELLED",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  PARTIAL: "PARTIAL",
  OVERDUE: "OVERDUE",
};

export const PAYMENT_STATUS_LABELS = {
  PENDING: "Kutilmoqda",
  PAID: "To'langan",
  PARTIAL: "Qisman to'langan",
  OVERDUE: "Muddati o'tgan",
};

export const ESCROW_STATUS_LABELS = {
  CREATED: "Yaratildi",
  AWAITING_OWNER_CONFIRM: "Kutilmoqda",
  CONFIRMED: "Tasdiqlangan",
  FUNDS_HELD: "Platformada ushlab turildi",
  CHECKIN_PENDING: "Ko'chib kirish kutilmoqda",
  DISPUTE_OPEN: "Muammo ochildi",
  REFUNDED: "Qaytarildi",
  RELEASED: "To'landi",
  RENTAL_ACTIVE: "Ijara faol",
  CANCELLED: "Bekor qilindi",
};

export const ESCROW_STATUS_COLORS = {
  CREATED: "info",
  AWAITING_OWNER_CONFIRM: "warning",
  CONFIRMED: "info",
  FUNDS_HELD: "warning",
  CHECKIN_PENDING: "warning",
  DISPUTE_OPEN: "danger",
  REFUNDED: "danger",
  RELEASED: "success",
  CANCELLED: "default",
};

export const UTILITIES_OPTIONS = [
  { value: "included", label: "Narxga kiritilgan" },
  { value: "separate", label: "Alohida to'lanadi" },
  { value: "partial", label: "Qisman kiritilgan" },
];

export const DISTRICTS = [
  "Chilonzor",
  "Yunusobod",
  "Mirzo Ulug'bek",
  "Yakkasaroy",
  "Mirobod",
  "Shayxontohur",
  "Olmazor",
  "Uchtepa",
  "Bektemir",
  "Sergeli",
  "Yashnobod",
];

export const ROOM_OPTIONS = [1, 2, 3, 4, 5];

export const FEATURES = [
  { key: "furnished", label: "Mebelli" },
  { key: "familyOnly", label: "Faqat oila" },
  { key: "studentsOk", label: "Talabalar uchun" },
  { key: "petsOk", label: "Hayvon ruxsat" },
  { key: "parking", label: "Avtoturargoh" },
  { key: "wifi", label: "Wi-Fi" },
  { key: "ac", label: "Konditsioner" },
  { key: "washer", label: "Kir yuvish mashinasi" },
  { key: "tv", label: "Televizor" },
  { key: "fridge", label: "Muzlatgich" },
  { key: "balcony", label: "Balkon" },
  { key: "elevator", label: "Lift" },
  { key: "security", label: "Qo'riqlash" },
  { key: "playground", label: "Bolalar maydoni" },
  { key: "newBuilding", label: "Yangi bino" },
  { key: "repaired", label: "Yangi ta'mir" },
  { key: "hotWater", label: "Issiq suv (24s)" },
  { key: "gasStove", label: "Gaz plita" },
];

export const DEFAULT_FEATURES = () => ({
  furnished: false,
  familyOnly: false,
  studentsOk: false,
  petsOk: false,
  parking: false,
  wifi: false,
  ac: false,
  washer: false,
  tv: false,
  fridge: false,
  balcony: false,
  elevator: false,
  security: false,
  playground: false,
  newBuilding: false,
  repaired: false,
  hotWater: false,
  gasStove: false,
});

export const mockUsers = [
  {
    id: "u1",
    name: "Aziz Karimov",
    phone: "+998901234567",
    role: "tenant",
    avatar: null,
    verified: true,
  },
  {
    id: "u2",
    name: "Dilshod Rahimov",
    phone: "+998901234568",
    role: "owner",
    avatar: null,
    verified: true,
  },
  {
    id: "u3",
    name: "Sardor Aliyev",
    phone: "+998901234569",
    role: "owner",
    avatar: null,
    verified: true,
  },
  {
    id: "u4",
    name: "Nodira Tosheva",
    phone: "+998901234570",
    role: "owner",
    avatar: null,
    verified: false,
  },
  {
    id: "admin1",
    name: "Admin",
    phone: "+998900000000",
    role: "admin",
    avatar: null,
    verified: true,
  },
];

export const mockListings = [
  {
    id: "l1",
    ownerId: "u2",
    createdBy: "u2",
    title: "Zamonaviy 2-xonali kvartira",
    price: 3500000,
    deposit: 3500000,
    currency: "so'm",
    rooms: 2,
    floor: 7,
    totalFloors: 9,
    area: 65,
    address: "Chilonzor, 9-kvartal, 14-uy",
    district: "Chilonzor",
    geo: { lat: 41.2856, lng: 69.2048 }, // Chilonzor vicinity
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
    ],
    features: {
      furnished: true,
      familyOnly: false,
      studentsOk: true,
      petsOk: false,
      parking: true,
      wifi: true,
      ac: true,
      washer: true,
      tv: true,
      fridge: true,
      balcony: true,
      elevator: true,
      security: false,
      playground: false,
      newBuilding: false,
      repaired: true,
      hotWater: true,
      gasStove: true,
    },
    rules: "Chekish mumkin emas. Kechki 23:00 dan keyin jimlik.",
    utilitiesType: "separate",
    description:
      "Yangi ta'mirlangan, yorug' va shinam kvartira. Metro yaqin, maktab va bog'cha atrofida. Barcha kerakli mebel va texnika mavjud.",
    availableFrom: "2026-03-01",
    availableTo: "2026-12-31",
    status: "active",
    views: 234,
    createdAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "l2",
    ownerId: "u4",
    createdBy: "u4",
    title: "Keng 3-xonali uy markaz yaqinida",
    price: 5000000,
    deposit: 5000000,
    currency: "so'm",
    rooms: 3,
    floor: 3,
    totalFloors: 5,
    area: 90,
    address: "Yunusobod, 7-kvartal, 28-uy",
    district: "Yunusobod",
    geo: { lat: 41.329, lng: 69.2825 }, // Yunusobod vicinity
    photos: [
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    ],
    features: {
      furnished: true,
      familyOnly: true,
      studentsOk: false,
      petsOk: false,
      parking: true,
      wifi: true,
      ac: true,
      washer: true,
      tv: true,
      fridge: true,
      balcony: true,
      elevator: false,
      security: false,
      playground: false,
      newBuilding: false,
      repaired: false,
      hotWater: true,
      gasStove: true,
    },
    rules: "Faqat oila uchun. Hayvon ruxsat etilmaydi.",
    utilitiesType: "included",
    description:
      "Markaz yaqinida joylashgan qulay kvartira. 3 ta alohida xona, keng oshxona va balkon. Oila uchun ideal.",
    availableFrom: "2026-03-15",
    availableTo: "2027-03-15",
    status: "active",
    views: 156,
    createdAt: "2026-02-18T14:00:00Z",
  },
  {
    id: "l3",
    ownerId: "u2",
    createdBy: "u2",
    title: "Iqtisodiy 1-xonali studiya",
    price: 2000000,
    deposit: 2000000,
    currency: "so'm",
    rooms: 1,
    floor: 2,
    totalFloors: 4,
    area: 35,
    address: "Sergeli, 6-kvartal, 3-uy",
    district: "Sergeli",
    geo: { lat: 41.2278, lng: 69.227 }, // Sergeli vicinity
    photos: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&h=400&fit=crop",
    ],
    features: {
      ...DEFAULT_FEATURES(),
      studentsOk: true,
      petsOk: true,
      gasStove: true,
      hotWater: true,
    },
    rules: "Chekish balkonida ruxsat.",
    utilitiesType: "separate",
    description:
      "Talabalar va yolg'iz yashovchilar uchun qulay narxda studiya kvartira. Transport yaqin.",
    availableFrom: "2026-02-25",
    availableTo: "2026-08-25",
    status: "active",
    views: 89,
    createdAt: "2026-02-21T09:00:00Z",
  },
  {
    id: "l4",
    ownerId: "u4",
    createdBy: "u4",
    title: "Premium 4-xonali penthouse",
    price: 12000000,
    deposit: 24000000,
    currency: "so'm",
    rooms: 4,
    floor: 16,
    totalFloors: 16,
    area: 160,
    address: "Mirobod, Amir Temur shoh ko'chasi, 100-uy",
    district: "Mirobod",
    geo: { lat: 41.3111, lng: 69.279 }, // Mirobod vicinity
    photos: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&h=400&fit=crop",
    ],
    features: {
      furnished: true,
      familyOnly: false,
      studentsOk: false,
      petsOk: true,
      parking: true,
      wifi: true,
      ac: true,
      washer: true,
      tv: true,
      fridge: true,
      balcony: true,
      elevator: true,
      security: true,
      playground: false,
      newBuilding: true,
      repaired: true,
      hotWater: true,
      gasStove: true,
    },
    rules: "Premium segment. VIP xizmat.",
    utilitiesType: "included",
    description:
      "Shahar markazida hashamatli penthouse. Panoramik ko'rinish, premium ta'mir, smart home tizimi. Parking va qo'riqlash kiritilgan.",
    availableFrom: "2026-03-01",
    availableTo: "2027-03-01",
    status: "active",
    views: 412,
    createdAt: "2026-02-15T11:00:00Z",
  },
  {
    id: "l5",
    ownerId: "u2",
    createdBy: "u2",
    title: "Oilaviy 2-xonali yangi binoda",
    price: 4200000,
    deposit: 4200000,
    currency: "so'm",
    rooms: 2,
    floor: 5,
    totalFloors: 12,
    area: 72,
    address: "Mirzo Ulug'bek, Buyuk Ipak Yo'li, 55-uy",
    district: "Mirzo Ulug'bek",
    geo: { lat: 41.34, lng: 69.335 }, // Mirzo Ulugbek vicinity
    photos: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda9e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560440021-33f9b867899d?w=600&h=400&fit=crop",
    ],
    features: {
      furnished: true,
      familyOnly: true,
      studentsOk: false,
      petsOk: false,
      parking: true,
      wifi: true,
      ac: true,
      washer: true,
      tv: true,
      fridge: true,
      balcony: true,
      elevator: true,
      security: true,
      playground: true,
      newBuilding: true,
      repaired: true,
      hotWater: true,
      gasStove: true,
    },
    rules: "Faqat oila. Kechki soat 22:00 dan keyin jimlik.",
    utilitiesType: "separate",
    description:
      "Yangi qurilgan binoda zamonaviy kvartira. Bolalar maydoni, 24 soatlik qo'riqlash. Oila uchun ideal muhit.",
    availableFrom: "2026-03-10",
    availableTo: "2027-03-10",
    status: "active",
    views: 178,
    createdAt: "2026-02-19T08:00:00Z",
  },
  {
    id: "l6",
    ownerId: "u4",
    createdBy: "u4",
    title: "Shinam 1-xonali kvartira metroga yaqin",
    price: 2500000,
    deposit: 2500000,
    currency: "so'm",
    rooms: 1,
    floor: 4,
    totalFloors: 9,
    area: 42,
    address: "Olmazor, Beruniy ko'chasi, 17-uy",
    district: "Olmazor",
    geo: { lat: 41.338, lng: 69.215 }, // Olmazor vicinity
    photos: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585128792020-803d29415281?w=600&h=400&fit=crop",
    ],
    features: {
      ...DEFAULT_FEATURES(),
      furnished: true,
      studentsOk: true,
      wifi: true,
      washer: true,
      hotWater: true,
      gasStove: true,
    },
    rules: "Metro 5 daqiqa yurish. Tinch mahalla.",
    utilitiesType: "separate",
    description:
      "Metro bekatiga 5 daqiqa piyoda. Shinam va yorug' kvartira, yangi ta'mir. Yolg'iz yoki juftliklar uchun.",
    availableFrom: "2026-03-05",
    availableTo: "2027-03-05",
    status: "active",
    views: 143,
    createdAt: "2026-02-22T07:00:00Z",
  },
];

export const mockDeals = [
  {
    id: "d1",
    listingId: "l1",
    tenantId: "u1",
    ownerId: "u2",
    confirmerId: "u2",
    rentAmount: 3500000,
    platformFee: 105000,
    total: 3605000,
    escrowStatus: ESCROW_STATUS.RENTAL_ACTIVE,
    agreementDate: "2026-01-15T10:30:00Z",
    createdAt: "2026-01-15T10:00:00Z",
    payments: [
      {
        id: "p1_1",
        month: "2026-01",
        amount: 4130000,
        status: PAYMENT_STATUS.PAID,
        type: "first_month",
        paidAt: "2026-01-15T10:30:00Z",
      },
      {
        id: "p1_2",
        month: "2026-02",
        amount: 3500000,
        status: PAYMENT_STATUS.PAID,
        type: "recurring",
        paidAt: "2026-02-15T09:00:00Z",
      },
      {
        id: "p1_3",
        month: "2026-03",
        amount: 3500000,
        status: PAYMENT_STATUS.PENDING,
        type: "recurring",
        paidAt: null,
      },
    ],
    history: [
      {
        status: ESCROW_STATUS.CREATED,
        at: "2026-01-15T10:00:00Z",
        note: "Bron yaratildi",
      },
      {
        status: ESCROW_STATUS.RELEASED,
        at: "2026-01-16T09:00:00Z",
        note: "1-oy to'lovi yakunlandi",
      },
      {
        status: ESCROW_STATUS.RENTAL_ACTIVE,
        at: "2026-01-16T10:00:00Z",
        note: "Ijara shartnomasi kuchga kirdi",
      },
    ],
  },
  {
    id: "d2",
    listingId: "l2",
    tenantId: "u5",
    ownerId: "u2",
    confirmerId: "u2",
    rentAmount: 5000000,
    platformFee: 150000,
    total: 5150000,
    escrowStatus: ESCROW_STATUS.RENTAL_ACTIVE,
    agreementDate: "2025-12-10T14:30:00Z",
    createdAt: "2025-12-10T14:00:00Z",
    payments: [
      {
        id: "p2_1",
        month: "2025-12",
        amount: 5150000,
        status: PAYMENT_STATUS.PAID,
        type: "first_month",
        paidAt: "2025-12-10T14:30:00Z",
      },
      {
        id: "p2_2",
        month: "2026-01",
        amount: 5000000,
        status: PAYMENT_STATUS.PAID,
        type: "recurring",
        paidAt: "2026-01-10T10:00:00Z",
      },
      {
        id: "p2_3",
        month: "2026-02",
        amount: 5000000,
        status: PAYMENT_STATUS.OVERDUE,
        type: "recurring",
        paidAt: null,
      },
    ],
    history: [
      {
        status: ESCROW_STATUS.RENTAL_ACTIVE,
        at: "2025-12-11T10:00:00Z",
        note: "Ijara faol",
      },
    ],
  },
  {
    id: "d3",
    listingId: "l4",
    tenantId: "u1",
    ownerId: "u4",
    confirmerId: "u4",
    rentAmount: 12000000,
    platformFee: 360000,
    total: 12360000,
    escrowStatus: ESCROW_STATUS.DISPUTE_OPEN,
    agreementDate: null,
    createdAt: "2026-02-18T09:00:00Z",
    payments: [
      {
        id: "p3_1",
        month: "2026-02",
        amount: 12360000,
        status: PAYMENT_STATUS.PENDING,
        type: "first_month",
        paidAt: null,
      },
    ],
    history: [
      {
        status: ESCROW_STATUS.CREATED,
        at: "2026-02-18T09:00:00Z",
        note: "Bron yaratildi",
      },
      {
        status: ESCROW_STATUS.DISPUTE_OPEN,
        at: "2026-02-19T08:00:00Z",
        note: "Ijarachi muammo bildirdi",
      },
    ],
  },
  {
    id: "d5",
    listingId: "l1",
    tenantId: "u1",
    ownerId: "u2",
    confirmerId: "u2",
    rentAmount: 3500000,
    platformFee: 105000,
    total: 3605000,
    escrowStatus: ESCROW_STATUS.AWAITING_OWNER_CONFIRM,
    agreementDate: null,
    createdAt: new Date().toISOString(),
    payments: [],
    history: [
      {
        status: ESCROW_STATUS.CREATED,
        at: new Date().toISOString(),
        note: "Ijarachi ariza yubordi",
      },
    ],
  },
];

export const mockDisputes = [
  {
    id: "disp1",
    dealId: "d3",
    reason: "E'londan farqli holat. Suratdagi mebel yo'q, devorlar buzilgan.",
    evidence: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560185008-b033106af5c4?w=400&h=300&fit=crop",
    ],
    adminDecision: null,
    decisionAt: null,
    createdAt: "2026-02-19T08:00:00Z",
  },
];

export const mockMessages = [
  {
    id: "m1",
    conversationId: "conv1",
    senderId: "u1",
    receiverId: "u2",
    text: "Salom! Chilonzordagi kvartira hali bandmi?",
    timestamp: "2026-02-22T09:00:00Z",
  },
  {
    id: "m2",
    conversationId: "conv1",
    senderId: "u2",
    receiverId: "u1",
    text: "Salom! Ha, hali bor. Qachon ko'rmoqchisiz?",
    timestamp: "2026-02-22T09:05:00Z",
  },
  {
    id: "m3",
    conversationId: "conv1",
    senderId: "u1",
    receiverId: "u2",
    text: "Bugun kechqurun 18:00 da bo'ladimi?",
    timestamp: "2026-02-22T09:10:00Z",
  },
  {
    id: "m4",
    conversationId: "conv1",
    senderId: "u2",
    receiverId: "u1",
    text: "Ha, kutaman. Manzil: Chilonzor 9-kvartal, 14-uy, 7-qavat.",
    timestamp: "2026-02-22T09:12:00Z",
  },
];

export const mockConversations = [
  {
    id: "conv1",
    participants: ["u1", "u2"],
    listingId: "l1",
    lastMessage: "Ha, kutaman. Manzil: Chilonzor 9-kvartal, 14-uy, 7-qavat.",
    lastMessageAt: "2026-02-22T09:12:00Z",
    unread: 1,
  },
];

// Helpers
export function formatPrice(amount) {
  if (!amount) return "0 so'm";
  return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
}

export function calculatePlatformFee(rentAmount) {
  return Math.round((rentAmount * 3) / 100);
}

export function getUserById(id) {
  return mockUsers.find((u) => u.id === id);
}

export function getListingById(id) {
  return mockListings.find((l) => l.id === id);
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "hozirgina";
  if (mins < 60) return `${mins} daqiqa oldin`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} kun oldin`;
  return `${Math.floor(days / 30)} oy oldin`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
