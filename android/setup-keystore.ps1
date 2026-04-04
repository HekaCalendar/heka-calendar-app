# HEKA Calendar Keystore Setup Script
# This script creates a signing keystore for Play Store release builds

param(
    [string]$keystoreFile = "heka-calendar.keystore",
    [string]$alias = "heka"
)

Write-Host "=== HEKA Calendar Keystore Setup ===" -ForegroundColor Green
Write-Host ""

# Check if keystore already exists
if (Test-Path $keystoreFile) {
    Write-Host "Keystore '$keystoreFile' already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit 0
    }
    Remove-Item $keystoreFile
}

# Get password from user (hidden input)
Write-Host "Create a strong password for your keystore." -ForegroundColor Cyan
Write-Host "IMPORTANT: Save this password - you cannot update the app without it!" -ForegroundColor Red
$password = Read-Host "Enter keystore password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

$confirmPassword = Read-Host "Confirm keystore password" -AsSecureString
$confirmPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($confirmPassword))

if ($passwordPlain -ne $confirmPlain) {
    Write-Host "Error: Passwords do not match!" -ForegroundColor Red
    exit 1
}

if ($passwordPlain.Length -lt 6) {
    Write-Host "Error: Password must be at least 6 characters!" -ForegroundColor Red
    exit 1
}

# Collect certificate info
Write-Host ""
Write-Host "--- Certificate Information --" -ForegroundColor Cyan
$commonName = Read-Host "Your name (First and Last)"
$orgUnit = Read-Host "Organizational unit (e.g., Development) [optional]"
$organization = Read-Host "Organization (e.g., HEKA Apps) [optional]"
$city = Read-Host "City [optional]"
$state = Read-Host "State/Province [optional]"
$country = Read-Host "Country code (2 letters, e.g., US) [optional]"

# Build distinguished name
$dname = "CN=$commonName"
if ($orgUnit) { $dname += ", OU=$orgUnit" }
if ($organization) { $dname += ", O=$organization" }
if ($city) { $dname += ", L=$city" }
if ($state) { $dname += ", ST=$state" }
if ($country) { $dname += ", C=$country" }

Write-Host ""
Write-Host "Generating keystore..." -ForegroundColor Cyan

# Generate keystore using keytool
$keytoolArgs = @(
    "-genkey",
    "-v",
    "-keystore", $keystoreFile,
    "-alias", $alias,
    "-keyalg", "RSA",
    "-keysize", "2048",
    "-validity", "10000",
    "-dname", $dname,
    "-storepass", $passwordPlain,
    "-keypass", $passwordPlain
)

try {
    & keytool $keytoolArgs
    if ($LASTEXITCODE -ne 0) {
        throw "keytool failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "Error creating keystore: $_" -ForegroundColor Red
    exit 1
}

# Create key.properties file
Write-Host ""
Write-Host "Creating key.properties file..." -ForegroundColor Cyan

@"
storeFile=$keystoreFile
storePassword=$passwordPlain
keyAlias=$alias
keyPassword=$passwordPlain
"@ | Out-File -FilePath "key.properties" -Encoding UTF8

# Set restrictive permissions on key.properties (equivalent to chmod 600)
$path = Resolve-Path "key.properties"
$acl = Get-Acl $path

# Remove all existing permissions
$acl.SetAccessRuleProtection($true, $false)

# Add only current user permissions
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    $currentUser, 
    "Read,Write", 
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl $path $acl

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Created files:" -ForegroundColor Cyan
Write-Host "  - $keystoreFile (signing keystore)" -ForegroundColor White
Write-Host "  - key.properties (keystore credentials)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Build release APK: .\gradlew assembleRelease" -ForegroundColor White
Write-Host "  2. Find APK at: app/build/outputs/apk/release/app-release.apk" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: Back up these files securely!" -ForegroundColor Red
Write-Host "   - $keystoreFile" -ForegroundColor Yellow
Write-Host "   - key.properties" -ForegroundColor Yellow
Write-Host "   Store them in a password manager or secure cloud storage." -ForegroundColor Yellow
Write-Host "   You CANNOT update your app on Play Store without these files!" -ForegroundColor Red

# Clear password from memory
$passwordPlain = $null
$confirmPlain = $null
[System.GC]::Collect()
