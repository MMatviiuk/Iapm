@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo  🆘 ДІАГНОСТИКА ПОМИЛКИ - PRESCRIPTION CLARITY
echo ═══════════════════════════════════════════════════════════
echo.
echo ⏳ Запускаю діагностику...
echo.

:: Перевірка Node.js
echo [1/5] Перевірка Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не встановлено
    echo    Завантажте з: https://nodejs.org
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo ✅ Node.js: %NODE_VERSION%
)
echo.

:: Перевірка npm
echo [2/5] Перевірка npm...
npm -v >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не встановлено
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo ✅ npm: %NPM_VERSION%
)
echo.

:: Перевірка залежностей
echo [3/5] Перевірка node_modules...
if exist "node_modules" (
    echo ✅ node_modules існує
) else (
    echo ❌ node_modules не існує
    echo ⏳ Встановлюю залежності...
    call npm install
    if errorlevel 1 (
        echo ❌ Помилка встановлення залежностей
        pause
        exit /b 1
    )
    echo ✅ Залежності встановлено
)
echo.

:: Перевірка важливих файлів
echo [4/5] Перевірка файлів...
set FILES_OK=1

if exist "App.tsx" (
    echo ✅ App.tsx
) else (
    echo ❌ App.tsx не знайдено
    set FILES_OK=0
)

if exist "main.tsx" (
    echo ✅ main.tsx
) else (
    echo ❌ main.tsx не знайдено
    set FILES_OK=0
)

if exist "index.html" (
    echo ✅ index.html
) else (
    echo ❌ index.html не знайдено
    set FILES_OK=0
)

if exist "package.json" (
    echo ✅ package.json
) else (
    echo ❌ package.json не знайдено
    set FILES_OK=0
)

if exist "vite.config.ts" (
    echo ✅ vite.config.ts
) else (
    echo ❌ vite.config.ts не знайдено
    set FILES_OK=0
)

if %FILES_OK%==0 (
    echo.
    echo ❌ Деякі файли відсутні
    pause
    exit /b 1
)
echo.

:: Копіювання бази даних
echo [5/5] Копіювання бази даних...
if exist "data\complete-database.json" (
    call npm run copy-db
    if errorlevel 1 (
        echo ⚠️  Помилка копіювання БД (продовжую)
    ) else (
        echo ✅ База даних скопійована
    )
) else (
    echo ⚠️  База даних не знайдена (продовжую)
)
echo.

echo ═══════════════════════════════════════════════════════════
echo  ✅ ДІАГНОСТИКА ЗАВЕРШЕНА
echo ═══════════════════════════════════════════════════════════
echo.
echo 🎯 НАСТУПНІ КРОКИ:
echo.
echo 1. Запустіть сервер:    npm run dev
echo 2. Відкрийте браузер:   http://localhost:5173
echo 3. Очистіть кеш:        Ctrl + Shift + R
echo 4. Відкрийте консоль:   F12 (Console)
echo.
echo 💡 Якщо побачите помилку - скопіюйте її текст та надішліть мені
echo.
pause
