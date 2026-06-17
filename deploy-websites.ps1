#!/usr/bin/env pwsh
# Deploy all three Hekaverse websites to Cloudflare Pages
# Run once: wrangler login
# Then run this script anytime: .\deploy-websites.ps1

$ErrorActionPreference = "Stop"

# === CONFIG ===
# Replace these with your actual Cloudflare Pages project names
$projects = @{
    "website"    = "hekacalendar"   # hekacalendar.com
    "heka-time"  = "hekatime"      # hekatime.com
    "hekaverse"  = "hekaverse"     # hekaverse.com
}
# ==============

Write-Host "🚀 Deploying Hekaverse websites to Cloudflare Pages..." -ForegroundColor Cyan
Write-Host ""

$success = @()
$failed = @()

foreach ($folder in $projects.Keys) {
    $name = $projects[$folder]
    $path = Join-Path $PSScriptRoot $folder
    
    if (-not (Test-Path $path)) {
        Write-Host "❌ Folder not found: $path" -ForegroundColor Red
        $failed += $name
        continue
    }
    
    Write-Host "📤 Deploying $name from ./$folder ..." -ForegroundColor Yellow -NoNewline
    
    try {
        $output = wrangler pages deploy $path --project-name=$name --branch=main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✅ Done" -ForegroundColor Green
            $success += $name
        } else {
            Write-Host " ❌ Failed" -ForegroundColor Red
            Write-Host $output -ForegroundColor DarkGray
            $failed += $name
        }
    } catch {
        Write-Host " ❌ Error" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor DarkGray
        $failed += $name
    }
}

Write-Host ""
Write-Host "=== DEPLOY SUMMARY ===" -ForegroundColor Cyan

if ($success.Count -gt 0) {
    Write-Host "✅ Success: $($success -join ', ')" -ForegroundColor Green
}
if ($failed.Count -gt 0) {
    Write-Host "❌ Failed:  $($failed -join ', ')" -ForegroundColor Red
}

Write-Host ""
Write-Host "To deploy in future, just run: .\deploy-websites.ps1" -ForegroundColor DarkGray
