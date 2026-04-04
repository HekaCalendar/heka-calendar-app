@echo off
chcp 65001 >nul
echo ============================================
echo    HEKA CALENDAR - NUCLEAR CLEAN BUILD
echo    v2.2.0 - DESTROY ALL CACHES
echo ============================================
echo.

:: 1. Kill Android Studio and Gradle
echo [1/6] Killing Android processes...
taskkill /F /IM studio64.exe 2>nul
taskkill /F /IM java.exe 2>nul
taskkill /F /IM gradle.exe 2>nul
timeout /t 2 /nobreak >nul

:: 2. Clean npm and vite
echo [2/6] Cleaning node and build caches...
call npm cache clean --force 2>nul
rmdir /s /q node_modules\.vite 2>nul
rmdir /s /q node_modules\.cache 2>nul

:: 3. Clean dist
echo [3/6] Cleaning dist folder...
rmdir /s /q dist 2>nul

:: 4. Full npm install
echo [4/6] Fresh npm install...
call npm install

:: 5. Build
echo [5/6] Building v2.2.0...
call npm run build

:: 6. Clean Android and sync
echo [6/6] Cleaning Android...
cd android
rmdir /s /q .gradle 2>nul
rmdir /s /q app\build 2>nul
rmdir /s /q app\src\main\assets\public 2>nul
call gradlew clean 2>nul
cd ..

echo.
echo ============================================
echo    BUILD COMPLETE - v2.2.0 READY
echo ============================================
echo.
echo NEXT STEPS:
echo 1. Run: npx cap sync android
echo 2. Open Android Studio
echo 3. Build APK
echo 4. On device: Settings ^> Apps ^> HEKA ^> Storage ^> Clear Data
echo 5. Install new APK
echo.
pause
