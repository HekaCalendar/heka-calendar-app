# HEKA Calendar Android Rebuild Script
# Run this to rebuild the Android APK after making changes

$ErrorActionPreference = "Stop"

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  HEKA Calendar Android Rebuild Script" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build web assets
Write-Host "📦 Step 1: Building web assets..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Web build complete!" -ForegroundColor Green
Write-Host ""

# Step 2: Sync with Capacitor
Write-Host "🔄 Step 2: Syncing with Capacitor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Sync failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Capacitor sync complete!" -ForegroundColor Green
Write-Host ""

# Step 3: Open Android Studio
Write-Host "📱 Step 3: Opening Android Studio..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   Next steps in Android Studio:" -ForegroundColor Cyan
Write-Host "   1. Wait for project to load (bottom bar shows progress)" -ForegroundColor White
Write-Host "   2. Click Build → Make Project  (or Ctrl+F9)" -ForegroundColor White
Write-Host "   3. Click Build → Build Bundle(s) / APK(s) → Build APK(s)" -ForegroundColor White
Write-Host ""

# Find Android Studio
$studioPaths = @(
    "${env:ProgramFiles}\Android\Android Studio\bin\studio64.exe",
    "${env:ProgramFiles(x86)}\Android\Android Studio\bin\studio.exe",
    "${env:LOCALAPPDATA}\Programs\Android Studio\bin\studio64.exe"
)

$studioPath = $null
foreach ($path in $studioPaths) {
    if (Test-Path $path) {
        $studioPath = $path
        break
    }
}

$androidProjectPath = Join-Path $PSScriptRoot "android"

if ($studioPath) {
    Write-Host "🚀 Launching Android Studio..." -ForegroundColor Green
    Start-Process $studioPath -ArgumentList $androidProjectPath
} else {
    Write-Host "⚠️  Android Studio not found in standard locations." -ForegroundColor Yellow
    Write-Host "   Please manually open: $androidProjectPath" -ForegroundColor Yellow
    
    # Try to open folder in Explorer
    Start-Process explorer.exe $androidProjectPath
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Done! Android Studio should now be opening." -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close this window"
