# ✈️ Pre-Flight Checklist - Before Starting App

## Essential Steps (Do This First!)

### ☐ 1. Database File Copied?

**Check if file exists:**
```bash
ls public/data/complete-database.json
```

**If you see "No such file"** → Run this:
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

---

### ☐ 2. Dependencies Installed?

**Check if node_modules exists:**
```bash
ls node_modules
```

**If missing** → Run this:
```bash
npm install
```

**This will also auto-copy the database!**

---

### ☐ 3. Environment Variables Set?

**Optional** - Only needed for backend integration:

Create `.env` file:
```bash
VITE_API_URL=http://localhost:3000/api
```

**For demo mode (no backend):** Skip this step!

---

## Ready to Launch?

### Start the app:
```bash
npm run dev
```

### Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### Open browser:
```
http://localhost:5173
```

---

## Verification Checklist

Open the app and verify:

- [ ] ✅ Page loads (no blank screen)
- [ ] ✅ No 404 errors in browser console (F12)
- [ ] ✅ No "Failed to load database" error
- [ ] ✅ Landing page shows correctly
- [ ] ✅ Can navigate to Login/Sign Up
- [ ] ✅ Dashboard loads with mock data

---

## Common Problems

### Problem: HTTP 404 Error
**Solution:** Database not copied
```bash
npm run copy-db
```

### Problem: Port 5173 already in use
**Solution:** Kill process or use different port
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Problem: Module not found
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Vite build error
**Solution:** Clear cache
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## Quick Command Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies (auto-copies DB) |
| `npm run copy-db` | Copy database manually |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check TypeScript errors |

---

## File Structure Check

Your project should have these files:

```
✅ /data/complete-database.json        (source)
✅ /public/data/complete-database.json (copy - created by script)
✅ /package.json
✅ /vite.config.ts
✅ /scripts/copy-database.js
✅ /App.tsx
✅ /main.tsx
✅ /index.html
```

---

## Emergency Fixes

### If nothing works:

1. **Full reset:**
   ```bash
   rm -rf node_modules package-lock.json public/data
   npm install
   npm run copy-db
   npm run dev
   ```

2. **Check Node.js version:**
   ```bash
   node --version
   # Should be v18+ or v20+
   ```

3. **Check npm version:**
   ```bash
   npm --version
   # Should be v9+ or v10+
   ```

4. **Clone fresh copy:**
   ```bash
   git clone <repository-url>
   cd prescription-clarity
   npm install
   npm run dev
   ```

---

## Success Indicators

You know it's working when you see:

✅ **Terminal:**
```
✓ Copied complete-database.json to public/data/
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

✅ **Browser:**
- Landing page loads
- No red errors in console
- Can click "Sign Up" and see registration form
- Can navigate around the app

✅ **Network Tab (F12):**
- `/data/complete-database.json` → Status 200 OK
- No 404 errors

---

## Ready to Develop?

**All checks passed?** You're good to go! 🚀

**Still having issues?** See:
- `/🆘_EMERGENCY_FIX.md` - Emergency troubleshooting
- `/DATABASE_COPY_DIAGRAM.txt` - Visual explanation
- `/START_APP.txt` - Ultra-simple instructions

---

**Last Updated:** November 5, 2025
