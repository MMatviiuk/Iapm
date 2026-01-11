#!/bin/bash
# Швидке створення APK

set -e

echo "🚀 Створення APK для Android..."
echo ""

# Step 1: Build
echo "📦 Крок 1/3: Build проекту..."
npm run build
echo "✅ Build готовий"
echo ""

# Step 2: Sync
echo "🔄 Крок 2/3: Sync з Android..."
npx cap sync android
echo "✅ Sync готовий"
echo ""

# Step 3: Gradle build (якщо встановлено)
echo "🔨 Крок 3/3: Gradle build..."
if [ -f "android/gradlew" ]; then
  cd android
  chmod +x gradlew
  ./gradlew assembleDebug
  cd ..
  echo ""
  echo "✅ APK створено успішно!"
  echo ""
  echo "📍 Знайти APK тут:"
  echo "   android/app/build/outputs/apk/debug/app-debug.apk"
  echo ""
  echo "📱 Встановити на телефон:"
  echo "   adb install android/app/build/outputs/apk/debug/app-debug.apk"
else
  echo ""
  echo "⚠️  Gradle не знайдено. Відкриваю Android Studio..."
  npx cap open android
  echo ""
  echo "📝 В Android Studio:"
  echo "   1. Build → Build Bundle(s) / APK(s) → Build APK(s)"
  echo "   2. Зачекати 1-2 хвилини"
  echo "   3. Натиснути 'locate' в notification"
  echo "   4. APK буде в: android/app/build/outputs/apk/debug/"
fi
