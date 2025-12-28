# Quick Database Test Guide (ESM Fixed)

## Test the Database Loading Fix

### Step 1: Clean Start
```bash
# Remove any cached files
rm -rf public/data/complete-database.json
rm -rf node_modules/.vite
```

### Step 2: Start Dev Server
```bash
npm run dev
```

### Step 3: Check Console Output

You should see:
```
📋 Database Copy Script
─────────────────────────
✓ Created directory: /path/to/public/data
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
─────────────────────────

✓ Copied complete-database.json to public/data/

  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**Note:** First message from Node script, second from Vite plugin (backup).

### Step 4: Verify File Exists
```bash
# Check if file was copied
ls -la public/data/complete-database.json
# Should show: -rw-r--r-- 1 user staff 123456 Nov  5 XX:XX public/data/complete-database.json
```

### Step 5: Test in Browser

1. Open http://localhost:5173
2. Open browser DevTools Console (F12)
3. Look for any error messages

**Expected Result:**
- ✅ No "HTTP 404" errors
- ✅ No "Failed to load database" errors
- ✅ Database loads successfully

### Step 6: Test Dashboards

**Patient Dashboard:**
```
URL: http://localhost:5173/dashboard
Expected: Shows medications, adherence stats, charts
```

**Caregiver Dashboard:**
```
URL: http://localhost:5173/caregiver-dashboard
Expected: Shows 3 dependents (Margaret, Hans, Maria)
```

**Doctor Dashboard:**
```
URL: http://localhost:5173/doctor-dashboard
Expected: Shows patients list with adherence rates
```

---

## Troubleshooting

### If you still see HTTP 404:

1. **Check file exists:**
   ```bash
   cat public/data/complete-database.json | head -5
   ```
   Should show JSON content starting with `{"doctors":[`

2. **Check dev server logs:**
   Look for "✓ Copied complete-database.json" message
   
3. **Restart dev server:**
   ```bash
   # Stop (Ctrl+C)
   npm run dev
   ```

4. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click on reload button
   - Select "Empty Cache and Hard Reload"

5. **Check network tab:**
   - Open DevTools → Network tab
   - Look for request to `/data/complete-database.json`
   - Should return 200 OK, not 404

---

## Build Test

### Test Production Build

```bash
# Build the app
npm run build

# Check dist folder
ls -la dist/data/complete-database.json

# Preview production build
npm run preview
```

**Expected:**
- Database file copied to `dist/data/`
- Preview server works without errors
- All dashboards load correctly

---

## Success Criteria

✅ **Console:** No errors, see copy confirmation  
✅ **File:** `public/data/complete-database.json` exists  
✅ **Browser:** No 404 errors in Network tab  
✅ **Dashboards:** All load with correct data  
✅ **Build:** Production build includes database file  

---

## Common Issues

### Issue: "Module not found"
**Solution:** File path is correct, but plugin didn't run. Restart Vite.

### Issue: "HTTP 404" 
**Solution:** File not in public folder. Check plugin logs.

### Issue: "Expected ';' but found ':'"
**Solution:** This was the old dynamic import error - now fixed with fetch() approach.

### Issue: Empty/corrupted JSON
**Solution:** 
```bash
# Verify source file is valid
cat data/complete-database.json | jq .
# Should parse without errors
```

---

## Contact

If issues persist after following this guide, check:
1. `/START_HERE.md` - Full setup instructions
2. `/VERIFICATION_CHECKLIST.md` - Complete testing checklist
3. `/Guidelines.md` - Project guidelines and architecture
