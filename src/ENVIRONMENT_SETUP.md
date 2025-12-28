# Environment Setup Guide

## Quick Fix for API Error ✅

If you see this error:
```
TypeError: Cannot read properties of undefined (reading 'VITE_API_URL')
```

**Solution:**

1. **Create `.env` file** in the project root:
```bash
cp .env.example .env
```

2. **Edit `.env`** with your backend URL:
```env
VITE_API_URL=http://localhost:3000/api
```

3. **Restart dev server**:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## Complete Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

**Development (local backend):**
```env
VITE_API_URL=http://localhost:3000/api
```

**Production:**
```env
VITE_API_URL=https://api.prescriptionclarity.com/api
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## Backend Integration

### Backend Repository
https://github.com/icodebits/goit-capstone-project-g5

### Starting Backend Server (if running locally)
```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:3000`

---

## Troubleshooting

### Error: "Cannot read properties of undefined"

**Cause:** Missing `.env` file or `VITE_API_URL` not defined

**Fix:**
1. Ensure `.env` file exists in project root
2. Ensure it contains: `VITE_API_URL=http://localhost:3000/api`
3. Restart dev server

### Error: "Network error" or API calls failing

**Cause:** Backend server not running or incorrect URL

**Fix:**
1. Check if backend is running on `http://localhost:3000`
2. Verify `VITE_API_URL` in `.env` matches backend URL
3. Check browser console for specific error messages

### Error: "Authorization failed"

**Cause:** Invalid or expired JWT token

**Fix:**
1. Logout and login again
2. Clear localStorage: `localStorage.clear()`
3. Check backend logs for authentication issues

---

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` | Yes |

---

## File Structure

```
/
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example           # Example environment file
├── .gitignore            # Git ignore rules
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── vite-env.d.ts         # Vite type definitions
├── package.json          # Dependencies
├── services/
│   └─�� api.ts           # API client (uses VITE_API_URL)
└── ...
```

---

## Development Workflow

### 1. First Time Setup
```bash
# Clone repository
git clone [repository-url]
cd prescription-clarity

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your backend URL
nano .env  # or use your preferred editor

# Start development server
npm run dev
```

### 2. Daily Development
```bash
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Start dev server
npm run dev
```

### 3. Before Committing
```bash
# Run type checking
npm run lint

# Build to ensure no errors
npm run build

# Test the build
npm run preview
```

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build            # Type check + build for production
npm run preview          # Preview production build locally

# Type Checking
npm run lint             # Run TypeScript type checker

# Dependencies
npm install              # Install all dependencies
npm install [package]    # Add new dependency
npm update               # Update dependencies
```

---

## Notes

- `.env` file is in `.gitignore` - never commit it!
- Use `.env.example` as a template
- Restart dev server after changing `.env`
- Backend must be running for full functionality
- Frontend can run standalone (will show API errors)

---

## Support

- **Backend Issues:** Check backend repository
- **Frontend Issues:** Check browser console
- **API Errors:** Verify `.env` configuration
- **Build Errors:** Run `npm run lint`

---

**Last Updated:** November 4, 2025
