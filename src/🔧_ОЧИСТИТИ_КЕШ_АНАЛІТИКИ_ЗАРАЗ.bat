@echo off
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║  ОЧИСТИТИ КЕШ АНАЛІТИКИ - 10 СЕКУНД             ║
echo ╚══════════════════════════════════════════════════╝
echo.
echo Виконайте ці кроки ЗАРАЗ:
echo.
echo 1. ВІДКРИЙТЕ Chrome/Edge/Firefox
echo    - Chrome: Ctrl+Shift+J (Windows) або Cmd+Option+J (Mac)
echo    - Edge: F12
echo    - Firefox: Ctrl+Shift+K
echo.
echo 2. ВКЛАДКА CONSOLE - виконайте цей код:
echo.
echo    localStorage.removeItem('caregiver_analytics_data');
echo    localStorage.removeItem('doctor_analytics_data');
echo    localStorage.removeItem('caregiver_analytics_cache');
echo    localStorage.removeItem('doctor_analytics_cache');
echo    console.log('✅ Analytics cache cleared!');
echo.
echo 3. ПЕРЕЗАВАНТАЖТЕ сторінку: Ctrl+Shift+R (hard refresh)
echo.
echo 4. УВІЙДІТЬ як Caregiver або Doctor
echo.
echo 5. ГРАФІКИ МАЮТЬ ПРАЦЮВАТИ!
echo.
pause
