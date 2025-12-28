@echo off
echo.
echo ========================================
echo  RESTART DEV SERVER + CLEAR CACHE
echo ========================================
echo.

REM Kill any existing dev servers
echo Stopping existing dev servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

REM Clear Vite cache
echo Clearing Vite cache...
if exist node_modules\.vite rmdir /S /Q node_modules\.vite
if exist dist rmdir /S /Q dist
if exist .parcel-cache rmdir /S /Q .parcel-cache

echo.
echo Cache cleared successfully!
echo.
echo ========================================
echo  IMPORTANT: CLEAR BROWSER CACHE NOW!
echo ========================================
echo.
echo Desktop:
echo  - Chrome/Edge: Ctrl + Shift + Delete
echo  - Select "Cached images and files"
echo  - Click "Clear data"
echo  - HARD REFRESH: Ctrl + Shift + R
echo.
echo Mobile:
echo  - USE INCOGNITO MODE!
echo  - Android: Three dots -^> New incognito tab
echo  - iOS Safari: Tabs -^> Private
echo.
echo ========================================
echo.

REM Start dev server
echo Starting dev server...
start cmd /k npm run dev

echo.
echo ========================================
echo  Dev server starting in new window...
echo  Wait for "Local: http://localhost:5173"
echo.
echo  THEN:
echo  1. CLEAR BROWSER CACHE (Ctrl+Shift+Delete)
echo  2. HARD REFRESH (Ctrl+Shift+R)
echo  3. Or use INCOGNITO mode (Ctrl+Shift+N)
echo ========================================
echo.
pause
