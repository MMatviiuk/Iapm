# Scripts Directory

## copy-database.js

Copies `complete-database.json` from `/data` to `/public/data` before dev/build.

### Usage

**Automatic (recommended):**
```bash
npm run dev    # Runs script automatically before Vite
npm run build  # Runs script automatically before build
```

**Manual:**
```bash
npm run prepare-db
# or
node scripts/copy-database.js
```

### Features

- ✅ Verifies source file exists
- ✅ Creates target directory if needed
- ✅ Compares file sizes after copy
- ✅ Shows detailed progress output
- ✅ Exits with proper error codes (0=success, 1=error)

### Output

**Success:**
```
📋 Database Copy Script
─────────────────────────
✓ Created directory: /path/to/public/data
✓ Copied complete-database.json to public/data/
  Size: 123456 bytes
─────────────────────────
```

**Error:**
```
📋 Database Copy Script
─────────────────────────
❌ Source file not found: /path/to/data/complete-database.json

Paths:
  Source: /path/to/data/complete-database.json
  Target: /path/to/public/data/complete-database.json
```

### Why This Script?

1. **ESM Compatibility** - Works with `"type": "module"` in package.json
2. **Timing Control** - Runs BEFORE Vite starts (ensures file exists)
3. **Verification** - Confirms successful copy with size check
4. **Error Handling** - Clear error messages with exit codes

### Integration

**package.json:**
```json
{
  "scripts": {
    "dev": "node scripts/copy-database.js && vite",
    "build": "node scripts/copy-database.js && tsc && vite build",
    "prepare-db": "node scripts/copy-database.js"
  }
}
```

**Flow:**
```
npm run dev
  ↓
node scripts/copy-database.js (copies file)
  ↓
vite (dev server starts)
  ↓
Browser loads database from /data/complete-database.json ✅
```

### Troubleshooting

**Issue: Script fails with ENOENT**
```bash
# Check source file exists
ls data/complete-database.json

# If not found, check working directory
pwd
```

**Issue: Permission denied (EACCES)**
```bash
# Check directory permissions
ls -ld public

# Create directory manually
mkdir -p public/data
chmod 755 public/data
```

**Issue: File size mismatch**
```bash
# Check source file integrity
cat data/complete-database.json | jq .

# If corrupted, restore from git
git checkout data/complete-database.json
```

### Related Files

- `/vite.config.ts` - Vite plugin (backup copy mechanism)
- `/public/data/.gitignore` - Ignores copied database
- `/public/data/.gitkeep` - Preserves directory in git

### Documentation

- **Complete Guide:** `/DATABASE_FIX_ESM_FINAL_NOV5_2025.md`
- **Quick Start:** `/DATABASE_FIX_QUICKSTART.md`
