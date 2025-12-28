#!/bin/bash

# Quick Database Copy Script
# Run this if you see HTTP 404 errors

echo "📋 Copying database to public folder..."
echo ""

# Create directory
mkdir -p public/data

# Copy file
cp data/complete-database.json public/data/complete-database.json

# Check result
if [ -f "public/data/complete-database.json" ]; then
  SIZE=$(ls -lh public/data/complete-database.json | awk '{print $5}')
  echo "✅ SUCCESS! Database copied to public/data/"
  echo "   File size: $SIZE"
  echo ""
  echo "Now run: npm run dev"
else
  echo "❌ ERROR! Database copy failed"
  echo ""
  echo "Try running: npm run copy-db"
fi
