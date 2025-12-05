# init.ps1 - Initialisierungsskript für Minimal Habits App
# Führe dieses Skript am Anfang jeder Entwicklungssession aus

Write-Host "=== Minimal Habits App - Environment Setup ===" -ForegroundColor Cyan

# 1. Aktuelles Verzeichnis verifizieren
$projectPath = $PSScriptRoot
Write-Host "`n[1/6] Verifying project directory..." -ForegroundColor Yellow
if (Test-Path "$projectPath\package.json") {
    Write-Host "  Project directory verified: $projectPath" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Not in project directory!" -ForegroundColor Red
    exit 1
}

# 2. Node-Version prüfen
Write-Host "`n[2/6] Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node -v
Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Green

# 3. Dependencies prüfen/installieren
Write-Host "`n[3/6] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "$projectPath\node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "  Dependencies already installed" -ForegroundColor Green
}

# 4. TypeScript-Check
Write-Host "`n[4/6] Running TypeScript check..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "  TypeScript check passed" -ForegroundColor Green
} else {
    Write-Host "  TypeScript errors found - please fix before continuing" -ForegroundColor Red
}

# 5. Git-Status anzeigen
Write-Host "`n[5/6] Git status..." -ForegroundColor Yellow
git status --short
Write-Host ""
git log --oneline -5

# 6. Fortschrittsdatei anzeigen
Write-Host "`n[6/6] Current progress..." -ForegroundColor Yellow
if (Test-Path "$projectPath\claude-progress.txt") {
    Get-Content "$projectPath\claude-progress.txt" | Select-Object -Last 20
} else {
    Write-Host "  No progress file found" -ForegroundColor Yellow
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "Run 'npx expo start' to start the development server" -ForegroundColor White
Write-Host ""
