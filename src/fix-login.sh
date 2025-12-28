#!/bin/bash

echo ""
echo "========================================"
echo "  LOGIN FIX TOOL"
echo "========================================"
echo ""
echo "Opening login fix tool in your browser..."
echo ""

# Open in default browser
if command -v open > /dev/null; then
    # macOS
    open "fix-login-now.html"
elif command -v xdg-open > /dev/null; then
    # Linux
    xdg-open "fix-login-now.html"
else
    # Fallback
    echo "❌ Could not open browser automatically"
    echo "📋 Please open: fix-login-now.html manually"
fi

echo ""
echo "✅ Fix tool opened!"
echo ""
echo "Follow the steps in the browser:"
echo "1. Check Current Users"
echo "2. Clear All Data"
echo "3. Create Demo Users"
echo "4. Test Login"
echo "5. Go to App"
echo ""
read -p "Press ENTER to close..."
