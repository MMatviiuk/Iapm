# Database 404 Fix - Quick Start

## The Problem
```
Error: HTTP 404 when loading /data/complete-database.json
```

## The Solution
ESM-compatible copy script + Vite plugin backup

---

## Quick Fix (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Verify Output
```
📋 Database Copy Script
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes

✓ Copied complete-database.json to public/data/
  VITE ready in xxx ms
  ➜ Local: http://localhost:5173/
```

---

## Expected Results

✅ **Console:** Two copy messages (script + plugin)  
✅ **File:** `public/data/complete-database.json` exists  
✅ **Browser:** No 404 errors  
✅ **Dashboards:** Load with data  

---

## If It Still Fails

### Try This:
```bash
# Clean everything
rm -rf public/data/complete-database.json
rm -rf node_modules/.vite

# Manual copy
npm run prepare-db

# Restart
npm run dev
```

### Check This:
```bash
# Verify source exists
cat data/complete-database.json | head -5

# Verify ESM fix in vite.config.ts
grep "fileURLToPath" vite.config.ts

# Should output:
# import { fileURLToPath } from 'url';
# const __filename = fileURLToPath(import.meta.url);
```

---

## What Changed

1. **vite.config.ts** - Added ESM `__dirname` fix
2. **package.json** - Pre-script runs before Vite
3. **scripts/copy-database.js** - Dedicated copy script

---

## Full Documentation

- **Complete Guide:** `/DATABASE_FIX_ESM_FINAL_NOV5_2025.md`
- **Testing:** `/QUICK_DATABASE_TEST.md`
- **Setup:** `/START_HERE.md`

---

**Status:** ✅ FIXED (ESM Compatible)  
**Date:** November 5, 2025
