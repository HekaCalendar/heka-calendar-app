@echo off
setlocal EnableDelayedExpansion
cls
echo ============================================
echo  HEKA ANDROID - COMPLETE BUILD SOLUTION
echo ============================================
echo.

:: Set up Java from Android Studio's bundled JRE
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

:: Verify Java works
echo [1] Setting up Java...
"%JAVA_HOME%\bin\java.exe" -version 2>&1 | findstr "version"
if errorlevel 1 (
    echo ERROR: Java setup failed!
    pause
    exit /b 1
)
echo     Java OK: %JAVA_HOME%
echo.

:: Kill any stuck processes
echo [2] Cleaning up processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
taskkill /F /IM studio64.exe 2>nul
timeout /t 2 /nobreak >nul

:: Fix Gradle memory (CRITICAL!)
echo [3] Fixing Gradle memory...
(
echo # Project-wide Gradle settings.
echo.
echo org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError
echo android.useAndroidX=true
echo android.enableJetifier=true
echo org.gradle.caching=true
echo org.gradle.parallel=true
echo org.gradle.configureondemand=true
echo org.gradle.daemon=false
echo kotlin.daemon.jvmargs=-Xmx2g
) > android\gradle.properties
echo     Memory: 4GB max, daemon disabled
echo.

:: Clean old builds
echo [4] Cleaning...
rd /s /q dist 2>nul
rd /s /q android\app\build 2>nul
rd /s /q android\.gradle 2>nul

:: Build web
echo [5] Building web app...
call npm run build
if errorlevel 1 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)
echo     Web build OK
echo.

:: Copy WASM
echo [6] Copying WASM files...
if not exist "public\wsam" mkdir "public\wsam"
xcopy /Y "node_modules\swisseph-wasm\wsam\*" "public\wsam\" >nul
echo     WASM OK
echo.

:: Capacitor sync
echo [7] Syncing to Android...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Sync failed!
    pause
    exit /b 1
)
echo     Sync OK
echo.

:: Build APK
echo [8] Building APK (this takes 5-10 mins first time)...
echo     Please wait... Do not close this window!
echo.
cd android

call .\gradlew assembleDebug --no-daemon 2>..\build.log
set RESULT=!errorlevel!

cd ..

if !RESULT! neq 0 (
    echo.
    echo ============================================
    echo BUILD FAILED! Last 30 lines of log:
    echo ============================================
    type build.log | find /v "" | more +1 | find /v "" 2>nul
    echo.
    echo Full log: build.log
    pause
    exit /b 1
)

del build.log 2>nul

:: Check APK
echo.
echo ============================================
echo BUILD SUCCESS!
echo ============================================
echo.
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    for %%I in ("android\app\build\outputs\apk\debug\app-debug.apk") do (
        echo APK: %%~fI
        echo Size: %%~zI bytes
        echo Date: %%~tI
    )
    
    echo.
    echo Installing to device...
    cd android
    adb install -r app\build\outputs\apk\debug\app-debug.apk 2>nul
    if !errorlevel! == 0 (
        echo SUCCESS! App installed.
    ) else (
        echo Could not auto-install. Manually:
        echo   cd android ^&^& adb install -r app\build\outputs\apk\debug\app-debug.apk
    )
    cd ..
) else (
    echo ERROR: APK not found!
)

echo.
pause
