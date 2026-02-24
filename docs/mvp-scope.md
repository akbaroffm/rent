# IjaraSafe — MVP vs Phase 2

## MVP (1-versiya) — 6-8 hafta

### ✅ Kiritilgan

- **Auth:** Telefon + SMS login, rol tanlash
- **Ijarachi:** E'lonlar lentasi, qidirish + filtrlar, e'lon tafsilotlari, sevimlilar
- **Escrow:** "Xavfsiz bron" → to'lov → uy egasi tasdiqlash → ko'chib kirish → chiqarish
- **Uy egasi:** E'lon CRUD, bron so'rovlari, to'lovlar
- **Makler:** Dashboard, boshqarilayotgan e'lonlar, arizalar, profil
- **Chat:** In-app xabar almashish
- **Admin:** Dashboard, nizo markazi (qaror + dalillar), foydalanuvchi boshqaruvi
- **Dizayn:** Mobile-first, Airbnb-flat, O'zbek til
- **To'lov:** Payme/Click integratsiya
- **Platforma to'lovi:** 3% har bir bitimdan

### ❌ Keyinga qoldirilgan

- Xarita ko'rinishi (Map view)
- Push bildirishnomalar
- Baho va sharhlar (Rating & Review)
- Rasm yuklash (hozir mock URL)
- Telegram Mini App
- Rus tili

---

## Phase 2 — 4-6 hafta (MVP dan keyin)

### Xususiyatlar

| Feature                | Tavsif                                           | Prioritet |
| ---------------------- | ------------------------------------------------ | --------- |
| **Xarita ko'rinishi**  | Leaflet/Mapbox bilan e'lonlarni xaritada ko'rish | Yuqori    |
| **Push notifications** | FCM/OneSignal bilan real-time bildirishnomalar   | Yuqori    |
| **Baho va sharhlar**   | Bitimdan keyin uy egasi/maklerga baho berish     | O'rta     |
| **Rasm yuklash**       | Cloudinary/S3 bilan real rasm upload             | Yuqori    |
| **Telegram Mini App**  | Asosiy flow'lar: browse, book, deal status       | Yuqori    |
| **Rus tili**           | i18n bilan til almashtirish                      | O'rta     |
| **Shartnoma**          | PDF shartnoma generatsiyasi                      | Past      |
| **Makler obunasi**     | Pro paket: analytics, priority leads             | Past      |
| **Verified badge**     | Hujjat tekshirish + badge berish                 | O'rta     |
| **Premium e'lon**      | E'lonni yuqoriga ko'tarish (pullik)              | O'rta     |

### Telegram Mini App (Phase 2)

```
Soddalashtirilgan flow:
  → Browse e'lonlar
  → E'lon tafsilotlari
  → Chat deep-link (Telegram chat'ga yo'naltiriladi)
  → "Xavfsiz bron" checkout
  → Deal status ko'rish
  → Uy egasi/Makler: tez tasdiqlash

Telegram login orqali kirish (telefon raqami avtomatik)
```
