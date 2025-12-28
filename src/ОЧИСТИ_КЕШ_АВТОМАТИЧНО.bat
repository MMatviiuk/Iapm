@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════════
echo   🚨 ОЧИЩЕННЯ КЕШУ VITE - АВТОМАТИЧНО
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📋 ЩО БУДЕ ЗРОБЛЕНО:
echo    1. Видалення node_modules/.vite
echo    2. Видалення .vite
echo    3. Видалення dist
echo    4. Перезапуск dev server
echo.
echo ⏱️  Займе: 30 секунд
echo.
pause

echo.
echo 🗑️  Крок 1/4: Видалення node_modules/.vite...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo    ✅ Видалено node_modules/.vite
) else (
    echo    ⚠️  Папка не існує (це нормально)
)

echo.
echo 🗑️  Крок 2/4: Видалення .vite...
if exist ".vite" (
    rmdir /s /q ".vite"
    echo    ✅ Видалено .vite
) else (
    echo    ⚠️  Папка не існує (це нормально)
)

echo.
echo 🗑️  Крок 3/4: Видалення dist...
if exist "dist" (
    rmdir /s /q "dist"
    echo    ✅ Видалено dist
) else (
    echo    ⚠️  Папка не існує (це нормально)
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   ✅ КЕШІ ВИДАЛЕНО УСПІШНО!
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📝 НАСТУПНІ КРОКИ:
echo.
echo    1. У терміналі де запущено npm run dev:
echo       - Натисни Ctrl + C (зупинити сервер)
echo.
echo    2. Запусти dev server заново:
echo       npm run dev
echo.
echo    3. У браузері:
echo       - Натисни Ctrl + Shift + R (hard refresh)
echo       - Натисни 3 РАЗИ ПІДРЯД!
echo.
echo    4. Або відкрий в інкогніто:
echo       - Ctrl + Shift + N (Chrome/Edge)
echo       - Перейди на localhost:5173
echo.
echo ═══════════════════════════════════════════════════════════════
echo   🎯 ТЕПЕР КНОПКИ МАЮТЬ БУТИ ВЕЛИКИМИ (48-56px)!
echo ═══════════════════════════════════════════════════════════════
echo.
pause
