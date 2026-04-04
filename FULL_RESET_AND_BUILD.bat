@echo off
setlocal EnableDelayedExpansion
cls
echo ============================================
echo  HEKA ANDROID - COMPLETE RESET ^& BUILD
echo ============================================
echo.

:: STEP 1: Kill all Java/Android processes
echo [1/10] Stopping all Java processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
taskkill /F /IM studio64.exe 2>nul
taskkill /F /IM qemu-system-x86_64.exe 2>nul
timeout /t 3 /nobreak >nul

:: STEP 2: Fix Gradle memory (this is the KEY fix)
echo [2/10] Fixing Gradle memory settings...
(
echo # Project-wide Gradle settings.
echo.
echo # IDE users: Settings configured through IDE will override these
echo.
echo # JVM arguments for the daemon process - INCREASED for builds
echo org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
echo.
echo # AndroidX
echo android.useAndroidX=true
echo android.enableJetifier=true
echo.
echo # Performance optimizations
echo org.gradle.caching=true
echo org.gradle.parallel=true
echo org.gradle.configureondemand=true
echo org.gradle.daemon=false
echo.
echo # Less memory for Kotlin daemon
echo kotlin.daemon.jvmargs=-Xmx2g
) > android\gradle.properties
echo      ^> Gradle memory: 2GB -^> 4GB
echo      ^> Daemon disabled (fresh start each build)

:: STEP 3: Clean everything
echo [3/10] Cleaning old builds...
if exist "dist" rd /s /q dist 2>nul
if exist "android\app\build" rd /s /q android\app\build 2>nul
if exist "android\.gradle" rd /s /q android\.gradle 2>nul

:: STEP 4: Verify Node
echo [4/10] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found! Install from nodejs.org
    pause
    exit /b 1
)
echo      ^> Node.js OK

:: STEP 5: Build web app
echo [5/10] Building web app (this may take a minute)...
call npm run build 2>build_error.log
if errorlevel 1 (
    echo ERROR: Web build failed!
    type build_error.log
    del build_error.log
    pause
    exit /b 1
)
del build_error.log 2>nul
echo      ^> Web build OK

:: STEP 6: Copy WASM files
echo [6/10] Copying Swiss Ephemeris files...
if not exist "public\wsam" mkdir "public\wsam"
xcopy /Y "node_modules\swisseph-wasm\wsam\*" "public\wsam\" >nul 2>&1
echo      ^> WASM files copied

:: STEP 7: Capacitor sync
echo [7/10] Syncing with Capacitor...
call npx cap sync android 2>sync_error.log
if errorlevel 1 (
    echo ERROR: Capacitor sync failed!
    type sync_error.log
    del sync_error.log
    pause
    exit /b 1
)
del sync_error.log 2>nul
echo      ^> Sync OK

:: STEP 8: Check for gradlew
echo [8/10] Checking Gradle wrapper...
if not exist "android\gradlew" (
    echo ERROR: gradlew not found!
    echo Run: npx cap add android
    pause
    exit /b 1
)
echo      ^> Gradle wrapper OK

:: STEP 9: Build APK (THE BIG ONE)
echo [9/10] Building Android APK...
echo      This will take 3-10 minutes on first run...
echo      (Gradle will download dependencies)
echo.
cd android

:: Run gradle build with error capture
call .\gradlew assembleDebug --no-daemon --offline 2>..\gradle_error.log
set BUILD_RESULT=!errorlevel!
cd ..

if !BUILD_RESULT! neq 0 (
    echo.
    echo ============================================
    echo  BUILD FAILED - Showing last errors:
    echo ============================================
    tail -20 gradle_error.log 2>nul || type gradle_error.log
    del gradle_error.log 2>nul
    echo.
    echo Common fixes:
    echo  1. Check internet connection (for first build)
    echo  2. Clear: rd /s /q %%USERPROFILE%%\.gradle\caches
    echo  3. Retry this script
    pause
    exit /b 1
)

del gradle_error.log 2>nul
echo      ^> APK built successfully!

:: STEP 10: Verify APK
echo [10/10] Verifying APK...
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo      ^> APK found!
    for %%I in ("android\app\build\outputs\apk\debug\app-debug.apk") do (
        echo      ^> Size: %%~zI bytes
    )
) else (
    echo WARNING: APK not in expected location
    dir /s android\app\build\outputs\*.apk 2>nul
)

:: DONE
echo.
echo ============================================
echo  BUILD COMPLETE!
echo ============================================
echo.
echo APK Location:
echo   android\app\build\outputs\apk\debug\app-debug.apk
echo.

:: Check for device
echo Checking for connected Android device...
cd android
adb devices | findstr "device$" >nul
if !errorlevel! == 0 (
    echo Device found! Installing now...
    adb install -r app\build\outputs\apk\debug\app-debug.apk
    if !errorlevel! == 0 (
        echo.
        echo SUCCESS! App installed on your device.
        echo Look for "HEKA Calendar" in your app drawer.
    ) else (
        echo Install failed. Try manually or check device.
    )
) else (
    echo.
    echo No device connected. To install manually:
    echo   1. Enable USB debugging on your phone
echo   2. Connect via USB
echo   3. Run: cd android ^& adb install -r app\build\outputs\apk\debug\app-debug.apk
echo.
    echo Or copy the APK to your phone and install it.
)
cd ..

echo.
pause
