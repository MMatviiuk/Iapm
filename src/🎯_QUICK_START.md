# 🎯 Quick Start Guide

## Step-by-Step (First Time)

```
┌─────────────────────────────────────────┐
│  STEP 1: Clone/Download Project         │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  STEP 2: Install Dependencies           │
│                                         │
│  $ npm install                          │
│                                         │
│  → This auto-copies database!           │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  STEP 3: Verify Database Copied         │
│                                         │
│  $ npm run copy-db                      │
│                                         │
│  → Ensures file is in place             │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  STEP 4: Start Dev Server               │
│                                         │
│  $ npm run dev                          │
│                                         │
│  → Opens http://localhost:5173          │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  STEP 5: Open Browser                   │
│                                         │
│  → http://localhost:5173                │
│                                         │
│  ✅ No 404 errors!                      │
└─────────────────────────────────────────┘
```

---

## Commands (Copy & Paste)

```bash
# 1. Install (first time only)
npm install

# 2. Copy database (to be safe)
npm run copy-db

# 3. Start app
npm run dev
```

---

## Expected Output

### After `npm install`:
```
added 123 packages in 5s
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
```

### After `npm run copy-db`:
```
📋 Database Copy Script
─────────────────────────
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
─────────────────────────
```

### After `npm run dev`:
```
✓ Copied complete-database.json to public/data/

  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### In Browser:
- ✅ Dashboard loads
- ✅ No 404 errors
- ✅ Data displays correctly

---

## Troubleshooting

### Error During npm install?

If you see errors, run manually:
```bash
npm run copy-db
```

### Still Getting 404?

1. Check file exists:
   ```bash
   ls -la public/data/complete-database.json
   ```

2. If missing, copy manually:
   ```bash
   npm run copy-db
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

---

## Alternative Methods

### Mac/Linux Quick Copy:
```bash
chmod +x COPY_DATABASE_NOW.sh
./COPY_DATABASE_NOW.sh
```

### Windows Quick Copy:
Double-click: `COPY_DATABASE_NOW.bat`

### Manual Copy:
```bash
mkdir -p public/data
cp data/complete-database.json public/data/
```

---

## What's Automatic Now?

✅ `npm install` → Copies database  
✅ `npm run dev` → Copies database  
✅ `npm run build` → Copies database  

You don't need to remember to copy manually!

---

## Files to Read

| Situation | File |
|-----------|------|
| Just want commands | `/RUN_THIS_FIRST.txt` |
| Step-by-step | `/✅_SIMPLE_CHECKLIST.md` |
| Having problems | `/⚠️_FIX_404_ERROR_NOW.md` |
| Want details | `/🚨_MUST_READ_DATABASE_FIX.md` |
| Don't know which file | `/📖_WHICH_FILE_TO_READ.md` |

---

## Success Checklist

- [ ] ✅ npm install completed
- [ ] ✅ Database copied (see "✓ Copied" message)
- [ ] ✅ Dev server started
- [ ] ✅ Browser opened to localhost:5173
- [ ] ✅ No 404 errors in console
- [ ] ✅ Dashboard shows data

**All checked?** You're done! 🎉

---

## Total Time: 2-3 Minutes

That's all it takes to get up and running!

---

**Need Help?** See: `/📖_WHICH_FILE_TO_READ.md`
