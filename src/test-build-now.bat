@echo off
echo.
echo ====================================
echo    Build Test - Prescription Clarity
echo ====================================
echo.

REM Clean previous builds
echo 1. Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo    [OK] Done
echo.

REM Build
echo 2. Building for production...
echo.
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] BUILD SUCCESSFUL!
    echo.
    echo 3. Starting preview server...
    echo.
    echo    Preview will start at: http://localhost:4173
    echo    Test with 'Try Demo' button
    echo.
    echo    Press Ctrl+C to stop
    echo.
    call npm run preview
) else (
    echo.
    echo [ERROR] BUILD FAILED!
    echo.
    echo Please check the error messages above.
    exit /b 1
)
