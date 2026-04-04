@echo off
echo ============================================
echo    HEKA ANDROID BUILD - NO STUDIO NEEDED
echo ============================================
echo.

:: Kill any existing Android Studio processes
taskkill /F /IM studio64.exe 2>nul
timeout /t 2 /nobreak >nul

echo [1/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    exit /b 1
)

echo [2/6] Building web app...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    exit /b 1
)

echo [3/6] Copying Swiss Ephemeris WASM files...
if not exist "public\wsam" (
    echo Creating wsam directory...
    mkdir "public\wsam"
)
xcopy /Y "node_modules\swisseph-wasm\wsam\*" "public\wsam\" 2>nul
echo WASM files copied

echo [4/6] Syncing to Android...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed!
    exit /b 1
)

echo [5/6] Opening Android project in file explorer...
start "" "android"

echo [6/6] Ready to build!
echo.
echo ============================================
echo NEXT STEPS (choose one):
echo ============================================
echo.
echo OPTION A - Command Line Build (NO STUDIO):
echo   cd android
echo   .\gradlew assembleDebug
echo   .\gradlew installDebug
echo.
echo OPTION B - Android Studio:
echo   Start Android Studio with 4GB memory now
echo   File -^> Open -^> Select "android" folder
echo   Wait for Gradle sync, then Build -^> Build Bundle/APK
echo.
echo ============================================
echo.
pause
