# 🚀 Deploy для MVP (100-1000 користувачів)

## 📱 Android APK (5 хвилин)

```bash
# 1. Білд
npm run build

# 2. Синхронізація
npx cap sync android

# 3. Відкрити Android Studio
npx cap open android

# 4. У Android Studio:
Build → Build Bundle(s) / APK(s) → Build APK(s)

# 5. APK готовий:
android/app/build/outputs/apk/debug/app-debug.apk
```

**Встановлення на телефон:**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🌐 Web Deploy на Vercel (3 хвилини)

### 1. Підключити до GitHub
```bash
# Вже зроблено!
```

### 2. Deploy на Vercel:
1. https://vercel.com → New Project
2. Import з GitHub: `MMatviiuk/Iapm`
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `build`
6. Environment Variables:
   ```
   VITE_SUPABASE_URL=your-url
   VITE_SUPABASE_ANON_KEY=your-key
   VITE_GOOGLE_VISION_API_KEY=your-key
   VITE_OPENAI_API_KEY=your-key
   ```
7. **Deploy** → Готово!

**URL:** `https://iapm.vercel.app` (або ваш домен)

---

## 💾 Supabase (БД)

### Налаштування:
1. https://supabase.com → New Project
2. SQL Editor → вставити `supabase-schema.sql`
3. Run
4. Settings → API → скопіювати URL + Key
5. Додати в Vercel Environment Variables

**Готово - працює для 1000+ користувачів!**

---

## ✅ Чек-лист MVP

### Backend:
- [x] Supabase БД налаштована
- [x] RLS політики для безпеки
- [x] Real-time subscriptions

### Frontend:
- [x] React + TypeScript
- [x] PWA (працює офлайн)
- [x] Mobile-friendly UI

### AI/ML:
- [x] Фото/відео сканери (Google Vision)
- [x] Голосовий ввід (УКР + РУС)
- [x] Health консультації (OpenAI)
- [x] ML аналіз (Jupyter)

### Платформи:
- [x] Web (Vercel)
- [x] Android APK (Capacitor)
- [ ] iOS (легко додати)

---

## 💰 Вартість для 100-1000 користувачів

```
Supabase Free:
- 500MB БД (вистачить для 1000 користувачів)
- 50,000 auth користувачів
- 2GB bandwidth/міс

Google Vision:
- 1,000 фото/міс безкоштовно
- $1.50 за кожну наступну 1000

OpenAI GPT-4o-mini:
- $0.15 / 1M input tokens
- ~100 консультацій = $0.20

Vercel:
- Безкоштовно до 100GB bandwidth
- Unlimited deployments

ВСЬОГО: $0-5/міс для 100 користувачів! ✅
```

---

## 📊 Для Диплому

### Software Engineering:
- Full-stack додаток (React + Supabase)
- REST API + Real-time
- Authentication + Authorization
- Mobile (Android APK)
- CI/CD (Vercel auto-deploy)

### Data Science:
- Time Series Analysis (пульс ↔ ліки)
- Statistical Testing (p-values, correlation)
- Data Visualization (Jupyter)
- Predictive Analytics

### ML/AI:
- Computer Vision (Google Vision API)
- Object Detection (підрахунок таблеток)
- Speech Recognition (Web Speech)
- NLP (GPT-4 консультації)

**Все готово для захисту! 🎓**
