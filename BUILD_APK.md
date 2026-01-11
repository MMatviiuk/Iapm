# 📱 Як Створити APK - Покрокова Інструкція

## ✅ Швидкий Спосіб (5 хвилин)

### Крок 1: Build проекту
```bash
npm run build
```
Має з'явитись: `✓ built in ~12s`

### Крок 2: Sync з Android
```bash
npx cap sync android
```
Має з'явитись: `Sync finished in ~0.6s`

### Крок 3: Відкрити Android Studio
```bash
npx cap open android
```

### Крок 4: Build APK в Android Studio

**Варіант А - Release APK (для встановлення на телефон):**
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Зачекати ~1-2 хвилини
3. Натиснути "locate" в notification (внизу справа)
4. APK буде в: `android/app/build/outputs/apk/debug/app-debug.apk`

**Варіант Б - Release AAB (для Google Play):**
1. Build → Generate Signed Bundle / APK
2. Вибрати "Android App Bundle"
3. Create new keystore (або використати існуючий)
4. AAB буде в: `android/app/build/outputs/bundle/release/`

---

## 🚀 Альтернатива: Командний Рядок (без Android Studio)

### Якщо є Android SDK:
```bash
cd android
./gradlew assembleDebug
```

APK буде в: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📦 Встановлення APK на Телефон

### Варіант 1: USB
```bash
# Підключити телефон через USB
# Увімкнути Developer Mode + USB Debugging на телефоні

adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Варіант 2: Файл
1. Скопіювати `app-debug.apk` на телефон (email, cloud, etc)
2. На телефоні відкрити файл
3. Дозволити "Install from unknown sources"
4. Встановити

---

## ⚡ Швидкий Build + Install

```bash
# Все за 1 команду (якщо телефон підключений через USB)
npm run build && npx cap sync android && cd android && ./gradlew installDebug
```

---

## 🐛 Troubleshooting

### Помилка: "Android SDK not found"
**Рішення:** Встановіть Android Studio з https://developer.android.com/studio

### Помилка: "Gradle build failed"
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Помилка: "Unable to install APK"
- Перевірте що USB Debugging увімкнений
- Видаліть стару версію додатку з телефону
- Спробуйте `adb uninstall com.medication.tracker`

### APK встановлюється але не запускається
- Перевірте логи: `adb logcat | grep chromium`
- Можливо треба очистити дані: Settings → Apps → Medication Tracker → Clear Data

---

## 📍 Де Знайти APK Після Build

```
android/
  app/
    build/
      outputs/
        apk/
          debug/
            app-debug.apk  ← ТУТ!
          release/
            app-release.apk
```

---

## 🎯 Версія для Production

### 1. Створити Keystore (один раз)
```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

### 2. Додати в `android/gradle.properties`
```
MYAPP_RELEASE_STORE_FILE=my-release-key.jks
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=***
MYAPP_RELEASE_KEY_PASSWORD=***
```

### 3. Build Release
```bash
cd android
./gradlew bundleRelease
```

---

## ✅ Checklist

- [ ] Node.js встановлено
- [ ] Android Studio встановлено
- [ ] `npm run build` працює
- [ ] `npx cap sync android` працює
- [ ] Android Studio відкриває проект
- [ ] Build APK успішний
- [ ] APK встановлюється на телефон
- [ ] Додаток запускається
- [ ] Демо-дані завантажуються
- [ ] Burger menu працює

---

## 🔗 Корисні Посилання

- Capacitor Docs: https://capacitorjs.com/docs/android
- Android Studio: https://developer.android.com/studio
- Gradle Guide: https://developer.android.com/studio/build/building-cmdline

---

**Час створення APK:** 2-5 хвилин ⚡
