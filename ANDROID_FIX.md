# 🛠️ Виправлення Android APK

## Проблема: Додаток падає при кліках

### Причини:
1. **CSP (Content Security Policy)** блокує inline JS
2. **Capacitor config** - не налаштовані дозволи
3. **Демо-дані** не завантажуються

## ✅ Швидке Виправлення

### 1. Оновити index.html - Додати CSP

**Файл:** `index.html`

Додайте перед `</head>`:

```html
<!-- Android WebView CSP fix -->
<meta http-equiv="Content-Security-Policy"
      content="default-src * 'unsafe-inline' 'unsafe-eval' data: gap: content:;">
```

### 2. Оновити capacitor.config.json

**Файл:** `capacitor.config.json`

```json
{
  "appId": "com.iapm.medication",
  "appName": "IAPM",
  "webDir": "build",
  "server": {
    "androidScheme": "https",
    "cleartext": true,
    "allowNavigation": ["*"]
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": true
  }
}
```

### 3. Перебілдити Android

```bash
# 1. Білд веб-додатку
npm run build

# 2. Синхронізація з Android
npx cap sync android

# 3. Відкрити Android Studio
npx cap open android

# В Android Studio:
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

## 📱 Тестування Android APK

### Автоматична Перевірка

**Створіть файл:** `android-test.sh`

```bash
#!/bin/bash
echo "🧪 Тестування Android APK..."

# 1. Перевірка чи є підключений пристрій/емулятор
if ! adb devices | grep -q "device$"; then
  echo "❌ Немає підключеного пристрою або емулятора!"
  exit 1
fi

echo "✅ Пристрій знайдено"

# 2. Білд
echo "🔨 Білдимо додаток..."
npm run build || exit 1

# 3. Sync
echo "🔄 Синхронізація з Android..."
npx cap sync android || exit 1

# 4. Білд APK через Gradle
echo "📦 Створюємо APK..."
cd android
./gradlew assembleDebug || exit 1
cd ..

# 5. Встановлення APK
echo "📲 Встановлюємо APK на пристрій..."
adb install -r android/app/build/outputs/apk/debug/app-debug.apk || exit 1

echo "✅ APK встановлено!"
echo "📱 Запускаємо додаток..."

# 6. Запуск
adb shell am start -n com.iapm.medication/.MainActivity

echo "✅ Готово! Додаток запущено"
```

### Ручна Перевірка

**Checklist:**
- [ ] Додаток відкривається
- [ ] Login працює (demo@example.com / demo123)
- [ ] Список медикаментів відображається
- [ ] Кнопки реагують на кліки
- [ ] Додавання ліків працює
- [ ] Notіfікації працюють

### Debug в Android Studio

**Якщо падає:**

1. Відкрийте **Logcat** (View → Tool Windows → Logcat)
2. Фільтр: `chromium`
3. Шукайте помилки:
   - `ERR_CLEARTEXT_NOT_PERMITTED` → allowMixedContent
   - `ERR_ACCESS_DENIED` → CSP
   - `localStorage is not defined` → WebView налаштування

### Remote Debugging через Chrome

1. Підключіть телефон через USB
2. Увімкніть **USB Debugging** на телефоні
3. Відкрийте Chrome → `chrome://inspect`
4. Знайдіть ваш додаток → **Inspect**
5. Console покаже всі помилки JS

## 🔍 Перевірка Демо-Даних

**В Chrome DevTools (chrome://inspect):**

```javascript
// Перевірити localStorage
console.log(localStorage.getItem('mock_users'));

// Перевірити базу даних
import { loadDemoDatabase } from './utils/demoData';
const db = await loadDemoDatabase();
console.log('Patients:', db.patients.length);
```

## ⚡ Швидкий Тест (без Android Studio)

```bash
# 1. Білд + Sync
npm run android:sync

# 2. Запуск на емуляторі
npx cap run android

# Якщо емулятор не запущений - запустить автоматично
```

## 📊 Автоматизація Тестів

**Створіть:** `package.json` → додайте scripts:

```json
"scripts": {
  "test:android": "./android-test.sh",
  "android:debug": "npx cap run android -l --external",
  "android:release": "cd android && ./gradlew assembleRelease"
}
```

**Запуск:**
```bash
chmod +x android-test.sh
npm run test:android
```

## 🚨 Troubleshooting

### Помилка: "Cleartext HTTP traffic not permitted"
**Рішення:** Додайте в `capacitor.config.json`:
```json
"server": {
  "cleartext": true
}
```

### Помилка: "localStorage is not defined"
**Рішення:** Перевірте що використовується `androidScheme: "https"`

### Помилка: "CSP violation"
**Рішення:** Оновіть CSP в `index.html`

### Кнопки не реагують
**Рішення:** Перевірте `touch-action` в CSS і додайте `captureInput: true`
