#!/bin/bash
echo "🧪 Тестування Android APK..."

# 1. Перевірка чи є підключений пристрій/емулятор
if ! adb devices | grep -q "device$"; then
  echo "❌ Немає підключеного пристрою або емулятора!"
  echo "💡 Запустіть емулятор або підключіть телефон з USB Debugging"
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
adb shell am start -n com.medication.tracker/.MainActivity

echo ""
echo "✅ Готово! Додаток запущено"
echo ""
echo "🔍 Для перегляду логів:"
echo "   adb logcat | grep chromium"
echo ""
echo "🌐 Для remote debugging:"
echo "   Відкрийте Chrome → chrome://inspect"
