# verify-firebase-auth.ps1
# Validates that the Android signing certificate SHA-1 is registered in
# google-services.json (and by extension, Firebase Console).
# Run from the project root.

$ErrorActionPreference = "Stop"
$keystorePath = "android/heka-calendar.keystore"
$keystoreAlias = "heka"
$keystorePass = $env:HEKA_KEYSTORE_PASSWORD
if (-not $keystorePass) {
    Write-Host "ERROR: HEKA_KEYSTORE_PASSWORD environment variable is not set" -ForegroundColor Red
    exit 1
}
$jsonPath = "android/app/google-services.json"

Write-Host "========================================="
Write-Host "Firebase Auth SHA-1 Verification"
Write-Host "========================================="
Write-Host ""

# 1. Extract SHA-1 from keystore
if (-not (Test-Path $keystorePath)) {
    Write-Host "ERROR: Keystore not found at $keystorePath" -ForegroundColor Red
    exit 1
}

$keystoreOutput = keytool -list -v -keystore $keystorePath -alias $keystoreAlias -storepass $keystorePass 2>$null
$sha1Line = $keystoreOutput | Select-String "SHA1:"
if (-not $sha1Line) {
    Write-Host "ERROR: Could not extract SHA-1 from keystore" -ForegroundColor Red
    exit 1
}

$keystoreSha1 = ($sha1Line -replace "SHA1:\s*", "").Trim().ToLower()
Write-Host "Local keystore SHA-1:"
Write-Host "  $keystoreSha1" -ForegroundColor Cyan
Write-Host ""

# 2. Check google-services.json
if (-not (Test-Path $jsonPath)) {
    Write-Host "ERROR: google-services.json not found at $jsonPath" -ForegroundColor Red
    exit 1
}

$json = Get-Content $jsonPath -Raw | ConvertFrom-Json
$packageName = $json.client[0].client_info.android_client_info.package_name
Write-Host "Package name: $packageName"
Write-Host ""

Write-Host "Registered certificate hashes in google-services.json:"
$foundMatch = $false
$androidClients = $json.client[0].oauth_client | Where-Object { $_.client_type -eq 1 }
foreach ($client in $androidClients) {
    $hash = $client.certificate_hash
    if ($hash) {
        $hashLower = $hash.ToLower()
        $match = if ($hashLower -eq $keystoreSha1) { " <-- MATCHES KEYSTORE" } else { "" }
        if ($match) { $foundMatch = $true }
        Write-Host "  $hashLower$match" -ForegroundColor $(if ($match) { "Green" } else { "White" })
    } else {
        Write-Host "  (no certificate hash - SHA-1 not registered for this client)" -ForegroundColor Yellow
    }
}

Write-Host ""
if ($foundMatch) {
    Write-Host "[OK] Keystore SHA-1 is registered in google-services.json" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Keystore SHA-1 is NOT registered in google-services.json" -ForegroundColor Red
    Write-Host ""
    Write-Host "ACTION REQUIRED:"
    Write-Host "  1. Go to https://console.firebase.google.com/"
    Write-Host "  2. Project Settings → Your Apps → com.heka.calendar (Android)"
    Write-Host "  3. Click 'Add fingerprint'"
    Write-Host "  4. Paste: $keystoreSha1"
    Write-Host "  5. Re-download google-services.json and replace android/app/google-services.json"
    Write-Host "  6. If distributing via Google Play, also add the Google Play App Signing SHA-1"
    Write-Host "     (found in Play Console → Release → Setup → App integrity)"
    Write-Host ""
    exit 1
}

# 3. Check default_web_client_id (needed for skipNativeAuth: true)
$webClients = $json.client[0].oauth_client | Where-Object { $_.client_type -eq 3 }
if ($webClients) {
    Write-Host "[OK] Web client ID found (required for skipNativeAuth: true)" -ForegroundColor Green
} else {
    Write-Host "[WARN] No web client ID found. This may cause issues with skipNativeAuth." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================="
Write-Host "Verification complete"
Write-Host "========================================="
