Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  WexBloit Configuration Generator Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version:" -ForegroundColor Green
    Write-Host $nodeVersion -ForegroundColor Yellow
    Write-Host ""
}
catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "npm version:" -ForegroundColor Green
    Write-Host $npmVersion -ForegroundColor Yellow
    Write-Host ""
}
catch {
    Write-Host "ERROR: npm is not available" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Installing dependencies..." -ForegroundColor Cyan
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
}
catch {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  Setup completed successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "To build for production, run:" -ForegroundColor Cyan
Write-Host "  npm run build" -ForegroundColor Yellow
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
