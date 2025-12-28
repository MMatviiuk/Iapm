#!/bin/bash

echo "🔨 Build Test - Prescription Clarity"
echo "===================================="
echo ""

# Clean previous builds
echo "1️⃣ Cleaning previous builds..."
rm -rf dist
rm -rf node_modules/.vite
echo "   ✅ Done"
echo ""

# Build
echo "2️⃣ Building for production..."
echo ""
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ BUILD SUCCESSFUL!"
    echo ""
    echo "3️⃣ Starting preview server..."
    echo ""
    echo "   Preview will start at: http://localhost:4173"
    echo "   Test with 'Try Demo' button"
    echo ""
    echo "   Press Ctrl+C to stop"
    echo ""
    npm run preview
else
    echo ""
    echo "❌ BUILD FAILED!"
    echo ""
    echo "Please check the error messages above."
    exit 1
fi
