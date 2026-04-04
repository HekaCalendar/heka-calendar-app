@echo off
echo ============================================
echo    HEKA ANDROID AUTO BUILD (Gradle CLI)
echo ============================================
echo.

:: Kill any existing processes
taskkill /F /IM studio64.exe 2>nul
timeout /t 2 /nobreak >nul

echo [1/5] Building web app...
call npm run build
if errorlevel 1 exit /b 1

echo [2/5] Copying WASM files...
if not exist "public\wsam" mkdir "public\wsam"
xcopy /Y "node_modules\swisseph-wasm\wsam\*" "public\wsam\" 2>nul

echo [3/5] Syncing Capacitor...
call npx cap sync android
if errorlevel 1 exit /b 1

echo [4/5] Building debug APK with Gradle...
cd android

:: Check if gradlew exists
if not exist "gradlew" (
    echo ERROR: gradlew not found! Did you run cap sync?
    exit /b 1
)

:: Make gradlew executable (in case)
attrib -r gradlew 2>nul

:: Build the APK
call .\gradlew assembleDebug --no-daemon --parallel --build-cache
if errorlevel 1 (
    echo ERROR: Build failed!
    cd ..
    exit /b 1
)

cd ..

echo [5/5] Build complete!
echo.
echo APK location: android\app\build\outputs\apk\debug\app-debug.apk
echo.

:: Check if device is connected
echo Checking for connected devices...
cd android
adb devices | findstr "device$" >nul
if %errorlevel% == 0 (
    echo Device found! Installing APK...
    adb install -r app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo App installed! Check your device.
) else (
    echo No device connected. To install manually:
    echo   1. Connect your phone with USB debugging enabled
    echo   2. Run: cd android ^&^& adb install -r app\build\outputs\apk\debug\app-debug.apk
)

cd ..
echo.
pause
