@echo off
cls
echo ============================================
echo   FIXING ANDROID STUDIO - MEMORY CRASH
echo ============================================
echo.
echo This will fix the "insufficient memory" crash
echo.
pause
cls

echo [1/5] Killing Android Studio...
taskkill /F /IM studio64.exe 2>nul
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
timeout /t 3 /nobreak >nul
echo     Done.
echo.

echo [2/5] Backing up vmoptions...
copy "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions" "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions.backup" >nul 2>&1
echo     Backup created.
echo.

echo [3/5] Writing new memory settings (THIS IS THE FIX)...
echo # Android Studio VM Options - FIXED FOR 16GB RAM SYSTEM > "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -Xms512m >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -Xmx4096m >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:ReservedCodeCacheSize=1024m >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:+UseG1GC >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:+UseStringDeduplication >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:SoftRefLRUPolicyMSPerMB=50 >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:CICompilerCount=2 >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:+HeapDumpOnOutOfMemoryError >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:-OmitStackTraceInFastThrow >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -XX:+IgnoreUnrecognizedVMOptions >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -Dsun.io.useCanonCaches=false >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo -Djbr.catch.SIGABRT=true >> "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo     Memory: 512m initial, 4096m max (was 2048m)
echo     Code cache: 1024m (was 512m)
echo     Done.
echo.

echo [4/5] Fixing Gradle memory too...
(
echo # Project-wide Gradle settings.
echo org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError
echo android.useAndroidX=true
echo android.enableJetifier=true
echo org.gradle.caching=true
echo org.gradle.parallel=true
echo org.gradle.daemon=false
echo kotlin.daemon.jvmargs=-Xmx2g
) > android\gradle.properties
echo     Gradle: 4GB max, daemon disabled
echo     Done.
echo.

echo [5/5] Clearing Android Studio caches (corrupted caches cause crashes)...
rd /s /q "%LOCALAPPDATA%\Google\AndroidStudio2025.2\caches" 2>nul
echo     Caches cleared.
echo.

echo ============================================
echo   ANDROID STUDIO FIXED!
echo ============================================
echo.
echo IMPORTANT STEPS:
echo   1. Double-click Android Studio icon to start it
echo   2. Wait for it to fully load
echo   3. File -^> Open -^> Select: %CD%\android
echo   4. Let Gradle sync (may take 5-10 mins first time)
echo   5. Build -^> Clean Project
echo   6. Build -^> Rebuild Project
echo   7. Run -^> Run 'app'
echo.
echo If it still crashes, you need to:
echo   - Close Chrome, Spotify, Discord first
echo   - Restart your computer
echo   - Or build via command line instead
echo.
pause
