@echo off
cls
echo ============================================
echo     HEKA ANDROID - DIAGNOSTIC TOOL
echo ============================================
echo.

:: Check Java
echo [1] Checking Java...
java -version 2>&1 | findstr "version" 
if errorlevel 1 (
    echo     ERROR: Java not found in PATH!
) else (
    java -version 2>&1 | findstr "version"
)
echo.

:: Check Node
echo [2] Checking Node.js...
node --version 2>nul
if errorlevel 1 echo     ERROR: Node.js not found!
echo.

:: Check Android SDK
echo [3] Checking Android SDK...
if defined ANDROID_SDK_ROOT (
    echo     SDK: %ANDROID_SDK_ROOT%
) else (
    echo     WARNING: ANDROID_SDK_ROOT not set
)
echo.

:: Check Gradle
echo [4] Checking Gradle wrapper...
if exist "android\gradlew" (
    echo     Found: android\gradlew
    cd android
    .\gradlew --version 2>nul | findstr "Gradle"
    cd ..
) else (
    echo     ERROR: gradlew not found!
)
echo.

:: Check memory settings
echo [5] Checking memory settings...
echo     Android Studio vmoptions:
type "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions" 2>nul | findstr "^\-Xmx"
echo.
echo     Gradle properties:
type android\gradle.properties 2>nul | findstr "jvmargs"
echo.

:: Check disk space
echo [6] Checking disk space...
for /f "tokens=3" %%a in ('dir C:\ ^| findstr "bytes free"') do (
    echo     Free space: %%a bytes
)
echo.

:: Check project structure
echo [7] Checking project structure...
echo     dist folder: 
if exist "dist" (
    echo         EXISTS (good)
    dir dist\index.html 2>nul | findstr "index.html"
) else (
    echo         NOT FOUND (run build first)
)
echo.
echo     android folder:
if exist "android" (
    echo         EXISTS (good)
    dir android\app\src\main\assets\public\index.html 2>nul | findstr "index.html"
) else (
    echo         NOT FOUND (run cap add android)
)
echo.

:: Check if APK exists
echo [8] Checking for existing APK...
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo     FOUND: android\app\build\outputs\apk\debug\app-debug.apk
    for %%I in ("android\app\build\outputs\apk\debug\app-debug.apk") do (
        echo     Size: %%~zI bytes
        echo     Date: %%~tI
    )
) else (
    echo     No APK found (needs build)
)
echo.

echo ============================================
echo              RECOMMENDATIONS
echo ============================================
echo.
echo If Android Studio crashes:
echo   Run: FULL_RESET_AND_BUILD.bat
echo   (This builds without Android Studio)
echo.
echo If build fails with memory errors:
echo   1. Close Chrome, Spotify, etc.
echo   2. Run FULL_RESET_AND_BUILD.bat again
echo.
echo If APK installs but shows old version:
echo   1. Uninstall app from phone
echo   2. Delete android\app\build folder
echo   3. Rebuild
echo.

pause
