@echo off
REM Quick Database Copy Script for Windows
REM Run this if you see HTTP 404 errors

echo.
echo 📋 Copying database to public folder...
echo.

REM Create directory
if not exist "public\data" mkdir "public\data"

REM Copy file
copy "data\complete-database.json" "public\data\complete-database.json" >nul

REM Check result
if exist "public\data\complete-database.json" (
  echo ✅ SUCCESS! Database copied to public\data\
  echo.
  echo Now run: npm run dev
) else (
  echo ❌ ERROR! Database copy failed
  echo.
  echo Try running: npm run copy-db
)

echo.
pause
