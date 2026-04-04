@echo off
REM Setup Release Signing for HEKA Calendar
REM Run this script to generate the release keystore

echo ============================================================
echo HEKA Calendar - Release Signing Setup
echo ============================================================
echo.
echo This will create a release keystore for Play Store submission.
echo IMPORTANT: Keep the keystore and passwords safe! You cannot
echo update the app on Play Store without them.
echo.

set KEYSTORE_DIR=%USERPROFILE%\.android
set KEYSTORE_FILE=%KEYSTORE_DIR%\heka-release.keystore
set KEY_ALIAS=heka-calendar

if not exist "%KEYSTORE_DIR%" mkdir "%KEYSTORE_DIR%"

echo Keystore will be created at: %KEYSTORE_FILE%
echo.

REM Check if keytool is available
where keytool >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: keytool not found. Make sure Java JDK is installed.
    echo.
    pause
    exit /b 1
)

if exist "%KEYSTORE_FILE%" (
    echo WARNING: Keystore already exists at:
    echo   %KEYSTORE_FILE%
    echo.
    choice /C YN /M "Do you want to create a new one (old one will be kept as backup)"
    if %ERRORLEVEL% EQU 2 (
        echo Cancelled.
        pause
        exit /b 0
    )
    move "%KEYSTORE_FILE%" "%KEYSTORE_FILE%.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%"
)

echo.
echo =================================================================
echo You will be prompted to enter passwords and certificate details.
echo REMEMBER THESE PASSWORDS - you need them for every release!
echo =================================================================
echo.

keytool -genkey -v ^
  -keystore "%KEYSTORE_FILE%" ^
  -alias %KEY_ALIAS% ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -storetype PKCS12

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to create keystore.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo Keystore created successfully!
echo Location: %KEYSTORE_FILE%
echo ============================================================
echo.
echo NEXT STEPS:
echo 1. Copy android\\app\\key.properties.template to android\\app\\key.properties
echo 2. Edit key.properties and fill in your passwords
echo 3. Build release APK: npm run android:build
echo.
echo IMPORTANT: Backup your keystore file and passwords!
echo Without them, you cannot update the app on Play Store.
echo.
pause
