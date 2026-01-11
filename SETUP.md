# 🚀 Налаштування Проекту

## 1️⃣ Supabase Backend

### Створення Проекту:
1. Зайдіть на https://supabase.com
2. Створіть акаунт (безкоштовно)
3. Натисніть "New Project"
4. Виберіть організацію
5. Назва: `medication-tracker`
6. Database Password: (збережіть!)
7. Region: ближчий до вас

### Налаштування БД:
1. Відкрийте **SQL Editor**
2. Скопіюйте весь код з `supabase-schema.sql`
3. Вставте і натисніть **RUN**
4. ✅ Готово!

### Отримання Keys:
1. Settings → API
2. Скопіюйте:
   - `Project URL` → VITE_SUPABASE_URL
   - `anon public` key → VITE_SUPABASE_ANON_KEY

### Додайте в .env:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_GOOGLE_VISION_API_KEY=AIzaSy...
```

---

## 2️⃣ Google Vision API

Детальна інструкція: `GOOGLE_VISION_SETUP.md`

Коротко:
```bash
VITE_GOOGLE_VISION_API_KEY=AIzaSy...
```

---

## 3️⃣ Android APK

### Білд Web версії:
```bash
npm run build
```

### Синхронізація з Android:
```bash
npx cap sync android
```

### Відкриття в Android Studio:
```bash
npx cap open android
```

### Генерація APK:
1. Android Studio → Build → Build Bundle(s) / APK(s) → Build APK(s)
2. APK буде в `android/app/build/outputs/apk/debug/app-debug.apk`

### Встановлення на телефон:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Запуск Проекту

### Локально (браузер):
```bash
npm run dev
```

### Android (телефон):
```bash
npm run build
npx cap sync android
npx cap run android
```

---

## ✅ Перевірка

**Supabase:**
- [ ] Таблиці створені
- [ ] RLS політики активні
- [ ] Keys додані в .env

**Google Vision:**
- [ ] API активований
- [ ] Key додано в .env
- [ ] Перевірено на фото

**Android:**
- [ ] Білд успішний
- [ ] APK згенеровано
- [ ] Працює на телефоні

---

## 💰 Вартість

- Supabase Free: 500MB БД, 50K auth користувачів
- Google Vision: 1000 фото + 1000 хв відео/міс безкоштовно
- **ВСЬОГО: $0/міс** для початку! 🎉
