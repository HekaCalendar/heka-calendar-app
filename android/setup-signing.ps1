# HEKA Calendar - Android Signing Setup
# Run this script to create the keystore for Play Store release

$keystoreFile = "heka-calendar.keystore"
$keyAlias = "heka"

Write-Host "=== HEKA Calendar Signing Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if keystore already exists
if (Test-Path $keystoreFile) {
    Write-Host "Keystore already exists: $keystoreFile" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne 'y') {
        Write-Host "Setup cancelled. Existing keystore will be used." -ForegroundColor Green
        exit 0
    }
}

Write-Host "This will create a keystore for signing your Android app." -ForegroundColor White
Write-Host "IMPORTANT: Save the password somewhere safe! You cannot update the app without it!" -ForegroundColor Red
Write-Host ""

# Get password from user
$storePassword = Read-Host "Enter keystore password (min 6 characters)" -AsSecureString
$storePasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($storePassword))

if ($storePasswordPlain.Length -lt 6) {
    Write-Host "Error: Password must be at least 6 characters" -ForegroundColor Red
    exit 1
}

$keyPassword = Read-Host "Enter key password (press Enter to use same as keystore)" -AsSecureString
$keyPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPassword))

if ([string]::IsNullOrWhiteSpace($keyPasswordPlain)) {
    $keyPasswordPlain = $storePasswordPlain
}

Write-Host ""
Write-Host "Creating keystore..." -ForegroundColor Yellow

# Create keystore using keytool
$args = @(
    "-genkey",
    "-v",
    "-keystore", $keystoreFile,
    "-alias", $keyAlias,
    "-keyalg", "RSA",
    "-keysize", "2048",
    "-validity", "10000",
    "-storepass", $storePasswordPlain,
    "-keypass", $keyPasswordPlain,
    "-dname", "CN=HEKA Calendar, OU=App, O=HEKA, L=Unknown, ST=Unknown, C=US"
)

& keytool $args

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Keystore created successfully: $keystoreFile" -ForegroundColor Green
    
    # Create key.properties file
    $keyPropsContent = @"
storePassword=$storePasswordPlain
keyPassword=$keyPasswordPlain
keyAlias=$keyAlias
storeFile=$keystoreFile
"@
    
    $keyPropsContent | Out-File -FilePath "key.properties" -Encoding ASCII
    Write-Host "✅ Created key.properties" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "=== IMPORTANT ===" -ForegroundColor Red -BackgroundColor Black
    Write-Host "1. BACK UP these files to a safe location:" -ForegroundColor Yellow
    Write-Host "   - $keystoreFile" -ForegroundColor White
    Write-Host "   - key.properties" -ForegroundColor White
    Write-Host ""
    Write-Host "2. NEVER commit these files to git!" -ForegroundColor Yellow
    Write-Host "   They are already in .gitignore" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. If you lose the keystore, you CANNOT update the app on Play Store!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  cd android" -ForegroundColor White
    Write-Host "  .\gradlew assembleRelease" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Failed to create keystore" -ForegroundColor Red
    exit 1
}
