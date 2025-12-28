# 🚨 CRITICAL FIX - Database 404 Error

## Immediate Solution

The database file needs to be copied to the `public/data/` folder. Run this command:

```bash
node scripts/copy-database.js
```

**Expected Output:**
```
📋 Database Copy Script
─────────────────────────
✓ Created directory: /path/to/public/data
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
─────────────────────────
```

## What Was Fixed

### 1. Updated package.json Scripts

**Added automatic database copy before dev/build:**
```json
"predev": "node scripts/copy-database.js",
"prebuild": "node scripts/copy-database.js",
```

This means:
- `npm run dev` → automatically runs copy script first
- `npm run build` → automatically runs copy script first

### 2. Manual Copy Command

If you need to copy the database manually:
```bash
npm run copy-db
```

## Quick Test

```bash
# 1. Stop any running dev server (Ctrl+C)

# 2. Copy database manually
npm run copy-db

# 3. Start dev server (will also copy automatically)
npm run dev

# 4. Check browser console - should have NO 404 errors
```

## Verify Database Exists

```bash
# Check if file exists
ls -la public/data/complete-database.json

# Should show something like:
# -rw-r--r-- 1 user staff 123456 Nov 5 XX:XX public/data/complete-database.json

# Check file size (should be ~100-200KB)
du -h public/data/complete-database.json
```

## Why This Happens

The database file lives in `/data/complete-database.json` but needs to be copied to `/public/data/` so it can be served by the dev server.

**Before:**
- Source: `/data/complete-database.json` ✅ (exists)
- Target: `/public/data/complete-database.json` ❌ (missing)
- Browser requests: `/data/complete-database.json` → 404

**After:**
- Source: `/data/complete-database.json` ✅ (exists)
- Target: `/public/data/complete-database.json` ✅ (copied)
- Browser requests: `/data/complete-database.json` → 200 OK

## Troubleshooting

### Error: "Source file not found"

**Problem:** Source database doesn't exist
**Solution:** 
```bash
ls data/complete-database.json
# If this fails, the source file is missing - this is a bigger problem
```

### Error: "EACCES: permission denied"

**Problem:** Don't have permission to create folders
**Solution:**
```bash
# On Unix/Mac:
sudo npm run copy-db

# Or fix permissions:
sudo chown -R $USER:$USER public/
```

### Error: Script runs but still 404

**Problem:** File copied to wrong location
**Solution:**
```bash
# Check where file was copied
find . -name "complete-database.json" -type f

# Should show both:
# ./data/complete-database.json
# ./public/data/complete-database.json

# If second one missing, manually copy:
mkdir -p public/data
cp data/complete-database.json public/data/
```

### Browser Console Shows 404 for Different Path

**Problem:** Code is requesting wrong path
**Check:** Open browser DevTools → Network tab
- Look for request to `/data/complete-database.json`
- If it's requesting different path, check `/data/database.ts`

## Files Involved

| File | Purpose |
|------|---------|
| `/data/complete-database.json` | Source database (tracked in git) |
| `/public/data/complete-database.json` | Copied database (served by Vite) |
| `/scripts/copy-database.js` | Copy script |
| `/package.json` | NPM scripts (predev, prebuild) |
| `/vite.config.ts` | Vite plugin (backup copy method) |
| `/data/database.ts` | Database loader (uses fetch()) |

## Status After Fix

✅ **npm run dev** - Automatically copies database before starting  
✅ **npm run build** - Automatically copies database before building  
✅ **npm run copy-db** - Manual copy command available  
✅ **Backup**: Vite plugin also copies during config resolution  

## Next Steps

1. Run `npm run copy-db` RIGHT NOW
2. Verify file exists: `ls public/data/complete-database.json`
3. Start dev server: `npm run dev`
4. Check browser console - no 404 errors
5. If still broken, see `/QUICK_DATABASE_TEST.md`

---

**Last Updated:** November 5, 2025  
**Status:** ✅ READY TO TEST
