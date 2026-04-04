@echo off
echo ============================================
echo    FIXING ANDROID STUDIO MEMORY ISSUE
echo ============================================
echo.

set STUDIO_VMOPTIONS="C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"

echo [1/3] Backing up original vmoptions...
copy %STUDIO_VMOPTIONS% %STUDIO_VMOPTIONS%.backup >nul 2>&1

echo [2/3] Increasing memory limits...
(
echo -Xms1024m
echo -Xmx4096m
echo -XX:ReservedCodeCacheSize=1024m
echo -XX:+UseG1GC
echo -XX:+UseStringDeduplication
echo -XX:SoftRefLRUPolicyMSPerMB=50
echo -XX:CICompilerCount=2
echo -XX:+HeapDumpOnOutOfMemoryError
echo -XX:-OmitStackTraceInFastThrow
echo -XX:+IgnoreUnrecognizedVMOptions
) > %STUDIO_VMOPTIONS%

echo [3/3] Done!
echo.
echo New settings:
echo   - Initial memory: 1024m
echo   - Max memory: 4096m (was 2048m)
echo   - Code cache: 1024m (was 512m)
echo.
echo Please restart Android Studio
echo.
pause
