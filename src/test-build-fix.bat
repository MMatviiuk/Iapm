@echo off
echo ========================================
echo Testing Build Fix - November 5, 2025
echo ========================================
echo.

echo [1/3] Cleaning old build artifacts...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo Done!
echo.

echo [2/3] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo Check the error messages above.
    pause
    exit /b 1
)
echo.

echo [3/3] Build successful!
echo ========================================
echo SUCCESS! Build completed without errors.
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run preview
echo 2. Open: http://localhost:4173
echo 3. Check browser console for "Database loaded successfully"
echo.
pause
