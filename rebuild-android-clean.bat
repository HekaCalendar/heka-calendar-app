@echo off
echo ==========================================
echo HEKA Calendar - Android Clean Rebuild
echo ==========================================
echo.

echo [1/6] Killing Java processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Cleaning Android build...
cd android
rmdir /S /Q .gradle 2>nul
rmdir /S /Q app\build 2>nul
rmdir /S /Q build 2>nul
rmdir /S /Q app\src\main\assets\public 2>nul
cd ..

echo [3/6] Building web assets...
npm run build
if errorlevel 1 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)

echo [4/6] Syncing with Capacitor...
npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)

echo [5/6] Building Android APK (Debug)...
cd android
gradlew.bat clean
if errorlevel 1 (
    echo ERROR: Gradle clean failed!
    pause
    exit /b 1
)

echo [6/6] Building APK...
gradlew.bat assembleDebug
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

cd ..
echo.
echo ==========================================
echo BUILD SUCCESSFUL!
echo ==========================================
echo APK location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
