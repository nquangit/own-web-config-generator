#!/bin/bash

echo ""
echo "=========================================="
echo "  WexBloit Configuration Generator Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js version:"
node --version
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not available"
    exit 1
fi

echo "npm version:"
npm --version
echo ""

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "=========================================="
echo "  Setup completed successfully!"
echo "=========================================="
echo ""
echo "To start the development server, run:"
echo "  npm start"
echo ""
echo "To build for production, run:"
echo "  npm run build"
echo ""
echo "The application will be available at:"
echo "  http://localhost:3000"
echo ""
