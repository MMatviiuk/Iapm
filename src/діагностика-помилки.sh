#!/bin/bash

clear
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🆘 ДІАГНОСТИКА ПОМИЛКИ - PRESCRIPTION CLARITY"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "⏳ Запускаю діагностику..."
echo ""

# Перевірка Node.js
echo "[1/5] Перевірка Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js не встановлено"
    echo "   Завантажте з: https://nodejs.org"
    exit 1
fi
echo ""

# Перевірка npm
echo "[2/5] Перевірка npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm не встановлено"
    exit 1
fi
echo ""

# Перевірка залежностей
echo "[3/5] Перевірка node_modules..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules існує"
else
    echo "❌ node_modules не існує"
    echo "⏳ Встановлюю залежності..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Помилка встановлення залежностей"
        exit 1
    fi
    echo "✅ Залежності встановлено"
fi
echo ""

# Перевірка важливих файлів
echo "[4/5] Перевірка файлів..."
FILES_OK=1

if [ -f "App.tsx" ]; then
    echo "✅ App.tsx"
else
    echo "❌ App.tsx не знайдено"
    FILES_OK=0
fi

if [ -f "main.tsx" ]; then
    echo "✅ main.tsx"
else
    echo "❌ main.tsx не знайдено"
    FILES_OK=0
fi

if [ -f "index.html" ]; then
    echo "✅ index.html"
else
    echo "❌ index.html не знайдено"
    FILES_OK=0
fi

if [ -f "package.json" ]; then
    echo "✅ package.json"
else
    echo "❌ package.json не знайдено"
    FILES_OK=0
fi

if [ -f "vite.config.ts" ]; then
    echo "✅ vite.config.ts"
else
    echo "❌ vite.config.ts не знайдено"
    FILES_OK=0
fi

if [ $FILES_OK -eq 0 ]; then
    echo ""
    echo "❌ Деякі файли відсутні"
    exit 1
fi
echo ""

# Копіювання бази даних
echo "[5/5] Копіювання бази даних..."
if [ -f "data/complete-database.json" ]; then
    npm run copy-db
    if [ $? -ne 0 ]; then
        echo "⚠️  Помилка копіювання БД (продовжую)"
    else
        echo "✅ База даних скопійована"
    fi
else
    echo "⚠️  База даних не знайдена (продовжую)"
fi
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "  ✅ ДІАГНОСТИКА ЗАВЕРШЕНА"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🎯 НАСТУПНІ КРОКИ:"
echo ""
echo "1. Запустіть сервер:    npm run dev"
echo "2. Відкрийте браузер:   http://localhost:5173"
echo "3. Очистіть кеш:        Cmd + Shift + R (Mac) або Ctrl + Shift + R"
echo "4. Відкрийте консоль:   F12 або Cmd + Option + I (Console)"
echo ""
echo "💡 Якщо побачите помилку - скопіюйте її текст та надішліть мені"
echo ""
