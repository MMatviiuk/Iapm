# 🔧 Diagnostic Tool - Check What's Wrong

## Quick Diagnostic Checklist

Run these commands to diagnose the issue:

### 1. Check if database source exists
```bash
ls -lh data/complete-database.json
```
✅ Expected: File should exist (~150KB)  
❌ If missing: Database file is gone! Re-download the project.

### 2. Check if database is copied to public
```bash
ls -lh public/data/complete-database.json
```
✅ Expected: File should exist (~150KB)  
❌ If missing: **THIS IS THE PROBLEM!** Run `npm run prepare-db`

### 3. Check Node.js version
```bash
node --version
```
✅ Expected: v18.x or v20.x  
❌ If older: Upgrade Node.js

### 4. Check npm version
```bash
npm --version
```
✅ Expected: v9.x or v10.x  
❌ If older: Run `npm install -g npm@latest`

### 5. Check if dependencies are installed
```bash
ls -d node_modules
```
✅ Expected: Directory exists  
❌ If missing: Run `npm install`

### 6. Check if Vite is installed
```bash
npm list vite
```
✅ Expected: Shows vite version  
❌ If error: Run `npm install`

## Common Issues & Solutions

### Issue 1: HTTP 404 - Database not found
**Symptom:** Browser console shows "Failed to load database: HTTP 404"

**Solution:**
```bash
npm run prepare-db
npm run dev
```

**Why:** The database file needs to be in `public/data/` folder for Vite to serve it.

---

### Issue 2: Build Error - "Expected ';' but found ':'"
**Symptom:** Build fails with JSON parsing error

**Solution:**
```bash
# Clear cache
rm -rf dist node_modules/.vite

# Ensure database is in public folder
npm run prepare-db

# Restart dev server
npm run dev
```

**Why:** Old build cache might have incorrect module resolution.

---

### Issue 3: Module Not Found
**Symptom:** "Cannot find module" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Copy database
npm run prepare-db

# Start server
npm run dev
```

**Why:** Dependencies might be corrupted or incomplete.

---

### Issue 4: Port Already in Use
**Symptom:** "Port 5173 is already in use"

**Solution:**
```bash
# Kill process on port 5173
# Linux/Mac:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 5174
```

---

### Issue 5: Blank Page / White Screen
**Symptom:** Browser shows blank page, no errors

**Solution:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Look for 404 errors on `/data/complete-database.json`
5. If found, run `npm run prepare-db`

---

### Issue 6: Login Doesn't Work
**Symptom:** Can't login with demo credentials

**Solution:**
```bash
# Clear browser localStorage
# Open DevTools → Application → Local Storage → Clear All

# Or use incognito mode
```

**Demo credentials:**
- Email: `patient@demo.com`
- Password: `demo123`

---

### Issue 7: Charts Not Rendering
**Symptom:** Analytics page shows no charts

**Solution:**
```bash
# Check if recharts is installed
npm list recharts

# If missing, reinstall
npm install
```

---

## Health Check Script

Run this complete health check:

```bash
echo "=== Prescription Clarity Health Check ==="
echo ""
echo "1. Source database:"
ls -lh data/complete-database.json
echo ""
echo "2. Public database:"
ls -lh public/data/complete-database.json
echo ""
echo "3. Node version:"
node --version
echo ""
echo "4. npm version:"
npm --version
echo ""
echo "5. Dependencies installed:"
[ -d "node_modules" ] && echo "✅ YES" || echo "❌ NO"
echo ""
echo "6. Vite available:"
npm list vite --depth=0
echo ""
echo "=== End of Health Check ==="
```

## If Nothing Works

### Nuclear Option (Complete Reset)
```bash
# 1. Backup your work (if any)
# 2. Remove everything
rm -rf node_modules package-lock.json dist public/data

# 3. Reinstall
npm install

# 4. Copy database
npm run prepare-db

# 5. Start fresh
npm run dev
```

## Still Need Help?

1. **Check browser console**: F12 → Console tab
2. **Check terminal output**: Look for error messages
3. **Take screenshots**: Of errors in both browser and terminal
4. **Review documentation**:
   - `⚡_START_HERE_NOW.md` - Quick start guide
   - `README.md` - Full documentation
   - `DATABASE_FIX_QUICKSTART.md` - Database issues

## Contact

- **GitHub**: [MMatviiuk](https://github.com/MMatviiuk)
- **Project**: [Prescription Clarity](https://github.com/icodebits/goit-capstone-project-g5)
