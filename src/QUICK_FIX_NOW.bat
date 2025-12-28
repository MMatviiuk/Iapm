@echo off
echo.
echo 🚀 Prescription Clarity - Quick Fix Script
echo ==========================================
echo.

REM Check if source file exists
if not exist "data\complete-database.json" (
    echo ❌ ERROR: Source file not found: data\complete-database.json
    exit /b 1
)

REM Create target directory
echo 📁 Creating public\data directory...
if not exist "public\data" mkdir "public\data"

REM Copy database file
echo 📋 Copying database file...
copy /Y "data\complete-database.json" "public\data\" >nul

REM Verify copy
if exist "public\data\complete-database.json" (
    echo ✅ SUCCESS! Database copied successfully
    for %%A in ("public\data\complete-database.json") do echo    File size: %%~zA bytes
    echo.
    echo 🎉 Ready to start!
    echo.
    echo Run: npm run dev
    echo.
) else (
    echo ❌ ERROR: Copy failed
    exit /b 1
)
