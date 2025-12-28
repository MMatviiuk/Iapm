@echo off
REM Test Build Script for Windows
REM Tests if the JSON import fix works correctly

echo.
echo 🔧 Testing Build Fix for JSON Import Error
echo ==========================================
echo.

REM Step 1: Clean previous builds
echo 1️⃣  Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo ✓ Cleaned
echo.

REM Step 2: Copy database
echo 2️⃣  Copying database...
call npm run copy-db
if %errorlevel% neq 0 (
    echo ❌ Database copy failed!
    exit /b 1
)
echo.

REM Step 3: Check if JSON file is valid
echo 3️⃣  Validating JSON file...
node -e "JSON.parse(require('fs').readFileSync('data/complete-database.json', 'utf8'))"
if %errorlevel% neq 0 (
    echo ❌ JSON file is invalid!
    exit /b 1
)
echo ✓ JSON file is valid
echo.

REM Step 4: Build
echo 4️⃣  Building application...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ Build failed!
    echo.
    echo Please check:
    echo   - Node version
    echo   - npm version
    echo   - Error output above
    exit /b 1
)
echo.

REM Step 5: Success
echo ✅ Build successful!
echo.
echo Next steps:
echo   1. Test in preview mode: npm run preview
echo   2. Open http://localhost:4173 in browser
echo   3. Check browser console for errors
echo.

pause
