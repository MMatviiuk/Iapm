# 🆘 EMERGENCY FIX - HTTP 404 Error

## THE PROBLEM

You're seeing:
```
Error: HTTP 404
Error: Failed to load database
```

## THE SOLUTION (30 SECONDS)

**You MUST run this command RIGHT NOW:**

```bash
npm run copy-db
```

**That's it!** This copies the database file to where the browser can access it.

---

## Why This Happened

You edited `/public/data/.gitkeep` but that file is just a placeholder.

The **actual database file** (`complete-database.json`) needs to be **copied** from `/data/` to `/public/data/`.

---

## Step-by-Step Fix

### Step 1: Open Terminal
Open your terminal in the project folder

### Step 2: Run Copy Command
```bash
npm run copy-db
```

### Step 3: Verify Success
You should see:
```
📋 Database Copy Script
─────────────────────────
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
─────────────────────────
```

### Step 4: Start App
```bash
npm run dev
```

### Step 5: Check Browser
Open http://localhost:5173

**NO MORE 404 ERRORS!** ✅

---

## Alternative Methods (if npm doesn't work)

### Mac/Linux - Direct Copy:
```bash
cp data/complete-database.json public/data/complete-database.json
```

### Windows - Direct Copy:
```cmd
copy data\complete-database.json public\data\complete-database.json
```

### Using Scripts:
**Mac/Linux:**
```bash
chmod +x COPY_DATABASE_NOW.sh
./COPY_DATABASE_NOW.sh
```

**Windows:**
Double-click: `COPY_DATABASE_NOW.bat`

---

## Verify the Fix

After copying, check the file exists:

**Mac/Linux:**
```bash
ls -lh public/data/complete-database.json
```

**Windows:**
```cmd
dir public\data\complete-database.json
```

You should see a file with size ~100-200KB

---

## Still Not Working?

### Check 1: Node.js Installed?
```bash
node --version
```
Should show v18+ or v20+

### Check 2: In Project Directory?
```bash
pwd  # Mac/Linux
cd   # Windows
```
Should show the project folder path

### Check 3: Source File Exists?
```bash
ls data/complete-database.json
```
If missing → **CRITICAL PROBLEM** - file was deleted!

### Check 4: Permissions?
```bash
sudo chown -R $USER:$USER public/
npm run copy-db
```

---

## Future Runs

**Good News:** After this one-time manual copy, the database will be copied **automatically** every time you run:
- `npm install` 
- `npm run dev`
- `npm run build`

You only need to do this manual fix **ONCE**!

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run copy-db` | Copy database manually |
| `npm run dev` | Start app (auto-copies first) |
| `ls public/data/` | Check if file exists |

---

## TL;DR

```bash
npm run copy-db
npm run dev
```

**Done!** 🎉

---

**Still stuck?** Read: `/RUN_THIS_FIRST.txt`
