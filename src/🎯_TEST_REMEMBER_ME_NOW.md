# 🎯 Test "Remember Me" Feature NOW

## Quick Test (5 minutes)

### Test 1: Remember Me Checked ✅

```bash
1. Open http://localhost:5173
2. Click "Sign In" (if not on login page)
3. Enter: patient@demo.com / demo123
4. CHECK ☑ "Remember me for 30 days"
5. Hover over info icon (ⓘ) → See tooltip with security warning
6. Click "Sign In"
7. ✅ You're logged in to Dashboard

8. Close browser completely
9. Open http://localhost:5173 again
10. ✅ You should be AUTO-LOGGED IN (no password prompt)

11. Open DevTools → Console
12. Look for: "✅ Session restored - token valid until [date]"
13. ✅ Console shows token is valid
```

**Expected Result:** You stay logged in for 30 days without re-entering password.

---

### Test 2: Remember Me Unchecked ❌

```bash
1. Logout (if logged in)
2. Go to login page
3. Enter: caregiver@demo.com / demo123
4. UNCHECK ☐ "Remember me for 30 days"
5. Click "Sign In"
6. ✅ You're logged in

7. Open DevTools → Application → Local Storage
8. Find: authTokenExpiry
9. Convert timestamp to date (use: new Date(1731234567890))
10. ✅ Expiry should be ~24 hours from now

11. Close browser
12. Open again
13. ✅ Still logged in (within 24 hours)
```

**Expected Result:** Token expires after 1 day (not 30 days).

---

### Test 3: Tooltip Verification 📖

```bash
1. Go to login page
2. Hover mouse over info icon (ⓘ) next to checkbox
3. ✅ Tooltip appears with:
   - "Stay logged in on this device for 30 days"
   - Benefits listed (3 bullet points)
   - Security warning (⚠️)
4. Move mouse away
5. ✅ Tooltip disappears

6. (On mobile/tablet)
7. Tap info icon
8. ✅ Tooltip shows on tap
9. Tap outside
10. ✅ Tooltip closes
```

**Expected Result:** Tooltip provides clear explanation and security warning.

---

### Test 4: Logout Clears Session 🚪

```bash
1. Login with Remember Me checked
2. Open DevTools → Application → Local Storage
3. ✅ See: authToken, authTokenExpiry, rememberedEmail

4. Click Settings → Logout (or user menu → Sign Out)
5. Refresh Local Storage view
6. ✅ authToken - REMOVED
7. ✅ authTokenExpiry - REMOVED
8. ✅ rememberedEmail - REMOVED

9. Refresh page
10. ✅ Back to login screen (not auto-logged in)
```

**Expected Result:** Logout clears ALL session data completely.

---

### Test 5: Token Expiry Check ⏰

```bash
1. Login with Remember Me checked
2. Open DevTools → Application → Local Storage
3. Find authTokenExpiry value (e.g., 1731234567890)

4. Open Console
5. Type: localStorage.setItem('authTokenExpiry', Date.now() - 1000)
6. Press Enter (sets expiry to 1 second ago)

7. Refresh page
8. ✅ Console shows: "⚠️ Session expired - please login again"
9. ✅ authToken removed from localStorage
10. ✅ authTokenExpiry removed from localStorage
11. ✅ You're on login screen (not auto-logged in)
```

**Expected Result:** Expired tokens are automatically detected and cleared.

---

### Test 6: Email Prefill 📧

```bash
1. Login as: patient@demo.com / demo123
2. CHECK ☑ "Remember me for 30 days"
3. Click "Sign In"
4. Logout

5. Return to login page
6. ✅ Email field pre-filled with "patient@demo.com"
7. ✅ Remember Me checkbox is CHECKED

8. Change email to "doctor@demo.com"
9. UNCHECK ☐ Remember Me
10. Login
11. Logout

12. Return to login page
13. ✅ Email field is EMPTY (no prefill)
14. ✅ Remember Me checkbox is UNCHECKED
```

**Expected Result:** Email prefill works only when Remember Me was checked.

---

## Visual Checklist ✅

### UI Elements
- [ ] Checkbox visible and functional
- [ ] Info icon (ⓘ) visible next to label
- [ ] Label text: "Remember me for 30 days"
- [ ] Tooltip appears on hover/tap
- [ ] Tooltip has HTML formatting (bold, bullets)
- [ ] Tooltip includes security warning
- [ ] Dark mode: Tooltip styled correctly

### Functionality
- [ ] Checking box → Token lasts 30 days
- [ ] Unchecking box → Token lasts 1 day
- [ ] Auto-login works on browser restart
- [ ] Expired tokens cleared automatically
- [ ] Logout clears all session data
- [ ] Email prefill works when checked
- [ ] Console logs show correct expiry time

