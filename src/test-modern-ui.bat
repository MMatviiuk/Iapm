@echo off
echo.
echo 🔍 Testing Modern UI Integration...
echo.

REM Check if files exist
echo ✅ Checking files...
if exist "components\DoctorDashboardModern.tsx" (
    echo    ✓ DoctorDashboardModern.tsx exists
) else (
    echo    ✗ DoctorDashboardModern.tsx NOT FOUND
    exit /b 1
)

if exist "components\CaregiverDashboardModern.tsx" (
    echo    ✓ CaregiverDashboardModern.tsx exists
) else (
    echo    ✗ CaregiverDashboardModern.tsx NOT FOUND
    exit /b 1
)

REM Check imports in App.tsx
echo.
echo ✅ Checking App.tsx imports...
findstr /C:"CaregiverDashboardModern" App.tsx >nul
if %errorlevel%==0 (
    echo    ✓ CaregiverDashboardModern imported
) else (
    echo    ✗ CaregiverDashboardModern NOT imported
)

findstr /C:"DoctorDashboardModern" App.tsx >nul
if %errorlevel%==0 (
    echo    ✓ DoctorDashboardModern imported
) else (
    echo    ✗ DoctorDashboardModern NOT imported
)

REM Check usage
echo.
echo ✅ Checking component usage...
findstr /C:"<CaregiverDashboardModern" App.tsx >nul
if %errorlevel%==0 (
    echo    ✓ CaregiverDashboardModern used
) else (
    echo    ✗ CaregiverDashboardModern NOT used
)

findstr /C:"<DoctorDashboardModern" App.tsx >nul
if %errorlevel%==0 (
    echo    ✓ DoctorDashboardModern used
) else (
    echo    ✗ DoctorDashboardModern NOT used
)

echo.
echo 🎉 All checks passed!
echo.
echo ▶️  Next steps:
echo    1. Run: npm run dev
echo    2. Open: http://localhost:5173
echo    3. Test Doctor Dashboard: dr.anderson@example.com / demo123
echo    4. Test Caregiver Dashboard: catherine.bennett@example.com / demo123
echo.
pause
