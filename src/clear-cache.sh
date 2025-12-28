#!/bin/bash

# Clear Cache and Restart - Prescription Clarity
# Fixes database 404 and missing patientData errors

echo "🔧 Prescription Clarity - Cache Clear & Restart"
echo "================================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "Step 1: Stopping any running dev servers..."
# Try to stop any running processes on port 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
echo "✅ Stopped"
echo ""

echo "Step 2: Instructions to clear browser cache:"
echo ""
echo "   Please open your browser and:"
echo "   1. Press F12 to open DevTools"
echo "   2. Go to Console tab"
echo "   3. Run this command:"
echo ""
echo "      localStorage.clear(); sessionStorage.clear(); location.reload();"
echo ""
echo "   OR simply press Ctrl+Shift+Delete and clear:"
echo "   - Cached images and files"
echo "   - Cookies and site data"
echo ""
read -p "   Press ENTER when you've cleared the browser cache..."
echo ""

echo "Step 3: Starting development server..."
echo "✅ Server starting on http://localhost:5173"
echo ""
echo "📋 Next steps:"
echo "   1. Visit http://localhost:5173/test-database.html to test"
echo "   2. Then visit http://localhost:5173 and click 'Try Demo'"
echo "   3. Dashboard should show 6 medications"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""
echo "================================================"
echo ""

# Start the dev server
npm run dev
