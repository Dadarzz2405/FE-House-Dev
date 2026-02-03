#!/bin/bash

echo "🧹 Step 1: Removing old files..."
rm -rf node_modules
rm -f package-lock.json
rm -rf dist

echo "📦 Step 2: Clearing npm cache..."
npm cache clean --force

echo "📝 Step 3: Installing dependencies..."
npm install

echo "✅ Clean installation complete!"
echo ""
echo "Now run: npm run dev"