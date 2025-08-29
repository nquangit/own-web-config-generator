# Windows Setup Guide

## Prerequisites

1. **Install Node.js**
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - Run the installer and follow the setup wizard
   - Restart your command prompt/PowerShell after installation

2. **Verify Installation**
   ```cmd
   node --version
   npm --version
   ```

## Setup Methods

### Method 1: Automated Setup (Recommended)

**Using Command Prompt:**
```cmd
cd config_web
setup.bat
```

**Using PowerShell:**
```powershell
cd config_web
.\setup.ps1
```

### Method 2: Manual Setup

1. **Navigate to the config_web directory**
   ```cmd
   cd config_web
   ```

2. **Install dependencies**
   ```cmd
   npm install
   ```

3. **Start the development server**
   ```cmd
   npm start
   ```

4. **Open your browser**
   - Go to: http://localhost:3000
   - The WexBloit Config Generator should load

## Common Windows Issues

### Issue: "npm is not recognized"
**Solution:** Add Node.js to your PATH
1. Search for "Environment Variables" in Windows
2. Click "Environment Variables"
3. Add Node.js installation path to PATH variable
4. Restart command prompt

### Issue: PowerShell Execution Policy
If you get an execution policy error with PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Port 3000 already in use
```cmd
npm start -- --port 3001
```

## Building for Production

```cmd
npm run build
```

The built files will be in the `build/` directory.

## Troubleshooting

1. **Clear npm cache**
   ```cmd
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall**
   ```cmd
   rmdir /s node_modules
   del package-lock.json
   npm install
   ```

3. **Check Windows version compatibility**
   - Windows 10 or later recommended
   - Windows 8.1 minimum requirement

## Next Steps

Once the application is running:
1. Choose a Quick Start template
2. Configure your project settings
3. Set up network/proxy configuration
4. Add test cases or flows
5. Enable test modules as needed
6. Download your generated YAML configuration

Happy penetration testing! 🛡️
