@echo off
REM Prescription Clarity - Quick Fix Script (Windows)
REM Автоматичне виправлення найпоширеніших проблем

echo.
echo 🔧 Prescription Clarity - Quick Fix
echo ====================================
echo.

REM Перевірка Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Node.js не встановлено
    echo.
    echo Встановіть Node.js v18+ з https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js встановлено
node --version

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ npm не встановлено
    pause
    exit /b 1
)

echo ✓ npm встановлено
npm --version

echo.

REM Перевірка package.json
if not exist "package.json" (
    echo ✗ package.json не знайдено
    echo.
    echo Ви знаходитесь в правильній директорії?
    cd
    pause
    exit /b 1
)

echo ✓ package.json знайдено
echo.

REM Меню вибору
echo Оберіть дію:
echo.
echo 1. 🚀 Швидке виправлення (рекомендовано)
echo 2. 🧹 Очистити кеш Vite
echo 3. 🔄 Повна переустановка залежностей
echo 4. 📦 Тільки скопіювати базу даних
echo 5. 🧪 Запустити з тестом
echo 6. 🆘 Екстрене відновлення (Git reset)
echo.
set /p choice="Введіть номер (1-6): "

if "%choice%"=="1" goto quick_fix
if "%choice%"=="2" goto clear_cache
if "%choice%"=="3" goto full_reinstall
if "%choice%"=="4" goto copy_db_only
if "%choice%"=="5" goto run_with_test
if "%choice%"=="6" goto emergency_reset
goto invalid_choice

:quick_fix
echo.
echo ℹ Швидке виправлення...
echo.

echo ℹ Встановлення залежностей...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Помилка встановлення залежностей
    pause
    exit /b 1
)
echo ✓ Залежності встановлено

echo ℹ Копіювання бази даних...
call npm run copy-db
echo ✓ База даних скопійована

echo ℹ Очищення кешу Vite...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✓ Кеш очищено
) else (
    echo ℹ Кеш вже очищено
)

echo.
echo ✓ Виправлення завершено!
echo.
echo ℹ Запускаю сервер...
call npm run dev
goto end

:clear_cache
echo.
echo ℹ Очищення кешу Vite...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✓ Кеш очищено
) else (
    echo ℹ Кеш вже очищено
)

echo ℹ Копіювання бази даних...
call npm run copy-db

echo.
echo ✓ Готово!
echo.
echo ℹ Запускаю сервер...
call npm run dev
goto end

:full_reinstall
echo.
echo ⚠ УВАГА: Видалення всіх залежностей...
set /p confirm="Продовжити? (y/n): "

if /i not "%confirm%"=="y" goto cancelled

echo ℹ Видалення node_modules...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo ✓ node_modules видалено
)

echo ℹ Видалення package-lock.json...
if exist "package-lock.json" (
    del /f "package-lock.json"
    echo ✓ package-lock.json видалено
)

echo ℹ Чиста встановлення...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Помилка встановлення
    pause
    exit /b 1
)
echo ✓ Залежності встановлено

echo ℹ Копіювання бази даних...
call npm run copy-db

echo.
echo ✓ Повна переустановка завершена!
echo.
echo ℹ Запускаю сервер...
call npm run dev
goto end

:copy_db_only
echo.
echo ℹ Копіювання бази даних...
call npm run copy-db

echo.
echo ✓ База даних скопійована!
echo.
echo ℹ Запускаю сервер...
call npm run dev
goto end

:run_with_test
echo.
echo ℹ Підготовка до запуску з тестом...

call npm install
call npm run copy-db
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

echo.
echo ✓ Запускаю сервер...
echo.
echo ℹ Після запуску:
echo   1. Натисніть F12
echo   2. Натисніть 'Debug'
echo   3. Натисніть '🧪 Test Database'
echo.

call npm run dev
goto end

:emergency_reset
echo.
echo 🚨 УВАГА: Екстрене відновлення
echo.
echo Це видалить:
echo   • Всі незбережені зміни в коді
echo   • Всі нові файли
echo   • Весь кеш та залежності
echo.
set /p confirm="ВИ ВПЕВНЕНІ? Це незворотно! (yes/no): "

if /i not "%confirm%"=="yes" goto cancelled_emergency

echo ℹ Git reset...
git reset --hard HEAD

echo ℹ Git clean...
git clean -fd

echo ℹ Видалення node_modules...
if exist "node_modules" rmdir /s /q "node_modules"

echo ℹ Видалення кешу...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

echo ℹ Встановлення залежностей...
call npm install

echo ℹ Копіювання бази даних...
call npm run copy-db

echo.
echo ✓ Екстрене відновлення завершено!
echo.
echo ⚠ Всі незбережені зміни втрачено!
echo.
echo ℹ Запускаю сервер...
call npm run dev
goto end

:cancelled_emergency
echo ℹ Скасовано (слава Богу!)
goto end

:cancelled
echo ℹ Скасовано
goto end

:invalid_choice
echo ✗ Невірний вибір
pause
exit /b 1

:end
pause
