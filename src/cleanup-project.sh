#!/bin/bash

# Cleanup script - remove all documentation and test files
# Keep only essential files for production

echo "🗑️  Starting project cleanup..."

# Keep README.md and guidelines/Guidelines.md
# Remove ALL other .md files in root
find . -maxdepth 1 -name "*.md" ! -name "README.md" -type f -delete

# Remove all .txt files
find . -maxdepth 1 -name "*.txt" -type f -delete

# Remove all test .html files (keep index.html)
find . -maxdepth 1 -name "*.html" ! -name "index.html" -type f -delete
find ./public -name "*.html" ! -name "offline.html" -type f -delete

# Remove all .bat and .sh scripts (except this one)
find . -maxdepth 1 -name "*.bat" -type f -delete
find . -maxdepth 1 -name "*.sh" ! -name "cleanup-project.sh" -type f -delete

# Remove test files
find . -name "*.test.ts" -type f -delete
find . -name "*.test.tsx" -type f -delete
find . -name "*.spec.ts" -type f -delete

# Remove e2e tests folder
rm -rf ./e2e

# Remove workflows folder (GitHub Actions)
rm -rf ./workflows

# Remove data documentation
rm -f ./data/DATABASE_USAGE.md
rm -f ./data/README.txt

# Remove scripts documentation  
rm -f ./scripts/README.md

echo "✅ Cleanup complete!"
echo ""
echo "📊 Kept:"
echo "  - README.md"
echo "  - guidelines/Guidelines.md"
echo "  - index.html"
echo "  - All source code (.tsx, .ts, .css files)"
echo "  - Configuration files (package.json, tsconfig.json, etc.)"
echo ""
echo "🗑️  Removed:"
echo "  - All documentation .md files (except README.md)"
echo "  - All .txt files"
echo "  - All test .html files"
echo "  - All .bat/.sh scripts"
echo "  - All test files (.test.ts, .test.tsx, .spec.ts)"
echo "  - e2e/ folder"
echo "  - workflows/ folder"
