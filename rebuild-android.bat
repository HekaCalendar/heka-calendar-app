@echo off
echo ================================================
echo   HEKA Calendar Android Rebuild
echo ================================================
echo.

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0rebuild-android.ps1"

pause
