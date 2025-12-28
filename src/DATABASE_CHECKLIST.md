# Database Fix Checklist

## Before Starting

- [ ] Node.js installed (v18+)
- [ ] Project cloned/downloaded
- [ ] Terminal open in project root

## Fix Steps (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```
**Wait for:** "added XXX packages" message

### Step 2: Copy Database
```bash
npm run copy-db
```
**Expected output:**
```
📋 Database Copy Script
─────────────────────────
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
─────────────────────────
```

**If this fails:** Try alternative methods below

### Step 3: Verify File
```bash
ls -la public/data/complete-database.json
```
**Should show:** File with size ~100-200KB

**If file missing:** File not copied, try manual copy

### Step 4: Start Dev Server
```bash
npm run dev
```
**Expected output:**
```
✓ Copied complete-database.json to public/data/

  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 5: Test in Browser
- Open http://localhost:5173
- Press F12 (DevTools)
- Check Console tab

**Expected:** No red errors  
**Not expected:** "HTTP 404" or "Failed to load database"

---

## If Step 2 Fails

### Alternative 1: Shell Script (Mac/Linux)
```bash
chmod +x copy-database.sh
./copy-database.sh
```

### Alternative 2: Batch Script (Windows)
Double-click: `copy-database.bat`

Or in terminal:
```cmd
copy-database.bat
```

### Alternative 3: Manual Copy
```bash
mkdir -p public/data
cp data/complete-database.json public/data/complete-database.json
```

**Windows:**
```cmd
mkdir public\data
copy data\complete-database.json public\data\complete-database.json
```

---

## If Step 5 Shows Errors

### Fix 1: Clear Cache
In browser DevTools:
- Network tab
- Check "Disable cache"
- Hard refresh: Ctrl+Shift+R (Win) or Cmd+Shift+R (Mac)

### Fix 2: Restart Dev Server
```bash
# Press Ctrl+C to stop
npm run dev
```

### Fix 3: Delete Cache and Restart
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## Success Criteria

✅ **Terminal:**
- No errors during `npm run copy-db`
- Copy confirmation shown
- Dev server starts successfully

✅ **File System:**
- File exists: `public/data/complete-database.json`
- Size matches source: ~100-200KB

✅ **Browser:**
- No console errors
- No 404 errors in Network tab
- Dashboard loads with data

✅ **Functionality:**
- Can see patients/dependents/doctors
- Data displays correctly
- No loading errors

---

## Common Issues

### Issue: "Cannot find module 'fs'"
**Cause:** Wrong Node.js setup  
**Fix:** Ensure Node.js v18+ installed
```bash
node --version
# Should show: v18.x.x or higher
```

### Issue: "EACCES: permission denied"
**Cause:** No write permissions  
**Fix:**
```bash
sudo chown -R $USER:$USER public/
npm run copy-db
```

### Issue: "Source file not found"
**Cause:** Source database missing  
**Fix:** Check if file exists
```bash
ls data/complete-database.json
# If missing, restore from git:
git checkout data/complete-database.json
```

### Issue: Script runs but still 404
**Cause:** File in wrong location or cache  
**Fix:**
```bash
# Check file location
find . -name "complete-database.json"
# Should show both:
# ./data/complete-database.json
# ./public/data/complete-database.json

# If second one missing, manually copy
mkdir -p public/data
cp data/complete-database.json public/data/
```

---

## Quick Verification

Run this one-liner to check everything:

**Mac/Linux:**
```bash
[ -f data/complete-database.json ] && echo "✓ Source exists" || echo "✗ Source missing"; [ -f public/data/complete-database.json ] && echo "✓ Target exists" || echo "✗ Target missing"
```

**Windows PowerShell:**
```powershell
if (Test-Path "data\complete-database.json") { "✓ Source exists" } else { "✗ Source missing" }; if (Test-Path "public\data\complete-database.json") { "✓ Target exists" } else { "✗ Target missing" }
```

**Expected output:**
```
✓ Source exists
✓ Target exists
```

---

## Documentation Reference

| Issue | Document |
|-------|----------|
| Quick fix | `/FIX_NOW.md` |
| Emergency | `/DATABASE_404_EMERGENCY_FIX.md` |
| Complete solution | `/DATABASE_FIX_FINAL_NOV5_2025.md` |
| Summary | `/SOLUTION_SUMMARY_NOV5_2025.md` |
| Setup guide | `/START_HERE.md` |

---

## Status Codes

✅ = Success  
❌ = Error  
⚠️ = Warning  
📋 = Information  

---

**Print this checklist and follow step by step.**
