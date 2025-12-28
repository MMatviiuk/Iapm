# 🧪 Test Database Loading - Quick Guide

## ⚡ Quick Test (30 seconds)

### Step 1: Stop Server
```bash
# Press Ctrl+C in terminal
```

### Step 2: Start Fresh
```bash
npm run dev
```

### Step 3: Check Console
Look for this message:
```
✓ Database loaded via direct import
```

### Step 4: Open Browser
```
http://localhost:5173
```

### Step 5: Verify
- ✅ No error messages in browser console (F12)
- ✅ Landing page loads correctly
- ✅ Can sign in with demo account

## 🎯 Expected Results

### Console Output (Good)
```
✓ Copied complete-database.json to public/data/
✓ Database loaded from public/data/complete-database.json
```

OR

```
Public folder fetch failed, using direct import (this is normal in dev)
✓ Database loaded via direct import
```

### Console Output (Bad - If You See This)
```
❌ All database loading methods failed
```

## 🔧 If Still Broken

### Quick Fix #1: Clear Cache
```bash
# Stop server (Ctrl+C)
rm -rf node_modules/.vite
npm run dev
```

### Quick Fix #2: Reinstall
```bash
# Stop server (Ctrl+C)
rm -rf node_modules
npm install
npm run dev
```

### Quick Fix #3: Check File
```bash
# Verify database file exists
ls -la data/complete-database.json

# Should show:
# -rw-r--r-- ... complete-database.json
```

## ✅ Success Criteria

| Check | Expected |
|-------|----------|
| Server starts | ✅ No errors |
| Console message | ✅ "Database loaded" |
| Browser console | ✅ No red errors |
| Landing page | ✅ Loads correctly |
| Sign in | ✅ Works with demo account |

## 📱 Demo Account Test

After server starts, test login:

1. Go to http://localhost:5173
2. Click "Sign In"
3. Enter:
   - Email: `patient@demo.com`
   - Password: `demo123`
4. Click "Sign In"
5. Should see Dashboard ✅

## 🐛 Common Issues

### Issue: "Module not found"
**Solution:**
```bash
# Check if file exists
cat data/complete-database.json | head -n 5

# Should show JSON content
```

### Issue: "Cannot parse JSON"
**Solution:**
```bash
# Validate JSON syntax
node -e "JSON.parse(require('fs').readFileSync('data/complete-database.json'))"

# Should complete without errors
```

### Issue: "404 Not Found"
**Solution:** This is normal! The direct import fallback handles this.
```
Public folder fetch failed, using direct import (this is normal in dev)
✓ Database loaded via direct import
```

## 📊 What's Loaded

The database contains:

- **15 Doctors** with specialties
- **15 Patients** with medical histories
- **100+ Medications** across all patients
- **Caregivers** managing dependents
- **Complete medical profiles**

### Verify Data Loaded

Open browser console (F12) and run:
```javascript
// This will show if database loaded
localStorage.getItem('mock_users')

// Should return JSON string with demo users
```

## 🎓 Understanding the Output

### Success Message #1
```
✓ Database loaded from public/data/complete-database.json
```
- Means: Copy script worked
- Source: `/public/data/complete-database.json`
- Performance: Optimal (static file)

### Success Message #2
```
✓ Database loaded via direct import
```
- Means: Using Vite import
- Source: `/data/complete-database.json`
- Performance: Excellent (bundled)

### Both are correct! ✅

## 🔍 Advanced Debugging

### Check Vite Dev Server
```bash
# Terminal should show:
vite v5.2.0 dev server running at:

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Check Browser Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `complete-database.json`
5. Status should be: 200 OK or not present (uses import)

### Check Database Module
Open browser console and test:
```javascript
// Import the database module
import('/data/database.ts').then(module => {
  module.loadDatabase().then(db => {
    console.log('Database loaded:', db);
    console.log('Doctors:', db.doctors.length);
    console.log('Patients:', db.patients.length);
  });
});
```

Should output:
```
Database loaded: {doctors: Array(15), patients: Array(15), ...}
Doctors: 15
Patients: 15
```

## ✨ Next Steps

Once database loads successfully:

1. ✅ Test login with demo accounts
2. ✅ Navigate to different pages
3. ✅ Add medications
4. ✅ Check analytics dashboard
5. ✅ Test all three roles

## 📞 Still Having Issues?

### Create Issue Report

If database still fails to load, check:

1. **File exists:**
   ```bash
   ls -la data/complete-database.json
   ```

2. **File is valid JSON:**
   ```bash
   cat data/complete-database.json | python -m json.tool > /dev/null && echo "Valid JSON"
   ```

3. **TypeScript config correct:**
   ```bash
   grep -A2 "resolveJsonModule" tsconfig.json
   # Should show: "resolveJsonModule": true
   ```

4. **Vite version:**
   ```bash
   npm list vite
   # Should show: vite@5.2.0 or similar
   ```

---

**Last Updated:** November 5, 2025  
**Status:** Database loading fixed via direct import  
**Action Required:** Restart dev server and test
