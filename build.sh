#!/bin/bash

# Simple build script that doesn't require global TypeScript
echo "Building joy-api-node..."

# Check if node_modules exists, if not try to install
if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Please run 'npm install' or 'yarn install' first."
    echo "If you encounter permission errors, try:"
    echo "  sudo chown -R $(whoami) ~/.npm"
    echo "  or use a different package manager"
    exit 1
fi

# Try to use local TypeScript if available
if [ -f "node_modules/.bin/tsc" ]; then
    echo "Using local TypeScript compiler..."
    node_modules/.bin/tsc
    echo "Build complete! Output in dist/"
else
    echo "TypeScript not found in node_modules."
    echo "Please install dependencies first."
    exit 1
fi