### Accessibility
- [ ] Info icon is 18px (easily visible)
- [ ] Tooltip is readable (18px font)
- [ ] Touch target ≥48×48px (WCAG AAA)
- [ ] Keyboard accessible (tab to checkbox)
- [ ] Screen reader friendly (aria-label)

---

## Expected Console Output

### On Login (Remember Me Checked):
```
🔐 App.tsx handleLogin called: {email: "patient@demo.com", rememberMe: true}
Calling api.login...
Mock login attempt: patient@demo.com rememberMe: true
Login successful: patient@demo.com Token expires in 30 day(s)
✅ Login successful - Remember Me: ON (30 days)
Login API response: {token: "...", expiresAt: 1733826567890, user: {...}}
Welcome back, John Smith!
Login complete, redirecting to: dashboard
```

### On App Restart (Within 30 Days):
```
✅ Session restored - token valid until 12/10/2025, 3:22:47 PM
```

### On Token Expiry:
```
⚠️ Session expired - please login again
```

### On Logout:
```
✅ Logged out - all session data cleared
Signed out successfully
```

---

## Common Issues & Fixes

### Issue 1: Tooltip Not Showing
**Symptom:** Info icon visible but no tooltip on hover  
**Fix:** 
- Check TooltipProvider wraps the form
- Verify imports: `import { TooltipProvider } from './ui/tooltip'`
- Check browser console for errors

### Issue 2: Auto-Login Not Working
**Symptom:** Must login every time despite checking Remember Me  
**Fix:** 
- Open DevTools → Application → Local Storage
- Check if authToken and authTokenExpiry exist
- Verify expiry timestamp is in future: `new Date(expiryValue)`
- Check console for "Session restored" message

### Issue 3: Token Expires Too Soon
**Symptom:** Logged out after 1 day even though Remember Me was checked  
**Fix:** 
- Check if rememberMe flag is passed to API
- Console log should show: `rememberMe: true`
- Backend should return expiresAt 30 days in future
- Verify: `localStorage.getItem('authTokenExpiry')`

### Issue 4: Email Not Prefilled
**Symptom:** Email field empty even after checking Remember Me  
**Fix:** 
- Verify rememberedEmail in localStorage
- Check LoginEnhanced saves email on successful login
- Console log: `localStorage.getItem('rememberedEmail')`

---

## Success Criteria ✅

**Feature is working correctly when:**
- [x] Checkbox and tooltip render on login page
- [x] Tooltip explains feature with security warning
- [x] Checking box → Token valid for 30 days
- [x] Unchecking box → Token valid for 1 day
- [x] Browser restart → Auto-login (within expiry)
- [x] Expired token → Automatic logout
- [x] Manual logout → All data cleared
- [x] Email prefill works correctly
- [x] Console logs confirm behavior
- [x] No errors in browser console

---

## Quick Debug Commands

### Check Token Info
```javascript
// In browser console
console.log('Token:', localStorage.getItem('authToken'));
console.log('Expiry:', localStorage.getItem('authTokenExpiry'));
console.log('Expiry Date:', new Date(parseInt(localStorage.getItem('authTokenExpiry'))));
console.log('Is Valid?', Date.now() < parseInt(localStorage.getItem('authTokenExpiry')));
```

### Check Remembered Email
```javascript
console.log('Remembered Email:', localStorage.getItem('rememberedEmail'));
```

### Force Token Expiry
```javascript
// Make token expire immediately
localStorage.setItem('authTokenExpiry', Date.now() - 1000);
location.reload();
```

### Clear All Session Data
```javascript
localStorage.removeItem('authToken');
localStorage.removeItem('authTokenExpiry');
localStorage.removeItem('rememberedEmail');
location.reload();
```

---

## Demo Accounts

Use these for testing:

**Patient:**
- Email: `patient@demo.com`
- Password: `demo123`

**Caregiver:**
- Email: `caregiver@demo.com`
- Password: `demo123`

**Doctor:**
- Email: `doctor@demo.com`
- Password: `demo123`

---

## Estimated Test Time

**Quick Test:** 5 minutes (Tests 1-2)  
**Full Test:** 15 minutes (All 6 tests)  
**Regression Test:** 30 minutes (All tests + edge cases)

---

## ✅ Sign-Off

When all tests pass, check off:

- [ ] Test 1: Remember Me Checked ✅
- [ ] Test 2: Remember Me Unchecked ✅
- [ ] Test 3: Tooltip Verification ✅
- [ ] Test 4: Logout Clears Session ✅
- [ ] Test 5: Token Expiry Check ✅
- [ ] Test 6: Email Prefill ✅
- [ ] No console errors
- [ ] Feature ready for production

**Tested by:** _____________  
**Date:** November 7, 2025  
**Status:** ✅ PASSED / ❌ FAILED

---

**Happy Testing!** 🚀
