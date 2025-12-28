@echo off
REM Clear Cache and Restart - Prescription Clarity
REM Fixes database 404 and missing patientData errors

echo.
echo ====================================================
echo    Prescription Clarity - Cache Clear and Restart
echo ====================================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Step 1: Stopping any running dev servers...
REM Try to stop any process using port 5173
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
)
echo [OK] Stopped
echo.

echo Step 2: Instructions to clear browser cache:
echo.
echo    Please open your browser and:
echo    1. Press F12 to open DevTools
echo    2. Go to Console tab
echo    3. Run this command:
echo.
echo       localStorage.clear(); sessionStorage.clear(); location.reload();
echo.
echo    OR simply press Ctrl+Shift+Delete and clear:
echo    - Cached images and files
echo    - Cookies and site data
echo.
pause
echo.

echo Step 3: Starting development server...
echo [OK] Server starting on http://localhost:5173
echo.
echo Next steps:
echo    1. Visit http://localhost:5173/test-database.html to test
echo    2. Then visit http://localhost:5173 and click 'Try Demo'
echo    3. Dashboard should show 6 medications
echo.
echo    Press Ctrl+C to stop the server
echo.
echo ====================================================
echo.

REM Start the dev server
npm run dev
