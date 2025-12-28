#!/bin/bash

echo "========================================"
echo "Testing Build Fix - November 5, 2025"
echo "========================================"
echo ""

echo "[1/3] Cleaning old build artifacts..."
rm -rf dist node_modules/.vite
echo "Done!"
echo ""

echo "[2/3] Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "========================================"
    echo "BUILD FAILED!"
    echo "========================================"
    echo "Check the error messages above."
    exit 1
fi
echo ""

echo "[3/3] Build successful!"
echo "========================================"
echo "SUCCESS! Build completed without errors."
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Run: npm run preview"
echo "2. Open: http://localhost:4173"
echo "3. Check browser console for 'Database loaded successfully'"
echo ""
