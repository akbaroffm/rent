# IjaraSafe — UX Flow Diagrammalari

## 1. Ijarachi (Tenant) Flow

```
Kirish (telefon + SMS)
  → Rol tanlash: "Ijarachi"
  → Bosh sahifa (e'lonlar lentasi)
  → Qidiruv / Filtrlar
  → E'lon tafsilotlari
     ├→ Chat: Uy egasi/Makler bilan yozishmoq
     ├→ Sevimlilar: ❤️ belgisi bilan saqlash
     └→ "Xavfsiz bron qilish" → Checkout sahifasi
        → To'lov usulini tanlash (Payme/Click/Karta)
        → "Xavfsiz bron qilish" tugmasi
        → Escrow holati sahifasi:
           ├→ Uy egasi tasdiqlashini kutish (2 soat)
           ├→ Ko'chib kirish oynasi (24 soat):
           │   ├→ "Ko'chib kirdim" → Mablag' chiqariladi ✓
           │   └→ "Muammo bor" → Nizo ochiladi
           └→ Natija: RELEASED / REFUNDED / DISPUTE
```

## 2. Uy egasi (Owner) Flow

```
Kirish → Rol: "Uy egasi"
  → Boshqaruv paneli (statistika)
  → E'lon yaratish (3 qadam):
     1. Asosiy ma'lumotlar (nom, xonalar, tuman, manzil)
     2. Narx va xususiyatlar (narx, garov, mebel, makler rejimi)
     3. Tavsif va qoidalar
  → E'lonlarim (faol/band qilish)
  → Bron so'rovlari:
     ├→ "Tasdiqlash" (2 soat ichida) → Escrow davom etadi
     └→ "Rad etish" → Bron bekor
  → To'lovlar sahifasi (daromad, kutilayotgan, muzlatilgan)
```

## 3. Makler (Agent) Flow

```
Kirish → Rol: "Makler"
  → Makler paneli (statistika, komissiya ma'lumoti)
  → Boshqarilayotgan e'lonlar
  → Arizalar (ijarachilardan so'rovlar)
     → Har bir ariza: ijara + komissiya (max 20%) ko'rsatiladi
  → Profil (reyting, xizmat tumanlari, daromad)
```

## 4. Admin Flow

```
Admin panel
  → Dashboard (foydalanuvchilar, e'lonlar, bitimlar, nizolar soni)
  → Nizo markazi:
     → Nizo tafsilotlari (sabab, dalillar, bitim ma'lumotlari)
     → Qaror: "To'liq qaytarish" / "Qisman qaytarish" / "Chiqarish"
  → Foydalanuvchilar boshqaruvi:
     → Qidirish, tasdiqlash, bloklash
```

## 5. Escrow State Machine

```
CREATED → AWAITING_OWNER_CONFIRM → CONFIRMED → FUNDS_HELD → CHECKIN_PENDING
                                                                    │
                                          ┌─────────────────────────┤
                                          │                         │
                                     DISPUTE_OPEN              RELEASED ✓
                                          │
                                    ┌─────┴─────┐
                                    │           │
                              REFUNDED     RELEASED ✓

Auto-cancel: AWAITING_OWNER_CONFIRM → CANCELLED (2 soat)
Auto-release: CHECKIN_PENDING → RELEASED (24 soat)
```
