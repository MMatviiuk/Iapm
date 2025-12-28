@echo off
echo.
echo ============================================
echo    Prescription Clarity - Fresh Restart
echo ============================================
echo.

REM Stop any running processes
echo 1. Stopping any running dev servers...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
)
echo    [OK] Done
echo.

REM Clear Vite cache
echo 2. Clearing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist
echo    [OK] Done
echo.

REM Instructions for browser
echo 3. IMPORTANT: Clear your browser now!
echo.
echo    Open browser console (F12) and run:
echo    localStorage.clear(); sessionStorage.clear(); location.reload();
echo.
pause
echo.

REM Start fresh
echo 4. Starting fresh development server...
echo.
echo    Server will start at: http://localhost:5173
echo    Test page at: http://localhost:5173/test-database.html
echo.
echo    After server starts:
echo    1. Visit http://localhost:5173
echo    2. Click 'Try Demo'
echo    3. Dashboard should show: Total Medications: 6
echo.
echo    Press Ctrl+C to stop server
echo.
echo ============================================
echo.

npm run dev
