DATABASE DIRECTORY - AUTO-GENERATED
=====================================

This directory contains the database file that is automatically copied during build.

AUTOMATIC COPY (ESM Compatible):
--------------------------------
npm run dev    → Runs copy script before Vite starts
npm run build  → Runs copy script before build
npm run prepare-db → Manual copy if needed

FILE FLOW:
----------
Source:  /data/complete-database.json         (tracked in git)
Copied:  /public/data/complete-database.json  (ignored by git, auto-generated)
Built:   /dist/data/complete-database.json    (production output)

HOW IT WORKS:
-------------
1. Pre-script (node scripts/copy-database.js) runs FIRST
2. Creates this directory if needed
3. Copies database file with verification
4. Vite plugin runs as backup
5. App uses fetch('/data/complete-database.json') to load

IMPORTANT:
----------
✅ DO:
  - Run "npm run dev" or "npm run build" (auto-copy)
  - Use fetch() to load database in code
  - Keep source file updated in /data/

❌ DON'T:
  - Import JSON in TypeScript files
  - Manually place files here (use scripts)
  - Commit complete-database.json here (auto-ignored)

TROUBLESHOOTING:
----------------
If HTTP 404 errors occur:
  npm run prepare-db

If build errors occur:
  rm -rf public/data/complete-database.json dist node_modules/.vite
  npm run build

BUILD ERROR FIXED:
------------------
Previous error: "Expected ';' but found ':'" in JSON
Cause: Direct JSON import in database.ts
Fix: Removed import, using fetch() only
Status: ✅ FIXED (Nov 5, 2025)

For more info: /DATABASE_BUILD_ERROR_FIXED.md
