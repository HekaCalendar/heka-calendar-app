@echo off
cls
echo ============================================
echo  FIX ANDROID STUDIO + SYNC NEW BUILD
echo ============================================
echo.
pause
cls

:: Kill Android Studio
echo [1/6] Stopping Android Studio...
taskkill /F /IM studio64.exe 2>nul
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul
echo     Done.

:: Fix memory
echo [2/6] Fixing Android Studio memory (4GB)...
echo -Xms512m > "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -Xmx4096m >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:ReservedCodeCacheSize=1024m >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:+UseG1GC >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:+HeapDumpOnOutOfMemoryError >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo     Done.

:: Fix Gradle
echo [3/6] Fixing Gradle memory...
(
echo org.gradle.jvmargs=-Xmx4g
echo android.useAndroidX=true
echo org.gradle.daemon=false
) > android\gradle.properties
echo     Done.

:: Build web app
echo [4/6] Building v2.2.0 web app...
call npm run build 2>build_err.txt
if errorlevel 1 (
    echo     BUILD ERROR!
    type build_err.txt
    del build_err.txt
    pause
    exit /b 1
)
del build_err.txt 2>nul
echo     Web build v2.2.0 OK!

:: Copy WASM
echo [5/6] Copying astrology engine files...
if not exist "public\wsam" mkdir "public\wsam"
xcopy /Y "node_modules\swisseph-wasm\wsam\*" "public\wsam\" >nul 2>&1
echo     Done.

:: Sync to Android
echo [6/6] Syncing to Android project...
call npx cap sync android 2>sync_err.txt
if errorlevel 1 (
    echo     SYNC ERROR!
    type sync_err.txt
    del sync_err.txt
    pause
    exit /b 1
)
del sync_err.txt 2>nul
echo     Sync OK!

:: Verify
echo.
echo ============================================
echo  VERIFYING...
echo ============================================
type android\app\src\main\assets\public\index.html | findstr "v2.2.0" >nul
if errorlevel 1 (
    echo     WARNING: Still showing old version!
    echo     Check android\app\src\main\assets\public\index.html
) else (
    echo     SUCCESS! Android has v2.2.0
)

echo.
echo ============================================
echo  NOW START ANDROID STUDIO:
echo ============================================
echo   1. Double-click Android Studio
echo   2. Wait for it to load
echo   3. File -^> Open -^> Select this folder's "android" folder
echo   4. Click "Trust Project"
echo   5. Wait for Gradle sync (green progress bar)
echo   6. Build -^> Clean Project
echo   7. Build -^> Rebuild Project  
echo   8. Run -^> Run 'app'
echo.
echo If Android Studio asks about Gradle sync, click "Sync Now"
echo.
pause
start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe"
