#!/bin/bash

echo "🔄 Prescription Clarity - Fresh Restart"
echo "======================================"
echo ""

# Stop any running processes
echo "1️⃣ Stopping any running dev servers..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
echo "   ✅ Done"
echo ""

# Clear Vite cache
echo "2️⃣ Clearing Vite cache..."
rm -rf node_modules/.vite
rm -rf dist
echo "   ✅ Done"
echo ""

# Instructions for browser
echo "3️⃣ IMPORTANT: Clear your browser now!"
echo ""
echo "   Open browser console (F12) and run:"
echo "   localStorage.clear(); sessionStorage.clear(); location.reload();"
echo ""
read -p "   Press ENTER after clearing browser..."
echo ""

# Start fresh
echo "4️⃣ Starting fresh development server..."
echo ""
echo "   Server will start at: http://localhost:5173"
echo "   Test page at: http://localhost:5173/test-database.html"
echo ""
echo "   After server starts:"
echo "   1. Visit http://localhost:5173"
echo "   2. Click 'Try Demo'"
echo "   3. Dashboard should show: Total Medications: 6"
echo ""
echo "   Press Ctrl+C to stop server"
echo ""
echo "======================================"
echo ""

npm run dev
