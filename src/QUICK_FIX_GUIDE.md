# Quick Fix Guide - Database Loading Error

## Problem
```
Error loading database: Error: HTTP 404
```

## Solution

### Option 1: Run Development Server (Recommended)
```bash
npm run dev
```

The database will automatically load using dynamic imports.

### Option 2: Manual Database Preparation (If needed)
```bash
npm run prepare-db
npm run dev
```

This manually copies the database file to the public folder.

### Option 3: Production Build
```bash
npm run build
npm run preview
```

The build process automatically handles database copying.

## What Was Fixed

1. ✅ **database.ts** - Now uses dynamic imports for development mode
2. ✅ **vite.config.ts** - Added plugin to copy database file during builds
3. ✅ **vite-env.d.ts** - Added type declarations for JSON imports
4. ✅ **package.json** - Added `prepare-db` script for manual copying

## Verification

After running `npm run dev`, you should see:
- ✅ No console errors about database loading
- ✅ Dashboard displays patient/medication data
- ✅ Caregiver dashboard shows dependents
- ✅ Doctor dashboard shows patients

## Troubleshooting

### Still getting 404 error?

1. **Clear browser cache**:
   - Press `Ctrl+Shift+Delete` (Windows/Linux)
   - Press `Cmd+Shift+Delete` (Mac)
   - Clear cached files

2. **Restart dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check file exists**:
   ```bash
   ls -la data/complete-database.json
   # Should show: -rw-r--r-- ... complete-database.json
   ```

4. **Manually copy database**:
   ```bash
   npm run prepare-db
   ```

5. **Check Vite output**:
   - Look for: `✓ Copied complete-database.json to public/data/`
   - If missing, plugin didn't run

### Database is null/undefined?

The database loads **asynchronously**. Make sure you're using:

```typescript
// ✅ CORRECT
import { loadDatabase } from '../data/database';

useEffect(() => {
  loadDatabase().then(db => {
    // Use database here
    console.log('Loaded:', db.patients.length, 'patients');
  });
}, []);
```

```typescript
// ❌ WRONG - Don't use static imports
import database from '../data/complete-database.json';
```

## Testing Different Scenarios

### Test as Patient (Myself)
- Login as: margaret.williams@example.com
- Should see: 6 medications
- Dashboard: Shows adherence 94%

### Test as Caregiver
- Login as: catherine.bennett@example.com (Catherine Bennett)
- Should see: 3 dependents (Margaret, Hans, Maria)
- Dashboard: Shows aggregated stats

### Test as Doctor
- Login as: j.anderson@medicalpractice.com (Dr. James Anderson)
- Should see: 3 patients (Margaret, Thomas, Sophie)
- Dashboard: Shows patient adherence

## File Paths

| Environment | Path | How It's Loaded |
|------------|------|----------------|
| **Development** | `/data/complete-database.json` | Dynamic `import()` |
| **Production Build** | `/public/data/complete-database.json` | Copied by plugin |
| **Production Runtime** | `/data/complete-database.json` | Fetched via HTTP |

## Related Documentation

- [DATABASE_PATH_FIX_NOV5_2025.md](/DATABASE_PATH_FIX_NOV5_2025.md) - Detailed technical explanation
- [DATABASE_USAGE.md](/data/DATABASE_USAGE.md) - How to use the database in components
- [TESTING_WITH_DATABASE.md](/TESTING_WITH_DATABASE.md) - Testing guide

---

**Last Updated**: November 5, 2025  
**Status**: ✅ Fixed  
**Breaking Changes**: None  
