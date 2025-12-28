#!/bin/bash

echo ""
echo "========================================"
echo " RESTART DEV SERVER + CLEAR CACHE"
echo "========================================"
echo ""

# Kill any existing dev servers
echo "Stopping existing dev servers..."
pkill -f "vite" 2>/dev/null || true
sleep 2

# Clear Vite cache
echo "Clearing Vite cache..."
rm -rf node_modules/.vite
rm -rf dist
rm -rf .parcel-cache

echo ""
echo "Cache cleared successfully!"
echo ""
echo "========================================"
echo " IMPORTANT: CLEAR BROWSER CACHE NOW!"
echo "========================================"
echo ""
echo "Desktop:"
echo " - Chrome/Edge: Ctrl + Shift + Delete (Linux)"
echo " - Chrome/Edge: Cmd + Shift + Delete (Mac)"
echo " - Select 'Cached images and files'"
echo " - Click 'Clear data'"
echo " - HARD REFRESH: Ctrl + Shift + R (Linux)"
echo " - HARD REFRESH: Cmd + Shift + R (Mac)"
echo ""
echo "Mobile:"
echo " - USE INCOGNITO MODE!"
echo " - Android: Three dots -> New incognito tab"
echo " - iOS Safari: Tabs -> Private"
echo ""
echo "========================================"
echo ""

# Start dev server
echo "Starting dev server..."
npm run dev &

echo ""
echo "========================================"
echo " Dev server starting..."
echo " Wait for 'Local: http://localhost:5173'"
echo ""
echo " THEN:"
echo " 1. CLEAR BROWSER CACHE (Ctrl+Shift+Delete)"
echo " 2. HARD REFRESH (Ctrl+Shift+R)"
echo " 3. Or use INCOGNITO mode (Ctrl+Shift+N)"
echo "========================================"
echo ""
