#!/bin/bash

echo "🔍 Prescription Clarity - 404 Diagnostic Tool"
echo "=============================================="
echo ""

# Check if file exists
echo "1️⃣ Checking if database file exists..."
if [ -f "public/data/complete-database.json" ]; then
    echo "   ✅ File exists: public/data/complete-database.json"
    
    # Get file size
    FILE_SIZE=$(wc -c < "public/data/complete-database.json")
    echo "   📊 File size: $FILE_SIZE bytes ($(echo "scale=2; $FILE_SIZE/1024" | bc) KB)"
    
    # Check if it's valid JSON
    echo ""
    echo "2️⃣ Checking if JSON is valid..."
    if cat public/data/complete-database.json | python3 -m json.tool > /dev/null 2>&1; then
        echo "   ✅ JSON is valid"
    elif cat public/data/complete-database.json | node -e "JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'))" > /dev/null 2>&1; then
        echo "   ✅ JSON is valid (verified with Node)"
    else
        echo "   ❌ JSON is INVALID - this could be the problem!"
        exit 1
    fi
    
    # Show first few lines
    echo ""
    echo "3️⃣ File preview (first 10 lines):"
    head -n 10 public/data/complete-database.json | sed 's/^/   /'
    
else
    echo "   ❌ File NOT FOUND: public/data/complete-database.json"
    echo ""
    echo "   This is the problem! File doesn't exist."
    echo ""
    echo "   Solutions:"
    echo "   1. Copy from /data/ folder:"
    echo "      cp data/complete-database.json public/data/"
    echo ""
    echo "   2. Or create the directory:"
    echo "      mkdir -p public/data"
    echo "      cp data/complete-database.json public/data/"
    exit 1
fi

echo ""
echo "4️⃣ Checking if dev server is running..."
if lsof -i :5173 > /dev/null 2>&1; then
    echo "   ✅ Dev server IS running on port 5173"
    
    echo ""
    echo "5️⃣ Testing file accessibility via HTTP..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/data/complete-database.json | grep -q "200"; then
        echo "   ✅ File is accessible at: http://localhost:5173/data/complete-database.json"
        echo ""
        echo "   🎉 SUCCESS! Everything looks good!"
        echo ""
        echo "   If you're still seeing 404 in the app:"
        echo "   1. Clear browser cache: localStorage.clear(); sessionStorage.clear();"
        echo "   2. Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)"
        echo "   3. Check Network tab in DevTools"
    else
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/data/complete-database.json)
        echo "   ❌ File returns HTTP $HTTP_CODE (not 200)"
        echo ""
        echo "   Possible causes:"
        echo "   1. Vite not configured to serve /public"
        echo "   2. File permissions issue"
        echo "   3. Cache problem"
        echo ""
        echo "   Solution:"
        echo "   1. Stop server (Ctrl+C)"
        echo "   2. Run: rm -rf node_modules/.vite dist"
        echo "   3. Run: npm run dev"
        echo "   4. Wait for 'ready' message"
        echo "   5. Try again"
    fi
else
    echo "   ❌ Dev server is NOT running on port 5173"
    echo ""
    echo "   Solution:"
    echo "   Run: npm run dev"
    echo ""
    echo "   Then run this diagnostic again."
    exit 1
fi

echo ""
echo "6️⃣ Browser test available at:"
echo "   http://localhost:5173/test-fetch.html"
echo ""
echo "=============================================="
echo "Diagnostic complete!"
echo ""
