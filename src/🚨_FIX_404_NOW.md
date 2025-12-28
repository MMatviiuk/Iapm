# 🚨 FIX HTTP 404 ERROR - NOW

## Error
```
❌ Failed to load database: Error: HTTP 404
```

## Cause
Database not copied to `public/data/` directory.

---

## ⚡ QUICK FIX (10 seconds)

### Option 1: Automatic (BEST)

**Stop the server (Ctrl+C), then run:**

```bash
npm run prepare-db
npm run dev
```

### Option 2: Use Script

**Mac/Linux:**
```bash
./quick-fix.sh
```

**Windows:**
```cmd
quick-fix.bat
```

### Option 3: Manual

**Mac/Linux:**
```bash
mkdir -p public/data
cp data/complete-database.json public/data/
npm run dev
```

**Windows:**
```cmd
mkdir public\data 2>nul
copy data\complete-database.json public\data\
npm run dev
```

---

## ✅ Verification

After fix, you should see:

```
📋 Database Copy Script
─────────────────────────
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
─────────────────────────

VITE v5.x.x ready in xxx ms
```

In browser console (F12):
```
✓ Database loaded from public/data/complete-database.json
```

---

## 🔧 Why This Happened

NPM scripts (`npm run dev`, `npm run build`) automatically copy the database.

**BUT:** If you ran Vite directly (`vite`) or cleaned `public/data/`, the file is missing.

---

## 🎯 Correct Startup

**ALWAYS use:**
```bash
npm run dev       # For development
npm run build     # For production build
```

**DON'T use:**
```bash
vite              # ❌ Skips database copy
vite build        # ❌ Skips database copy
```

---

## 📋 Diagnostics

If error persists:

1. **Check source file:**
   ```bash
   ls -lh data/complete-database.json
   ```
   Should be ~120KB

2. **Check public directory:**
   ```bash
   ls -lh public/data/
   ```
   Should contain `complete-database.json`

3. **Force copy:**
   ```bash
   npm run prepare-db
   ```

4. **Clear cache:**
   ```bash
   rm -rf node_modules/.vite dist
   npm run dev
   ```

---

## ✅ Success!

Database loaded → Ready to work!

**Test login:**
- Email: `patient@demo.com`
- Password: `demo123`

---

**Date:** November 5, 2025  
**Fix:** Automatic copy via npm scripts
