@echo off
REM IMMEDIATE DATABASE FIX
REM Run this script RIGHT NOW to fix the 404 error

echo.
echo 🚨 COPYING DATABASE - IMMEDIATE FIX
echo ====================================
echo.

REM Create directory
if not exist "public\data" mkdir "public\data"
echo ✓ Created public\data\ directory

REM Copy database
if exist "data\complete-database.json" (
  copy "data\complete-database.json" "public\data\complete-database.json" >nul
  echo ✓ Copied complete-database.json
  
  REM Check file exists
  if exist "public\data\complete-database.json" (
    echo ✓ File copied successfully
    echo.
    echo ✅ SUCCESS! Database copied successfully!
    echo.
    echo Now run: npm run dev
  ) else (
    echo ❌ ERROR: Copy failed
  )
) else (
  echo ❌ ERROR: Source file not found at data\complete-database.json
  echo.
  echo This is a critical error - the source database is missing!
)

echo.
pause
