# IjaraSafe — API Endpointlar va Webhook'lar

## Auth
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/auth/send-sms` | SMS kod yuborish |
| POST | `/api/auth/verify` | SMS kodni tasdiqlash |
| POST | `/api/auth/select-role` | Rol tanlash |
| GET | `/api/auth/me` | Joriy foydalanuvchi |
| POST | `/api/auth/logout` | Chiqish |

## Users
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/users/:id` | Foydalanuvchi profili |
| PUT | `/api/users/:id` | Profilni yangilash |
| POST | `/api/users/:id/verify` | Admin: tasdiqlash |
| POST | `/api/users/:id/block` | Admin: bloklash |
| GET | `/api/users` | Admin: barcha foydalanuvchilar |

## Listings
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/listings` | E'lonlar ro'yxati (filtrlash) |
| GET | `/api/listings/:id` | E'lon tafsilotlari |
| POST | `/api/listings` | Yangi e'lon yaratish |
| PUT | `/api/listings/:id` | E'lonni tahrirlash |
| PATCH | `/api/listings/:id/status` | Statusni o'zgartirish |
| DELETE | `/api/listings/:id` | E'lonni o'chirish |
| GET | `/api/listings/owner/:ownerId` | Eganing e'lonlari |
| GET | `/api/listings/agent/:agentId` | Maklerning e'lonlari |

### Query Parameters (Filtrlash)
```
?district=Chilonzor
&minPrice=2000000
&maxPrice=5000000
&rooms=2
&furnished=true
&familyOnly=false
&studentsOk=true
&petsOk=false
&search=kvartira
&page=1
&limit=20
```

## Deals (Escrow)
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/deals` | Yangi bron yaratish |
| GET | `/api/deals/:id` | Bron tafsilotlari |
| GET | `/api/deals/tenant/:id` | Ijarachining bronlari |
| GET | `/api/deals/owner/:id` | Uy egasining bronlari |
| GET | `/api/deals/agent/:id` | Maklerning bronlari |
| POST | `/api/deals/:id/confirm` | Uy egasi tasdiqlaydi |
| POST | `/api/deals/:id/cancel` | Bekor qilish |
| POST | `/api/deals/:id/checkin` | Ko'chib kirish tasdiqi |
| POST | `/api/deals/:id/dispute` | Muammo bildirish |

## Disputes
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/disputes` | Admin: barcha nizolar |
| GET | `/api/disputes/:id` | Nizo tafsilotlari |
| POST | `/api/disputes/:id/resolve` | Admin: qaror qilish |

## Chat
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/conversations` | Suhbatlar ro'yxati |
| GET | `/api/conversations/:id/messages` | Xabarlar |
| POST | `/api/conversations/:id/messages` | Xabar yuborish |
| POST | `/api/conversations` | Yangi suhbat boshlash |

## Favorites
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/favorites` | Sevimli e'lonlar |
| POST | `/api/favorites/:listingId` | Sevimliga qo'shish |
| DELETE | `/api/favorites/:listingId` | Sevimlydan olib tashlash |

---

## Webhook Events (Escrow Status Changes)

| Event | Trigger | Payload |
|-------|---------|---------|
| `deal.created` | Yangi bron yaratilganda | `{ dealId, tenantId, listingId, total }` |
| `deal.awaiting_confirm` | To'lov qilinganda | `{ dealId, ownerId, confirmDeadline }` |
| `deal.confirmed` | Uy egasi tasdiqlasa | `{ dealId, checkinDeadline }` |
| `deal.funds_held` | Mablag' ushlab turilganda | `{ dealId, total }` |
| `deal.checkin_pending` | Ko'chib kirish kutilganda | `{ dealId, tenantId, checkinDeadline }` |
| `deal.released` | Mablag' chiqarilganda | `{ dealId, ownerId, agentId?, amounts }` |
| `deal.dispute_opened` | Nizo ochilganda | `{ dealId, disputeId, reason }` |
| `deal.refunded` | Qaytarilganda | `{ dealId, tenantId, amount }` |
| `deal.cancelled` | Bekor qilinganda | `{ dealId, reason }` |
| `deal.auto_cancel` | 2 soat ichida tasdiqlanmasa | `{ dealId }` |
| `deal.auto_release` | 24 soat ichida javob bo'lmasa | `{ dealId }` |

---

## Scheduled Jobs (Cron)

| Job | Interval | Vazifasi |
|-----|----------|----------|
| `check-confirm-deadline` | Har 5 daqiqa | AWAITING_OWNER_CONFIRM > 2 soat → CANCELLED |
| `check-checkin-deadline` | Har 15 daqiqa | CHECKIN_PENDING > 24 soat → RELEASED |
