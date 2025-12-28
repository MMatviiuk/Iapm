@echo off
echo ========================================
echo  ШВИДКИЙ ТЕСТ UI - Prescription Clarity
echo ========================================
echo.

echo [1/4] Перевірка файлів...
if exist "App.tsx" (
    echo [OK] App.tsx існує
) else (
    echo [ERROR] App.tsx НЕ ЗНАЙДЕНО!
    pause
    exit /b 1
)

if exist "main.tsx" (
    echo [OK] main.tsx існує
) else (
    echo [ERROR] main.tsx НЕ ЗНАЙДЕНО!
    pause
    exit /b 1
)

if exist "styles\globals.css" (
    echo [OK] globals.css існує
) else (
    echo [ERROR] globals.css НЕ ЗНАЙДЕНО!
    pause
    exit /b 1
)

echo.
echo [2/4] Очищення кешу...
rmdir /s /q dist 2>nul
echo [OK] dist папка очищена

echo.
echo [3/4] Збірка проекту...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] ПОМИЛКА ЗБІРКИ!
    echo Перевірте вивід вище для деталей.
    pause
    exit /b 1
)

echo.
echo [4/4] Запуск сервера...
echo.
echo ========================================
echo  UI ТЕСТ ГОТОВИЙ!
echo ========================================
echo.
echo Відкрийте браузер: http://localhost:5173/
echo Натисніть Ctrl+C щоб зупинити сервер
echo.
call npm run dev
