# WexBloit Config Generator

A modern web UI for generating WexBloit penetration testing configuration files with ease.

## 🚀 Features

- **Visual Configuration Builder**: Intuitive web interface for creating YAML configs
- **Quick Start Templates**: Pre-built templates for common testing scenarios
- **Real-time Preview**: Live YAML preview with syntax highlighting
- **Multi-step Flows**: Build complex multi-step test sequences
- **Module Support**: Configure test case modules and extensions
- **Network Settings**: Proxy, SSL, and timeout configuration
- **Export Options**: Download configurations in YAML format

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app will be available at `http://localhost:3500`

## 🌐 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages.

### Setup Instructions

1. **Update Repository Settings**:
   - Go to your repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Update Homepage URL**:
   - Edit `package.json` and replace `yourusername` with your actual GitHub username:
   ```json
   "homepage": "https://yourusername.github.io/wexbloit"
   ```

3. **Push to Main Branch**:
   - The workflow will automatically trigger on push to `main` or `master` branch
   - GitHub Actions will build and deploy your app

### Manual Deployment

If you need to deploy manually:

```bash
# Build the project
npm run build

# The build folder will be created with production files
```

### Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) includes:

- **Build Job**: Installs dependencies and builds the React app
- **Deploy Job**: Deploys the built files to GitHub Pages
- **Caching**: Optimized npm caching for faster builds
- **Concurrency Control**: Prevents multiple deployments running simultaneously

### Troubleshooting

1. **Build Fails**: Check the Actions tab for error details
2. **Page Not Found**: Verify the homepage URL in `package.json`
3. **Assets Not Loading**: Ensure all paths are relative (React handles this automatically)

## 📁 Project Structure

```
config_web/
├── src/
│   ├── components/          # React components
│   ├── utils/              # Utility functions
│   └── App.js              # Main app component
├── public/                 # Static assets
├── .github/workflows/      # GitHub Actions
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

The app generates YAML configurations compatible with WexBloit v2.0+ including:

- **Project Settings**: Name, description, version
- **Network Configuration**: Proxy, SSL, timeouts
- **Test Cases**: Individual test configurations
- **Flows**: Multi-step test sequences
- **Modules**: Test case modules and extensions
- **Execution**: Parallel processing and delays
- **Output**: Report formats and paths

## 📝 License

This project is part of the WexBloit toolkit.
