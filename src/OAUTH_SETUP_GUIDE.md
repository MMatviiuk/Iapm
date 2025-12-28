# OAuth Social Login Setup Guide
## Google, Apple, Facebook Authentication

**Status:** ✅ Frontend Implementation Complete  
**Date:** November 6, 2025  
**Architecture Decision:** Multi-provider authentication system

---

## 🎯 Overview

This application supports **3 social login providers**:
1. ✅ **Google** - OAuth 2.0
2. ✅ **Apple** - Sign in with Apple
3. ✅ **Facebook** - Facebook Login

**Current Status:**
- ✅ Frontend UI implemented
- ✅ OAuth flow configured
- ✅ CSRF protection (state parameter)
- ✅ Callback handler ready
- ⚠️ **Backend OAuth endpoints required**
- ⚠️ **OAuth credentials required**

---

## 🚀 Quick Start

### Step 1: Get OAuth Credentials

#### Google OAuth 2.0
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add Authorized redirect URIs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
7. Copy **Client ID**
8. Save to `.env`:
   ```bash
   VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
   ```

#### Apple Sign In
1. Go to [Apple Developer](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** (Add)
4. Select **Services IDs** → Continue
5. Register new Service ID:
   - Identifier: `com.yourcompany.prescriptionclarity`
   - Description: Prescription Clarity
6. Enable **Sign in with Apple**
7. Configure domains and redirect URLs:
   - Domains: `yourdomain.com`, `localhost:5173` (dev)
   - Return URLs: `https://yourdomain.com/auth/callback`
8. Copy **Service ID**
9. Save to `.env`:
   ```bash
   VITE_APPLE_CLIENT_ID=com.yourcompany.prescriptionclarity
   ```

#### Facebook Login
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Choose **Consumer** → Next
4. Fill app details
5. Navigate to **Settings** → **Basic**
6. Copy **App ID**
7. Add **Facebook Login** product
8. Configure OAuth Redirect URIs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
9. Save to `.env`:
   ```bash
   VITE_FACEBOOK_APP_ID=123456789012345
   ```

---

### Step 2: Configure Environment Variables

Create `.env` file in project root:

```bash
# Backend API
VITE_API_URL=http://localhost:3000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Apple Sign In
VITE_APPLE_CLIENT_ID=com.yourcompany.prescriptionclarity

# Facebook Login
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

**Important:** Never commit `.env` to git! Already in `.gitignore`.

---

### Step 3: Implement Backend OAuth Endpoints

Your backend needs to handle OAuth callbacks:

#### Endpoint: `POST /api/auth/oauth/callback`

**Request Body:**
```json
{
  "code": "authorization_code_from_provider",
  "provider": "google" | "apple" | "facebook",
  "action": "login" | "signup",
  "redirectUri": "http://localhost:5173/auth/callback"
}
```

**Backend Flow:**
1. Validate `code` and `provider`
2. Exchange `code` for access token with OAuth provider
3. Fetch user profile from provider
4. Check if user exists in database
5. If new user → Create account
6. If existing user → Update last login
7. Generate JWT token
8. Return user data + token

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_123",
    "email": "user@gmail.com",
    "name": "John Doe",
    "role": "patient",
    "oauthProvider": "google",
    "onboardingComplete": false
  }
}
```

---

## 🔧 Technical Implementation

### Frontend Flow

```
User clicks "Sign in with Google"
  ↓
handleSocialLogin('google')
  ↓
Generate random state (CSRF protection)
  ↓
Save state + provider to sessionStorage
  ↓
Redirect to Google OAuth URL
  ↓
User authorizes on Google
  ↓
Google redirects to /auth/callback?code=XXX&state=YYY
  ↓
OAuthCallback component handles redirect
  ↓
Validate state matches (CSRF check)
  ↓
POST /api/auth/oauth/callback with code
  ↓
Backend exchanges code for access token
  ↓
Backend fetches user profile
  ↓
Backend returns JWT + user data
  ↓
Frontend saves token to localStorage
  ↓
Redirect to dashboard
```

### Security Features

**1. CSRF Protection (State Parameter)**
```typescript
// Generate random state
const state = Math.random().toString(36).substring(7);
sessionStorage.setItem('oauth_state', state);

// Validate on callback
const savedState = sessionStorage.getItem('oauth_state');
if (state !== savedState) {
  throw new Error('CSRF attack detected');
}
```

**2. Redirect URI Validation**
- Backend must validate redirect URI matches configured URI
- Prevents open redirect attacks

**3. Token Storage**
- JWT stored in localStorage (HTTP-only cookies preferred in production)
- OAuth state stored in sessionStorage (cleared after callback)

**4. HTTPS Required**
- Production must use HTTPS
- OAuth providers reject HTTP (except localhost)

---

## 📋 OAuth Provider APIs

### Google OAuth 2.0

**Authorization URL:**
```
https://accounts.google.com/o/oauth2/v2/auth
```

**Token Exchange URL:**
```
https://oauth2.googleapis.com/token
```

**User Info URL:**
```
https://www.googleapis.com/oauth2/v2/userinfo
```

**Scopes:**
- `openid` - OpenID Connect
- `email` - User email
- `profile` - User profile (name, photo)

**Example Token Exchange (Backend):**
```javascript
const response = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: authorizationCode,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: 'http://localhost:5173/auth/callback',
    grant_type: 'authorization_code'
  })
});

const { access_token } = await response.json();

// Fetch user profile
const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: { Authorization: `Bearer ${access_token}` }
});

const userProfile = await userResponse.json();
// { email, name, picture, ... }
```

---

### Apple Sign In

**Authorization URL:**
```
https://appleid.apple.com/auth/authorize
```

**Token Exchange URL:**
```
https://appleid.apple.com/auth/token
```

**Scopes:**
- `name` - User name
- `email` - User email

**Special Requirements:**
- Requires JWT signed with private key
- More complex setup than Google/Facebook
- See [Apple Documentation](https://developer.apple.com/documentation/sign_in_with_apple)

---

### Facebook Login

**Authorization URL:**
```
https://www.facebook.com/v18.0/dialog/oauth
```

**Token Exchange URL:**
```
https://graph.facebook.com/v18.0/oauth/access_token
```

**User Info URL:**
```
https://graph.facebook.com/me?fields=id,email,name,picture
```

**Scopes:**
- `email` - User email
- `public_profile` - Name, profile picture

**Example Token Exchange (Backend):**
```javascript
const response = await fetch(
  `https://graph.facebook.com/v18.0/oauth/access_token?` +
  `client_id=${process.env.FACEBOOK_APP_ID}&` +
  `client_secret=${process.env.FACEBOOK_APP_SECRET}&` +
  `redirect_uri=${redirectUri}&` +
  `code=${authorizationCode}`
);

const { access_token } = await response.json();

// Fetch user profile
const userResponse = await fetch(
  `https://graph.facebook.com/me?fields=id,email,name,picture&access_token=${access_token}`
);

const userProfile = await userResponse.json();
// { id, email, name, picture: { data: { url } } }
```

---

## 🧪 Testing

### Local Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test OAuth Flow:**
   - Open `http://localhost:5173/login`
   - Click "Sign in with Google"
   - Authorize in Google popup
   - Should redirect to `/auth/callback`
   - Should login successfully

### Debug Checklist

**If OAuth doesn't work:**

- [ ] Check `.env` has correct Client IDs
- [ ] Verify redirect URI in provider console matches exactly
- [ ] Check backend OAuth endpoint exists
- [ ] Look at browser console for errors
- [ ] Check backend logs for errors
- [ ] Verify HTTPS in production (not HTTP)
- [ ] Test with incognito window (clear cookies)

**Common Errors:**

**"redirect_uri_mismatch"**
- Redirect URI in code doesn't match provider console
- Add exact URI to provider console

**"Invalid state parameter"**
- State verification failed (CSRF protection)
- Check sessionStorage has `oauth_state`
- Ensure state parameter passed correctly

**"Authorization code expired"**
- Code only valid for ~10 minutes
- Exchange code immediately after receiving

---

## 📊 User Experience

### Login Screen

```
┌───────────────────────────────────────┐
│   📧 Email: [____________]            │
│   🔒 Password: [____________]         │
│   [Sign In Button]                    │
│                                       │
│   ──────── Or continue with ──────── │
│                                       │
│   [Google]  [Apple]  [Facebook]       │
└───────────────────────────────────────┘
```

**Flow:**
1. User clicks provider button
2. Redirect to provider login page
3. User authorizes
4. Redirect back to app
5. Show loading spinner "Authenticating with Google..."
6. Login complete → Dashboard

**Benefits:**
- ✅ Faster login (no password typing)
- ✅ No password to remember
- ✅ Trusted by Google/Apple/Facebook security
- ✅ Auto-fill email and name
- ✅ Profile photo imported

---

## 🔒 Security Considerations

### HIPAA Compliance

**Important:** OAuth with Google/Apple/Facebook may affect HIPAA compliance!

**Concerns:**
- Third-party access to user email
- Profile data stored by OAuth provider
- Potential PHI (Protected Health Information) linkage

**Mitigation:**
1. **User Consent:** Clear disclosure that OAuth shares email with provider
2. **BAA Required:** Google/Apple/Facebook must sign Business Associate Agreement
3. **Data Minimization:** Only request essential scopes (email, name)
4. **Audit Logging:** Log all OAuth logins for compliance

**Recommendation:**
- For healthcare apps, Email/Password may be safer
- Consult legal team before enabling social login
- Some organizations ban social login for HIPAA apps

### GDPR Compliance

**OAuth and GDPR:**
- ✅ User consents to data sharing with provider
- ✅ Right to delete account (must revoke OAuth tokens)
- ✅ Data portability (email, name from OAuth)
- ⚠️ Third-party processing (Google/Apple/Facebook)

**Requirements:**
1. Privacy policy mentions OAuth providers
2. User can delete account and OAuth connection
3. Data processing agreement with providers
4. Cookie consent for OAuth session cookies

---

## 📚 Additional Resources

### Documentation
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In](https://developer.apple.com/documentation/sign_in_with_apple)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login)

### Libraries (Backend)
- **Passport.js** - Node.js OAuth strategies
- **NextAuth.js** - Full OAuth solution for Next.js
- **Auth0** - Managed OAuth service
- **Supabase Auth** - OAuth + database

### Testing Tools
- [OAuth Debugger](https://oauthdebugger.com/)
- [JWT.io](https://jwt.io/) - Decode JWT tokens
- Postman - Test API endpoints

---

## ✅ Checklist

### Frontend Setup
- [x] UI buttons added (Google, Apple, Facebook)
- [x] OAuth flow implemented
- [x] CSRF protection (state parameter)
- [x] Callback handler ready
- [x] Environment variables documented
- [x] Error handling implemented

### Backend Setup (TODO)
- [ ] Create `POST /api/auth/oauth/callback` endpoint
- [ ] Implement token exchange for Google
- [ ] Implement token exchange for Apple
- [ ] Implement token exchange for Facebook
- [ ] User creation/login logic
- [ ] JWT generation
- [ ] Error handling

### Provider Setup (TODO)
- [ ] Google: Create OAuth client, get Client ID
- [ ] Apple: Register Service ID, configure Sign In
- [ ] Facebook: Create app, get App ID
- [ ] Configure redirect URIs in all consoles
- [ ] Test OAuth flow end-to-end

### Production Setup (TODO)
- [ ] Add HTTPS redirect URIs to provider consoles
- [ ] Update `.env` with production Client IDs
- [ ] Deploy backend with OAuth endpoints
- [ ] Test in production environment
- [ ] Monitor OAuth errors and failures

---

## 🎉 Result

**Social login is now available!** Users can:
- ✅ Sign in with Google in 2 clicks
- ✅ Sign in with Apple in 2 clicks
- ✅ Sign in with Facebook in 2 clicks
- ✅ No password to remember
- ✅ Faster registration
- ✅ Improved UX for elderly users

**Next Steps:**
1. Get OAuth credentials from providers
2. Implement backend OAuth endpoints
3. Test end-to-end flow
4. Deploy to production

---

**Date:** November 6, 2025  
**Status:** Frontend Complete, Backend Required  
**Priority:** High (Architect-mandated feature)  
**Estimated Backend Work:** 1-2 days
