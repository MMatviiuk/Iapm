#!/bin/bash

echo "🚀 Prescription Clarity - Quick Fix Script"
echo "=========================================="
echo ""

# Check if source file exists
if [ ! -f "data/complete-database.json" ]; then
    echo "❌ ERROR: Source file not found: data/complete-database.json"
    exit 1
fi

# Create target directory
echo "📁 Creating public/data directory..."
mkdir -p public/data

# Copy database file
echo "📋 Copying database file..."
cp data/complete-database.json public/data/

# Verify copy
if [ -f "public/data/complete-database.json" ]; then
    SIZE=$(wc -c < "public/data/complete-database.json")
    echo "✅ SUCCESS! Database copied successfully"
    echo "   File size: $SIZE bytes"
    echo ""
    echo "🎉 Ready to start!"
    echo ""
    echo "Run: npm run dev"
    echo ""
else
    echo "❌ ERROR: Copy failed"
    exit 1
fi
