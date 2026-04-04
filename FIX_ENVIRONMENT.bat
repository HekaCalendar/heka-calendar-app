@echo off
echo ============================================
echo   QUICK ENVIRONMENT FIX
echo ============================================
echo.

:: Add Java to user PATH permanently
echo [1] Adding Java to PATH...
setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr" >nul 2>&1
setx PATH "%JAVA_HOME%\bin;%PATH%" >nul 2>&1
echo     JAVA_HOME set
echo.

:: Fix Android Studio memory
echo [2] Fixing Android Studio memory...
(
echo -Xms1024m
echo -Xmx4096m
echo -XX:ReservedCodeCacheSize=1024m
echo -XX:+UseG1GC
echo -XX:SoftRefLRUPolicyMSPerMB=50
) > "C:\Program Files\Android\Android Studio\bin\studio64.exe.vmoptions"
echo     Android Studio: 4GB
echo.

:: Fix Gradle memory (already done but confirm)
echo [3] Fixing Gradle memory...
(
echo org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m
echo android.useAndroidX=true
echo android.enableJetifier=true
echo org.gradle.daemon=false
) > android\gradle.properties
echo     Gradle: 4GB, daemon off
echo.

echo ============================================
echo DONE! Environment fixed.
echo ============================================
echo.
echo NEXT: Run BUILD_WITH_JAVA.bat to build
echo.
pause
