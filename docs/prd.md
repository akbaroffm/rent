# IjaraSafe — Mahsulot Talablari Hujjati (PRD)

## Loyiha maqsadi
IjaraSafe — O'zbekistonda xavfsiz ijara platformasi. Asosiy muammo: Ijarachilar pul yuborib, aldanib qolishi. Platforma escrow (garov) tizimi orqali uch tomonni himoya qiladi: ijarachi, uy egasi, makler.

## Foydalanuvchi rollari

### 1. Ijarachi (Tenant)
- Uy qidirish, filtrlar bilan saralash
- E'lon tafsilotlarini ko'rish
- Makler haqi va platforma to'lovini shaffof ko'rish
- "Xavfsiz bron" orqali xavfsiz to'lov qilish
- Ko'chib kirgandan keyin tasdiqlash yoki muammo bildirish

### 2. Uy egasi (Owner)
- E'lon yaratish va boshqarish
- Maklersiz yoki makler bilan ishlash
- Bron so'rovlarini tasdiqlash/rad etish (2 soat ichida)
- To'lovlarni kuzatish

### 3. Makler (Agent)
- Profil yaratish, xizmat tumanlarini belgilash
- Uy egalarining e'lonlariga birikish
- Ijarachilarga xizmat ko'rsatish
- Komissiya (max 20%) olish

## Escrow qoidalari

1. **Bron yaratiladi** — Ijarachi "Xavfsiz bron" tugmasini bosadi
2. **To'lov qilinadi** — Ijara + makler haqi + platforma to'lovi
3. **Mablag' platformada saqlanadi** — "Platformada ushlab turildi"
4. **Uy egasi tasdiqlaydi** — 2 soat ichida. Aks holda avtomatik bekor.
5. **Ko'chib kirish oynasi** — 24 soat:
   - "Ko'chib kirdim" → mablag' chiqariladi
   - "Muammo bor" → mablag' muzlatiladi, nizo ochiladi
6. **Hech narsa qilmasa** — 24 soatdan keyin avtomatik chiqarish
7. **Nizo** — Admin ko'rib chiqib qaror qiladi: to'liq/qisman qaytarish yoki chiqarish

## Cheklashlar
- Makler haqi **maksimum 20%** (qattiq validatsiya)
- Platforma xizmati: **3%** (belgilangan)
- Barcha narxlar shaffof ko'rsatiladi
- Gradient, soya yo'q — tekis, Airbnb uslubidagi dizayn
- Asosiy til: O'zbek

## Edge case'lar
| Holat | Natija |
|---|---|
| Uy egasi 2 soat ichida tasdiqlamasa | Avtomatik bekor, qaytarish |
| Ijarachi 24 soat ichida hech narsa qilmasa | Avtomatik chiqarish |
| Ijarachi muammo bildirsa | Mablag' muzlatiladi, admin hal qiladi |
| Makler haqi 20% dan oshsa | Tizim rad etadi |
| E'lon band bo'lsa | Status "Band" ga o'zgaradi |
