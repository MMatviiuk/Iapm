#!/bin/bash

echo "========================================"
echo " ШВИДКИЙ ТЕСТ UI - Prescription Clarity"
echo "========================================"
echo ""

echo "[1/4] Перевірка файлів..."
if [ -f "App.tsx" ]; then
    echo "[OK] App.tsx існує"
else
    echo "[ERROR] App.tsx НЕ ЗНАЙДЕНО!"
    exit 1
fi

if [ -f "main.tsx" ]; then
    echo "[OK] main.tsx існує"
else
    echo "[ERROR] main.tsx НЕ ЗНАЙДЕНО!"
    exit 1
fi

if [ -f "styles/globals.css" ]; then
    echo "[OK] globals.css існує"
else
    echo "[ERROR] globals.css НЕ ЗНАЙДЕНО!"
    exit 1
fi

echo ""
echo "[2/4] Очищення кешу..."
rm -rf dist .vite 2>/dev/null
echo "[OK] Кеш очищено"

echo ""
echo "[3/4] Збірка проекту..."
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] ПОМИЛКА ЗБІРКИ!"
    echo "Перевірте вивід вище для деталей."
    exit 1
fi

echo ""
echo "[4/4] Запуск сервера..."
echo ""
echo "========================================"
echo " UI ТЕСТ ГОТОВИЙ!"
echo "========================================"
echo ""
echo "Відкрийте браузер: http://localhost:5173/"
echo "Натисніть Ctrl+C щоб зупинити сервер"
echo ""
npm run dev
