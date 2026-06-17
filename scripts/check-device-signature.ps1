# Check installed app signature via ADB
# Run this after connecting your test device

Write-Host "========================================="
Write-Host "Check installed app signing certificate"
Write-Host "========================================="
Write-Host ""

$packageName = "com.heka.calendar"

# Check if app is installed
$installed = adb shell pm list packages $packageName 2>$null
if (-not $installed) {
    Write-Host "App is NOT installed on the device!" -ForegroundColor Red
    exit 1
}

Write-Host "App is installed."
Write-Host ""

# Get the APK path
$apkPath = adb shell pm path $packageName 2>$null
Write-Host "APK path: $apkPath"
Write-Host ""

# Pull the APK and check its certificate
$tempApk = "temp_installed.apk"
adb pull $apkPath.replace("package:","") $tempApk 2>$null | Out-Null

if (Test-Path $tempApk) {
    Write-Host "Extracted APK certificate SHA-1:"
    keytool -printcert -jarfile $tempApk 2>$null | findstr "SHA1"
    Remove-Item $tempApk -Force
} else {
    Write-Host "Could not pull APK (might need root). Trying alternative..."
    
    # Alternative: dump signatures via dumpsys
    $signatures = adb shell dumpsys package $packageName 2>$null | Select-String -Pattern "signatures|cert"
    Write-Host $signatures
}

Write-Host ""
Write-Host "Expected SHA-1s in Firebase:"
Write-Host "  7f:c3:60:5d:6b:e2:39:40:0a:0d:d3:67:93:f8:30:ec:7a:67:58:9a  (local release keystore)"
Write-Host "  9f:ac:92:fe:13:8e:1d:f4:84:d6:2d:aa:8f:fa:65:8a:83:c5:fb:e4  (debug keystore)"
Write-Host "  b8:bb:1b:68:a6:cc:6e:e1:63:13:ad:9a:61:e1:c5:73:0c:98:f7:ea  (Google Play signing)"
