#!/bin/bash

# Test Build Script
# Tests if the JSON import fix works correctly

echo ""
echo "🔧 Testing Build Fix for JSON Import Error"
echo "=========================================="
echo ""

# Step 1: Clean previous builds
echo "1️⃣  Cleaning previous builds..."
rm -rf dist
rm -rf node_modules/.vite
echo "✓ Cleaned"
echo ""

# Step 2: Copy database
echo "2️⃣  Copying database..."
npm run copy-db
if [ $? -ne 0 ]; then
    echo "❌ Database copy failed!"
    exit 1
fi
echo ""

# Step 3: Check if JSON file is valid
echo "3️⃣  Validating JSON file..."
node -e "JSON.parse(require('fs').readFileSync('data/complete-database.json', 'utf8'))" 2>&1
if [ $? -ne 0 ]; then
    echo "❌ JSON file is invalid!"
    exit 1
fi
echo "✓ JSON file is valid"
echo ""

# Step 4: Build
echo "4️⃣  Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed!"
    echo ""
    echo "Please check:"
    echo "  - Node version: $(node --version)"
    echo "  - npm version: $(npm --version)"
    echo "  - Error output above"
    exit 1
fi
echo ""

# Step 5: Success
echo "✅ Build successful!"
echo ""
echo "Next steps:"
echo "  1. Test in preview mode: npm run preview"
echo "  2. Open http://localhost:4173 in browser"
echo "  3. Check browser console for errors"
echo ""
