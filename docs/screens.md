# IjaraSafe — Ekranlar va Komponentlar

## Auth
| Ekran | Komponentlar |
|-------|-------------|
| Login | Logo, telefon input (+998), SMS kod inputlar (4 ta), demo tugmalar |
| Rol tanlash | 3 ta rol kartasi (Ijarachi/Uy egasi/Makler), tasdiqlash tugma |

## Ijarachi (Tenant)
| Ekran | Komponentlar |
|-------|-------------|
| Bosh sahifa | Header (logo + bildirishnoma), qidiruv paneli, kategoriya chip'lari, ListingCard grid |
| Qidirish | Qidiruv input, filtr chip'lar (tuman/xona/narx/mebelli/hayvon), natijalar |
| E'lon tafsilotlari | Rasm galereyasi, sarlavha, manzil, statistika (xona/maydon/qavat), egasi/makler kartasi, xususiyatlar, qoidalar, PriceBreakdown, CTA tugma |
| Checkout | E'lon xulosasi, escrow tushuntirish, PriceBreakdown, to'lov usullari (radio), jarayon bosqichlari, bron tugma |
| Escrow holati | Status ikonka + badge, harakat tugmalari (tasdiqlash/muammo), nizo formasi, to'lov tafsilotlari, timeline |
| Bitimlarim | Deal kartalar ro'yxati + StatusBadge |
| Sevimlilar | ListingCard grid |
| Xabarlar | Suhbat ro'yxati (avatar, ism, oxirgi xabar, vaqt, unread badge) |
| Chat xonasi | Xabar pufakchalari, vaqt belgilari, input + yuborish tugma |
| Profil | Avatar, ism, telefon, badge, menyu (bitimlar/til/yordam), rol o'zgartirish, chiqish |

## Uy egasi (Owner)
| Ekran | Komponentlar |
|-------|-------------|
| Boshqaruv | Statistika kartalar (3 ta), kutilayotgan bronlar, tezkor harakatlar, so'nggi bitimlar |
| E'lonlarim | Yangi qo'shish tugma, e'lon kartalar (rasm, sarlavha, narx, status badge, tahrirlash/band tugmalari) |
| E'lon yaratish | 3 bosqichli stepper, input formlar, xususiyat checkbox'lar, makler rejimi radio, PriceBreakdown preview |
| Bron so'rovlari | Deal kartalar + tasdiqlash/rad tugmalari |
| To'lovlar | Daromad xulosasi (umumiy/kutilayotgan/muzlatilgan), to'lov tarixi ro'yxati |

## Makler (Agent)
| Ekran | Komponentlar |
|-------|-------------|
| Boshqaruv | Statistika (3 ta), komissiya qoidasi info, faol bitimlar |
| Boshqarilayotgan e'lonlar | E'lon kartalar ro'yxati |
| Arizalar | Deal kartalar (ijara + komissiya ko'rsatilgan) |
| Profil | Avatar, ism, badge, statistika (bitimlar/reyting/e'lonlar), xizmat tumanlari, komissiya stavka, daromad |

## Admin
| Ekran | Komponentlar |
|-------|-------------|
| Dashboard | Statistika (foydalanuvchilar/e'lonlar/bitimlar/nizolar), tezkor havolalar, platforma daromadi |
| Nizo markazi | Nizo kartalar (header, deal info, sabab, dalil rasmlari, admin qaror tugmalari) |
| Foydalanuvchilar | Qidiruv input, foydalanuvchi kartalar (avatar, ism, telefon, rol badge, tasdiqlash/bloklash) |

## Umumiy Komponentlar
| Komponent | Tavsif |
|-----------|--------|
| BottomNav | Rol asosida 4-5 ta tab, aktiv holat |
| AppHeader | Sarlavha + orqaga tugma + action slot |
| ListingCard | Rasm, badge, sevimli tugma, tuman, sarlavha, statistika, narx |
| PriceBreakdown | Ijara + makler haqi + platforma to'lovi + jami |
| StatusBadge | Rangli escrow status badge + ikonka |
| EmptyState | Ikonka + sarlavha + tavsif |
