@echo off
echo ==========================================
echo Fixing Android Studio Stuck State
echo ==========================================
echo.

echo [1/5] Killing Java/Gradle processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
taskkill /F /IM gradle.exe 2>nul
timeout /t 3 /nobreak >nul

echo [2/5] Stopping Gradle daemon...
cd android
gradlew.bat --stop 2>nul
cd ..
timeout /t 2 /nobreak >nul

echo [3/5] Cleaning build cache...
cd android
rmdir /S /Q .gradle 2>nul
rmdir /S /Q build 2>nul
rmdir /S /Q app\build 2>nul
cd ..

echo [4/5] Rebuilding web assets...
npm run build
if errorlevel 1 goto error

echo [5/5] Syncing Capacitor...
npx cap sync android
if errorlevel 1 goto error

echo.
echo ==========================================
echo DONE! Now in Android Studio:
echo ==========================================
echo 1. File ^> Invalidate Caches ^> Invalidate and Restart
echo 2. After restart, click the GREEN PLAY BUTTON (not debug)
echo.
echo OR run: cd android ^&^& gradlew.bat assembleDebug
echo.
pause
exit /b 0

:error
echo ERROR: Build failed!
pause
exit /b 1
