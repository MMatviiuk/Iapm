# 🧪 Test Social Login - NOW

## Quick Visual Test (30 seconds)

### ✅ Test 1: Buttons Visible
1. Open app → Go to Login page
2. **EXPECTED:** See 3 social login buttons:
   - 🔵 Google (with Google logo)
   - ⚫ Apple (with Apple logo)
   - 🔵 Facebook (with Facebook logo)
3. **EXPECTED:** Divider says "Or continue with"
4. ✅ **PASS:** All 3 buttons visible

---

### ✅ Test 2: Buttons Clickable
1. Click "Sign in with Google"
2. **EXPECTED:** Redirects to Google OAuth page
3. **NOTE:** Will show error if OAuth not configured yet
4. Check browser console for logs:
   ```
   🔐 Initiating google OAuth login...
   Redirect URI: http://localhost:5173/auth/callback
   State: xyz123
   ```
5. ✅ **PASS:** Redirect happens, console logs show

---

### ✅ Test 3: Mobile Responsive
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set to iPhone SE (375px)
4. **EXPECTED:** Buttons stack properly
5. **EXPECTED:** Text "Google/Apple/Facebook" visible on mobile
6. ✅ **PASS:** Responsive layout works

---

## 📋 Visual Checklist

### Login Screen Should Have:
- [x] Email input field
- [x] Password input field
- [x] "Sign In" button
- [x] Divider: "Or continue with"
- [x] Google button with logo
- [x] Apple button with logo
- [x] Facebook button with logo
- [x] All buttons 56px height (elderly-friendly)
- [x] Proper spacing between buttons

### Each Social Button Should Have:
- [x] Provider logo (SVG)
- [x] Provider name text (hidden on small screens)
- [x] Hover effect
- [x] Loading state (disabled when loading)
- [x] Proper colors (Google multi-color, Apple black, Facebook blue)

---

## 🔧 If OAuth Not Configured Yet

**This is NORMAL!** Social login requires:
1. OAuth credentials from Google/Apple/Facebook
2. Backend OAuth endpoints
3. `.env` configuration

**What happens now:**
- ✅ Buttons show correctly
- ✅ Click redirects to OAuth provider
- ❌ OAuth provider shows error (app not configured)

**Error Examples:**

**Google:**
```
Error 400: redirect_uri_mismatch
```
**Fix:** Add redirect URI to Google Console

**Apple:**
```
invalid_client
```
**Fix:** Configure Service ID in Apple Developer

**Facebook:**
```
App Not Set Up
```
**Fix:** Enable Facebook Login product

---

## 🚀 Full OAuth Setup

**To make social login WORK:**

### Step 1: Get Credentials
Follow `/OAUTH_SETUP_GUIDE.md`:
- Google: Get Client ID from Google Cloud Console
- Apple: Get Service ID from Apple Developer
- Facebook: Get App ID from Facebook Developers

### Step 2: Configure .env
Create `.env` file:
```bash
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APPLE_CLIENT_ID=com.yourcompany.app
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

### Step 3: Backend Endpoint
Implement `POST /api/auth/oauth/callback` in backend

### Step 4: Test Again
- Click "Sign in with Google"
- Should redirect to Google
- After authorization, should login successfully

---

## 📊 Expected Behavior

### Before OAuth Setup
```
User clicks "Sign in with Google"
  ↓
Redirects to Google OAuth
  ↓
Google shows: "Error 400: redirect_uri_mismatch" ❌
```

### After OAuth Setup
```
User clicks "Sign in with Google"
  ↓
Redirects to Google OAuth
  ↓
User authorizes
  ↓
Redirects to /auth/callback
  ↓
Shows "Authenticating with Google..."
  ↓
Login successful → Dashboard ✅
```

---

## 🎯 One-Liner Test

**Copy/paste to browser console on login page:**
```javascript
// Should be TRUE (social buttons exist)
console.log('Has Google button:', document.body.innerText.includes('Google'));
console.log('Has Apple button:', document.body.innerText.includes('Apple'));
console.log('Has Facebook button:', document.body.innerText.includes('Facebook'));
console.log('Has divider:', document.body.innerText.includes('Or continue with'));
```

**Expected output:**
```
Has Google button: true ✅
Has Apple button: true ✅
Has Facebook button: true ✅
Has divider: true ✅
```

---

## 🎨 Screenshot Reference

### Desktop (1440px)
```
┌──────────────────────────────────────┐
│   Email: [__________________]        │
│   Password: [__________________]     │
│   [Sign In Button]                   │
│                                      │
│   ────── Or continue with ──────    │
│                                      │
│   [G Google]  [🍎 Apple]  [f Facebook]│
└──────────────────────────────────────┘
```

### Mobile (375px)
```
┌──────────────────────┐
│ Email: [________]    │
│ Password: [_____]    │
│ [Sign In]            │
│                      │
│ ── Or continue ──   │
│                      │
│ [G]  [🍎]  [f]       │
└──────────────────────┘
```

---

## ✅ Success Criteria

**Frontend Complete** (Current Status):
- ✅ Google button visible
- ✅ Apple button visible
- ✅ Facebook button visible
- ✅ Proper logos and colors
- ✅ Click triggers OAuth redirect
- ✅ CSRF protection implemented
- ✅ Callback handler ready
- ✅ Responsive design

**Backend Pending:**
- ⏳ OAuth credentials configured
- ⏳ Backend endpoints implemented
- ⏳ Token exchange working
- ⏳ User login successful

---

**Date:** November 6, 2025  
**Status:** Frontend ✅ Complete, Backend ⏳ Pending  
**Test Time:** 30 seconds (visual check)  
**Full Setup Time:** 2-4 hours (with OAuth credentials)
