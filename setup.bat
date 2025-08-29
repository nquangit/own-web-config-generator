@echo off
echo.
echo ==========================================
echo   WexBloit Configuration Generator Setup
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo npm version:
npm --version
echo.

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   Setup completed successfully!
echo ==========================================
echo.
echo To start the development server, run:
echo   npm start
echo.
echo To build for production, run:
echo   npm run build
echo.
echo The application will be available at:
echo   http://localhost:3000
echo.
pause
