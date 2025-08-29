# WexBloit Configuration Generator

A modern web-based UI for generating WexBloit penetration testing configuration files with ease.

## Features

🛡️ **Professional Interface** - Clean, intuitive design for security professionals  
📝 **Form-Based Configuration** - No more manual YAML editing  
🔍 **Live Preview** - Real-time YAML generation with syntax highlighting  
✅ **Validation** - Built-in configuration validation and error checking  
📊 **Test Case Modules** - Pre-built vulnerability test modules  
🔄 **Flow Management** - Multi-step test flows with data chaining  
🌐 **Network Configuration** - Proxy, SSL, and timeout settings  
📱 **Responsive Design** - Works on desktop, tablet, and mobile  

## Quick Start

### Windows Users

1. **Automated Setup (Recommended)**
   ```cmd
   cd config_web
   setup.bat
   ```
   
   Or using PowerShell:
   ```powershell
   cd config_web
   .\setup.ps1
   ```

2. **Manual Setup**
   ```cmd
   cd config_web
   npm install
   npm start
   ```

### Linux/Mac Users

1. **Automated Setup**
   ```bash
   cd config_web
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Manual Setup**
   ```bash
   cd config_web
   npm install
   npm start
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `build/` directory, ready for deployment.

## Configuration Sections

### 🏗️ Project Information
- Project name, description, and version
- Output paths and report formats
- Execution settings

### 🌐 Network Configuration
- HTTP/HTTPS proxy settings (Burp, ZAP, etc.)
- SSL/TLS certificate handling
- Timeout and retry configuration
- User agent customization

### 🧪 Test Cases
- Simple, standalone HTTP request tests
- Expected status codes and validation rules
- Parallel execution options

### 🔄 Flows
- Multi-step test sequences
- Data extraction and chaining between steps
- Request modifications and validations
- Continue-on-failure options

### 🔧 Test Case Modules
- Pre-built vulnerability test modules:
  - SQL Injection Testing
  - Cross-Site Scripting (XSS)
  - Insecure Direct Object Reference (IDOR)
  - Broken Function Level Authorization
  - Mass Assignment
  - Authentication Testing
  - Security Headers Analysis
  - API Security Testing

### 🔌 Extensions
- Request/response processing extensions
- Global configuration variables
- Custom authentication handling

## Generated Configuration

The tool generates professional YAML configurations compatible with WexBloit v2.0+:

```yaml
project:
  name: "WebApp Security Assessment"
  description: "Comprehensive security testing"
  version: "1.0.0"

network:
  proxy:
    http: "http://127.0.0.1:8080"
    https: "http://127.0.0.1:8080"
  verify_ssl: false
  timeout: 30

tests:
  flows:
    - name: "Authentication Flow"
      steps:
        - name: "Login Request"
          raw_request: "auth/login.txt"
          extract:
            json:
              token: "access_token"

test_case_modules:
  enabled:
    - "SQLInjectionTestCase"
    - "XSSTestCase"
  global_config:
    base_url: "https://example.com"
    username: "testuser"
```

## Key Benefits

### ✅ **No More YAML Syntax Errors**
- Form-based input prevents syntax mistakes
- Real-time validation catches configuration errors
- Professional configuration structure guaranteed

### ⚡ **Faster Configuration**
- Visual interface is much faster than manual editing
- Pre-built templates for common scenarios
- Copy/paste and duplicate functionality

### 🎯 **Professional Results**
- Generates production-ready configurations
- Includes all necessary sections and validation
- Compatible with enterprise security workflows

### 🔍 **Better Understanding**
- Clear documentation and examples
- Tooltips and help sections throughout
- Visual representation of test relationships

## Technology Stack

- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **js-yaml** - YAML generation and parsing
- **React Icons** - Professional iconography

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the WexBloit toolkit. See the main project for licensing information.

---

**Made with ❤️ for the cybersecurity community**
