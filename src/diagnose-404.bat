@echo off
echo.
echo ============================================
echo    Prescription Clarity - 404 Diagnostic
echo ============================================
echo.

REM Check if file exists
echo 1. Checking if database file exists...
if exist public\data\complete-database.json (
    echo    [OK] File exists: public\data\complete-database.json
    
    REM Get file size
    for %%A in (public\data\complete-database.json) do (
        set FILE_SIZE=%%~zA
    )
    echo    [OK] File size: %FILE_SIZE% bytes
    echo.
    
    REM Show first few lines
    echo 2. File preview (first 5 lines):
    powershell "Get-Content public\data\complete-database.json -Head 5"
    echo.
) else (
    echo    [ERROR] File NOT FOUND: public\data\complete-database.json
    echo.
    echo    This is the problem! File doesn't exist.
    echo.
    echo    Solutions:
    echo    1. Copy from \data\ folder:
    echo       copy data\complete-database.json public\data\
    echo.
    echo    2. Or create the directory:
    echo       mkdir public\data
    echo       copy data\complete-database.json public\data\
    echo.
    pause
    exit /b 1
)

REM Check if server is running
echo 3. Checking if dev server is running...
netstat -ano | findstr ":5173" > nul
if %ERRORLEVEL% EQU 0 (
    echo    [OK] Dev server IS running on port 5173
    echo.
    
    echo 4. Testing file accessibility via HTTP...
    powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173/data/complete-database.json' -UseBasicParsing; if ($response.StatusCode -eq 200) { Write-Host '   [OK] File is accessible at: http://localhost:5173/data/complete-database.json' -ForegroundColor Green; Write-Host ''; Write-Host '   SUCCESS! Everything looks good!' -ForegroundColor Green; Write-Host ''; Write-Host '   If you are still seeing 404 in the app:'; Write-Host '   1. Clear browser cache: localStorage.clear^(^); sessionStorage.clear^(^);'; Write-Host '   2. Hard refresh: Ctrl+Shift+R'; Write-Host '   3. Check Network tab in DevTools' } else { Write-Host '   [ERROR] File returns HTTP' $response.StatusCode 'not 200' -ForegroundColor Red } } catch { Write-Host '   [ERROR] Cannot access file via HTTP' -ForegroundColor Red; Write-Host ''; Write-Host '   Solution:'; Write-Host '   1. Stop server Ctrl+C'; Write-Host '   2. Run: rmdir /s /q node_modules\.vite dist'; Write-Host '   3. Run: npm run dev'; Write-Host '   4. Wait for ready message'; Write-Host '   5. Try again' }"
) else (
    echo    [ERROR] Dev server is NOT running on port 5173
    echo.
    echo    Solution:
    echo    Run: npm run dev
    echo.
    echo    Then run this diagnostic again.
    pause
    exit /b 1
)

echo.
echo 5. Browser test available at:
echo    http://localhost:5173/test-fetch.html
echo.
echo ============================================
echo Diagnostic complete!
echo.
pause
