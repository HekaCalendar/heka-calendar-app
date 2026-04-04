# Clean Android Rebuild Script for HEKA Calendar
# Run this after making changes to native Android code

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "HEKA Calendar - Clean Android Rebuild" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean web build
Write-Host "Step 1: Cleaning web build..." -ForegroundColor Yellow
if (Test-Path dist) {
    Remove-Item -Recurse -Force dist
    Write-Host "  ✓ dist folder removed" -ForegroundColor Green
}

# Step 2: Build web app
Write-Host ""
Write-Host "Step 2: Building web app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Web build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Web build successful" -ForegroundColor Green

# Step 3: Clean Android build
Write-Host ""
Write-Host "Step 3: Cleaning Android build..." -ForegroundColor Yellow
cd android

# Stop any running Gradle daemon
./gradlew --stop 2>$null

# Clean build artifacts
./gradlew clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠ Gradle clean had issues, continuing..." -ForegroundColor Yellow
}

# Remove build directories manually
$buildDirs = @(
    "app/build",
    ".gradle",
    "build"
)

foreach ($dir in $buildDirs) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force $dir
        Write-Host "  ✓ Removed $dir" -ForegroundColor Green
    }
}

# Step 4: Sync Capacitor
Write-Host ""
Write-Host "Step 4: Syncing Capacitor..." -ForegroundColor Yellow
cd ..
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Capacitor sync failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Capacitor sync successful" -ForegroundColor Green

# Step 5: Build Android debug APK
Write-Host ""
Write-Host "Step 5: Building Android debug APK..." -ForegroundColor Yellow
cd android
./gradlew assembleDebug
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Android build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Android build successful" -ForegroundColor Green

# Step 6: Verify APK exists
$apkPath = "app/build/outputs/apk/debug/app-debug.apk"
if (Test-Path $apkPath) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "BUILD SUCCESSFUL!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "APK location: android/$apkPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Open Android Studio: npm run android:open" -ForegroundColor White
    Write-Host "2. Or install directly on device:" -ForegroundColor White
    Write-Host "   adb install android/$apkPath" -ForegroundColor White
} else {
    Write-Host "  ✗ APK not found at expected location" -ForegroundColor Red
}

cd ..
Write-Host ""
Write-Host "Done!" -ForegroundColor Green
