# Gavyadhenu Backend Auto-Start PowerShell Script
# Run this script to start the backend with PM2
# Can be called from Windows Task Scheduler for auto-start on boot

param(
    [switch]$OpenBrowser = $false,
    [string]$LogPath = "C:\Users\abhay\Gavyadhenu\server\startup.log"
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Gavyadhenu Backend Startup (PM2)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Log startup
Add-Content -Path $LogPath -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'): Starting backend..."

try {
    # Navigate to server directory
    Set-Location "C:\Users\abhay\Gavyadhenu\server"
    Write-Host "[1/3] Navigated to server directory" -ForegroundColor Cyan
    
    # Verify PM2 is available
    $pm2Check = pm2 -v 2>&1
    if ($?) {
        Write-Host "[2/3] PM2 is available (v$pm2Check)" -ForegroundColor Cyan
        Add-Content -Path $LogPath -Value "PM2 version: $pm2Check"
    } else {
        Write-Host "[2/3] PM2 not found, installing..." -ForegroundColor Yellow
        npm install -g pm2 | Out-Null
        Add-Content -Path $LogPath -Value "PM2 installed"
    }
    
    # Start the backend
    pm2 start ecosystem.config.cjs --env production 2>&1 | Out-Null
    Write-Host "[3/3] Backend started with PM2" -ForegroundColor Cyan
    
    # Verify it's running
    Start-Sleep -Seconds 2
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/products" -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host ""
        Write-Host "✓ Backend is running and responding!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Backend: http://localhost:5000/api" -ForegroundColor Green
        Write-Host "Logs:    pm2 logs gavyadhenu-server" -ForegroundColor Gray
        Write-Host ""
        Add-Content -Path $LogPath -Value "Backend started successfully"
        
        if ($OpenBrowser) {
            Start-Process "http://localhost:5000/api/products"
        }
    } else {
        Write-Host "⚠ Backend may not be responding correctly" -ForegroundColor Yellow
        Add-Content -Path $LogPath -Value "WARNING: Backend not responding after start"
    }
}
catch {
    Write-Host "✗ Error starting backend:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Add-Content -Path $LogPath -Value "ERROR: $($_.Exception.Message)"
}

Write-Host ""
