# IjaraSafe — Xavfsizlik va Anti-fraud Checklist

## 1. Autentifikatsiya
- [ ] Telefon raqami + SMS OTP (bir martalik parol)
- [ ] SMS kodni 5 daqiqada muddati tugashi
- [ ] Bir raqamga kuniga max 5 ta SMS cheklovi (brute force himoya)
- [ ] Rate limiting: IP va telefon raqami bo'yicha
- [ ] JWT tokenlar, qisqa muddatli (15 min access + 7 kun refresh)

## 2. Ma'lumotlar validatsiyasi
- [ ] Server-side validatsiya barcha input'lar uchun
- [ ] Makler haqi 20% dan oshmasligini server tekshiradi (client + server)
- [ ] Narxlar faqat musbat sonlar
- [ ] Rasm yuklash: max 10 ta, max 5MB har biri, faqat JPG/PNG/WebP
- [ ] XSS himoya: barcha text input'larni sanitize qilish
- [ ] SQL injection himoya: ORM/parametrized queries

## 3. Escrow xavfsizligi
- [ ] Mablag' to'g'ridan-to'g'ri uy egasiga o'tkazilmaydi
- [ ] Status o'zgarishi faqat ruxsat etilgan yo'nalishda (state machine)
- [ ] Avtomatik bekor qilish: 2 soat timer server-side cron
- [ ] Avtomatik chiqarish: 24 soat timer server-side cron
- [ ] Ikki tomonlama tasdiqlash: uy egasi + ijarachi
- [ ] Admin qarorlari audit log'da saqlanadi

## 4. To'lov xavfsizligi
- [ ] PCI DSS talablariga muvofiq to'lov gateway (Payme, Click)
- [ ] Karta ma'lumotlari platformada saqlanmaydi
- [ ] To'lov ID'lari unikal va takrorlanmas
- [ ] Qaytarish (refund) faqat admin tomonidan

## 5. Anti-fraud
- [ ] Bitta telefon raqamiga bitta akkaunt
- [ ] Soxta e'lonlarni aniqlash: bir xil rasm + turli manzillar
- [ ] Tez-tez bekor qiluvchilar uchun ogohlantirish
- [ ] Shubhali aktivlik: kuniga 10+ bron → avtomatik bloklash
- [ ] Admin bloklash imkoniyati: foydalanuvchi va e'lonlar

## 6. Ma'lumotlar himoyasi
- [ ] HTTPS majburiy (SSL/TLS)
- [ ] Shaxsiy ma'lumotlar shifrlangan (parollar, token'lar)
- [ ] Telefon raqamlari qisman yashirilgan (boshqa foydalanuvchilarga)
- [ ] Rasm URL'lari signed/expired bo'lishi kerak
- [ ] CORS sozlash: faqat ishonchli domain'lar

## 7. Monitoring
- [ ] Barcha escrow statuslarini loglash
- [ ] To'lov xatolarini alohida monitoring
- [ ] Admin harakatlari audit trail
- [ ] Anomaliya aniqlash (katta summa, tez-tez nizolar)
