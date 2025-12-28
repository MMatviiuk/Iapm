#!/bin/bash

# IMMEDIATE DATABASE FIX
# Run this script RIGHT NOW to fix the 404 error

echo ""
echo "🚨 COPYING DATABASE - IMMEDIATE FIX"
echo "===================================="
echo ""

# Create directory
mkdir -p public/data
echo "✓ Created public/data/ directory"

# Copy database
if [ -f "data/complete-database.json" ]; then
  cp data/complete-database.json public/data/complete-database.json
  echo "✓ Copied complete-database.json"
  
  # Check file size
  SIZE=$(ls -lh public/data/complete-database.json | awk '{print $5}')
  echo "✓ File size: $SIZE"
  echo ""
  echo "✅ SUCCESS! Database copied successfully!"
  echo ""
  echo "Now run: npm run dev"
else
  echo "❌ ERROR: Source file not found at data/complete-database.json"
  echo ""
  echo "This is a critical error - the source database is missing!"
fi

echo ""
