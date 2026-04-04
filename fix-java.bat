@echo off
echo Setting JAVA_HOME...
setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr"
echo.
echo Adding Java to PATH...
setx PATH "%PATH%;%%JAVA_HOME%%\bin"
echo.
echo Done! Please close and reopen your terminal.
pause
