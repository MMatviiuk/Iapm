# 🚨 EMERGENCY FIX - Database 404 Error

## Problem
```
Error: HTTP 404: 
Error: Failed to load database. Ensure complete-database.json is available.
```

## Immediate Solution (3 Steps)

### Step 1: Copy Database Manually
```bash
npm run copy-db
```

### Step 2: Verify File Exists
```bash
ls -la public/data/complete-database.json
```

Should show file with size ~100-200KB. If file doesn't exist, continue to Step 3.

### Step 3: Manual Copy (if npm script fails)
```bash
# Create directory
mkdir -p public/data

# Copy file
cp data/complete-database.json public/data/complete-database.json

# Verify
ls -la public/data/complete-database.json
```

## Start Application

```bash
# Now start dev server
npm run dev
```

**Expected Console Output:**
```
📋 Database Copy Script
─────────────────────────
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
─────────────────────────

✓ Copied complete-database.json to public/data/

  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**Browser Console:**
- ✅ No HTTP 404 errors
- ✅ No "Failed to load database" errors

## If Still Broken

### Check 1: Source File Exists
```bash
ls -la data/complete-database.json
```

If this fails → source file is missing (bigger problem).

### Check 2: Target File Exists
```bash
ls -la public/data/complete-database.json
```

If this fails → copy script didn't work.

### Check 3: File Sizes Match
```bash
ls -lh data/complete-database.json public/data/complete-database.json
```

Both should be same size (~100-200KB).

### Check 4: Browser Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for request to `/data/complete-database.json`
5. Should return: **200 OK** (not 404)

## Understanding the Fix

### What Changed in package.json

**Before:**
```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build"
}
```

**After:**
```json
"scripts": {
  "predev": "node scripts/copy-database.js",
  "dev": "vite",
  "prebuild": "node scripts/copy-database.js",
  "build": "tsc && vite build",
  "copy-db": "node scripts/copy-database.js"
}
```

**What this means:**
- `predev` → Runs automatically BEFORE `npm run dev`
- `prebuild` → Runs automatically BEFORE `npm run build`
- `copy-db` → Manual command you can run anytime

### Why This is Needed

1. **Source Location:** `/data/complete-database.json`
   - This is in the source code (tracked by git)
   - NOT served by Vite dev server

2. **Target Location:** `/public/data/complete-database.json`
   - This is in the public folder
   - SERVED by Vite dev server as `/data/complete-database.json`

3. **Browser Request:** `fetch('/data/complete-database.json')`
   - Browser asks for `/data/complete-database.json`
   - Vite serves from `/public/data/complete-database.json`
   - If file missing in public folder → 404 error

## Automatic Copy Methods

### Method 1: npm predev/prebuild (PRIMARY)
- Runs before every `npm run dev` or `npm run build`
- Uses `/scripts/copy-database.js`
- Most reliable

### Method 2: Vite Plugin (BACKUP)
- Runs when Vite config loads
- Uses `/vite.config.ts` copyDatabasePlugin
- Backup if npm scripts fail

### Method 3: Manual Copy (EMERGENCY)
- Run `npm run copy-db` anytime
- Or use direct `cp` command
- For immediate fixes

## Files Reference

```
Project Root
├── data/
│   └── complete-database.json          ← SOURCE (git tracked)
├── public/
│   └── data/
│       └── complete-database.json      ← TARGET (auto-copied, not in git)
├── scripts/
│   └── copy-database.js                ← Copy script
├── package.json                        ← predev/prebuild scripts
└── vite.config.ts                      ← Backup copy plugin
```

## Common Errors

### Error: "Source file not found"
```bash
# Check source exists
ls data/complete-database.json

# If missing, this is critical - source file deleted!
```

### Error: "EACCES: permission denied"
```bash
# Fix permissions
sudo chown -R $USER:$USER public/

# Or run with sudo (not recommended)
sudo npm run copy-db
```

### Error: "Module not found: fs"
```bash
# This happens if using ES modules incorrectly
# Check package.json has: "type": "module"
# Script uses CommonJS require() which is correct
```

## Verification Checklist

Before starting:
- [ ] Source file exists: `ls data/complete-database.json`
- [ ] Can run copy script: `npm run copy-db`
- [ ] See success message with file size
- [ ] Target file exists: `ls public/data/complete-database.json`
- [ ] File sizes match
- [ ] Dev server starts: `npm run dev`
- [ ] No console errors about copy
- [ ] Browser has no 404 errors
- [ ] Dashboard loads with data

## Success Indicators

✅ **Terminal shows:**
```
📋 Database Copy Script
─────────────────────────
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
─────────────────────────
```

✅ **File exists:**
```bash
$ ls -lh public/data/complete-database.json
-rw-r--r-- 1 user staff 123K Nov 5 12:34 public/data/complete-database.json
```

✅ **Browser console:** No 404 errors

✅ **Dashboard loads:** Shows patients/dependents/doctors with data

## Still Not Working?

If you've done all of the above and still see 404:

1. **Clear browser cache:**
   - DevTools (F12) → Network tab → Disable cache checkbox
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Restart dev server:**
   ```bash
   # Stop (Ctrl+C)
   npm run dev
   ```

3. **Delete and recreate:**
   ```bash
   rm -rf public/data
   npm run copy-db
   npm run dev
   ```

4. **Check other documentation:**
   - `/CRITICAL_DATABASE_FIX.md`
   - `/QUICK_DATABASE_TEST.md`
   - `/START_HERE.md`

---

**Created:** November 5, 2025  
**Priority:** 🚨 CRITICAL  
**Status:** ✅ FIX APPLIED - READY TO TEST
