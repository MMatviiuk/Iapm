# 🔧 Demo Troubleshooting Guide

## Quick Fixes for Common Demo Issues

---

## Issue 1: Dependents/Patients Not Showing

### Symptoms
- Caregiver dashboard shows 0 dependents
- Doctor dashboard shows 0 patients
- Dashboard appears empty

### Fix
```bash
# Clear localStorage and restart
1. Open browser DevTools (F12)
2. Go to Application tab → Storage → Local Storage
3. Click "Clear All"
4. Refresh page (Ctrl+R or Cmd+R)
5. Login again with demo account
```

**Alternative Fix:**
```javascript
// Run in browser console
localStorage.clear();
window.location.reload();
```

---

## Issue 2: Medications Not Loading

### Symptoms
- Patient/dependent shows 0 medications
- Medication list is empty
- "No medications found" message

### Fix
```bash
# Verify demo data is loaded
1. Open browser console (F12)
2. Type: localStorage.getItem('mock_users')
3. Should see JSON data with patients and medications
4. If null/empty, re-initialize:
```

```javascript
// Run in browser console to re-initialize demo data
import('/utils/demoData.js').then(module => {
  module.initializeDemoUsers();
  window.location.reload();
});
```

---

## Issue 3: Wrong Number of Dependents/Patients

### Symptoms
- Caregiver shows more/less than 4 dependents
- Doctor shows more/less than 10 patients
- Duplicate users appear

### Fix
```bash
# Hard reset demo data
1. Logout from application
2. Clear localStorage (F12 → Application → Local Storage → Clear All)
3. Clear cache: Ctrl+Shift+Delete (Chrome) or Cmd+Shift+Delete (Mac)
4. Close browser tab
5. Reopen and login fresh
```

---

## Issue 4: Adherence Rates Not Correct

### Symptoms
- All patients show 0% adherence
- Adherence shows as NaN or undefined
- Statistics don't match expected values

### Expected Values
- **Caregiver Average:** 93.5%
- **Doctor Average:** 91.8%
- **At-Risk Patients:** 3 (Elizabeth 87%, Susan 88%, Barbara 86%)

### Fix
```javascript
// Verify adherence data in console
const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
const caregiverAccount = users.find(u => u.email === 'caregiver@demo.com');
console.log('Caregiver dependents:', caregiverAccount?.caregiverData?.dependents);

const doctorAccount = users.find(u => u.email === 'doctor@demo.com');
console.log('Doctor patients:', doctorAccount?.doctorData?.patients);
```

---

## Issue 5: Profile Photos Not Loading

### Symptoms
- Avatars show initials instead of photos
- Images broken or 404 errors
- Generic avatars for all users

### Fix
```bash
# Photos are from Unsplash (external CDN)
# If images don't load:

1. Check internet connection
2. Verify Unsplash CDN is not blocked by firewall/proxy
3. Try different browser
4. Wait a few seconds for images to load (CDN delay)

# Temporary workaround:
# Avatars will fall back to initials (e.g., "MW" for Margaret Williams)
# This is still functional but less visually impressive
```

---

## Issue 6: Dashboard Shows "Loading..." Forever

### Symptoms
- Dashboard stuck on loading spinner
- No data appears after 10+ seconds
- Console shows errors

### Fix
```bash
# Check browser console for errors (F12)
# Look for:
# - "Cannot read property of undefined"
# - "Failed to fetch"
# - "Database not found"

# Fix 1: Reload page
Ctrl+R or Cmd+R

# Fix 2: Hard reload (clear cache)
Ctrl+Shift+R or Cmd+Shift+R

# Fix 3: Re-initialize demo data
```

```javascript
// Run in console
localStorage.clear();
window.location.href = '/';
```

---

## Issue 7: Role Switching Not Working

### Symptoms
- Can't switch from Patient → Caregiver → Doctor
- Role switcher modal doesn't open
- Dashboard doesn't change after role switch

### Fix
```bash
# Logout and login with correct account

Caregiver account:
Email: caregiver@demo.com
Password: demo123

Doctor account:
Email: doctor@demo.com
Password: demo123

Patient account (primary demo):
Email: patient@demo.com
Password: demo123
```

---

## Issue 8: Demo Accounts Don't Login

### Symptoms
- "Invalid credentials" error
- Login fails for demo accounts
- Password rejected

### Verify Credentials
```
Caregiver:
  Email: caregiver@demo.com
  Password: demo123

Doctor:
  Email: doctor@demo.com
  Password: demo123

Patient:
  Email: patient@demo.com
  Password: demo123
```

### Fix
```javascript
// Re-initialize demo users in console
localStorage.removeItem('mock_users');
window.location.reload();
// Then try logging in again
```

---

## Issue 9: Medication Details Missing

### Symptoms
- Medication shows only name, no dosage/frequency
- Instructions field empty
- Condition/prescriber missing

### Fix
```bash
# Verify demo data structure
1. Open DevTools Console (F12)
2. Run:
```

```javascript
const users = JSON.parse(localStorage.getItem('mock_users'));
const patient = users.find(u => u.email === 'patient@demo.com');
console.log('Patient medications:', patient?.patientData?.medications);
// Should show array with full medication objects
```

---

## Issue 10: Dark Mode Issues

### Symptoms
- Text not visible in dark mode
- Contrast too low
- Colors look wrong

### Fix
```bash
# Toggle dark mode
1. Click Settings icon in sidebar
2. Toggle "Dark Mode" switch
3. If still broken, try:
   - Clear cache: Ctrl+Shift+Delete
   - Hard reload: Ctrl+Shift+R
   - Try different browser
```

---

## Nuclear Option: Complete Reset

### When to Use
- Multiple issues at once
- Nothing else works
- Demo is completely broken

### Steps
```bash
# 1. Clear all browser data
- Open DevTools (F12)
- Go to Application tab
- Click "Clear site data" button
- Close browser

# 2. Clear cache
- Ctrl+Shift+Delete (Windows/Linux)
- Cmd+Shift+Delete (Mac)
- Select "All time"
- Check all boxes
- Click "Clear data"

# 3. Restart browser
- Close all tabs
- Quit browser completely
- Reopen browser

# 4. Navigate fresh
- Go to http://localhost:5173
- Login with demo account
- Demo data will auto-initialize
```

---

## Verifying Demo Data is Correct

### Run This in Browser Console
```javascript
// Check demo data integrity
const users = JSON.parse(localStorage.getItem('mock_users') || '[]');

console.log('=== DEMO DATA VERIFICATION ===');
console.log('Total users:', users.length);

const caregiver = users.find(u => u.email === 'caregiver@demo.com');
console.log('Caregiver dependents:', caregiver?.caregiverData?.dependents?.length);
// Should be 4

const doctor = users.find(u => u.email === 'doctor@demo.com');
console.log('Doctor patients:', doctor?.doctorData?.patients?.length);
// Should be 10

const allPatients = users.filter(u => u.role === 'patient');
console.log('Total patients:', allPatients.length);
// Should be 14

const totalMeds = allPatients.reduce((sum, p) => {
  return sum + (p.patientData?.medications?.length || 0);
}, 0);
console.log('Total medications:', totalMeds);
// Should be 67

if (totalMeds === 67) {
  console.log('✅ Demo data is CORRECT');
} else {
  console.log('❌ Demo data is INCORRECT - run localStorage.clear() and reload');
}
```

---

## Pre-Demo Checklist

Run this before every investor presentation:

- [ ] **Clear localStorage** (fresh start)
- [ ] **Hard reload** (Ctrl+Shift+R)
- [ ] **Login as caregiver@demo.com** → Verify 4 dependents
- [ ] **Check Margaret Williams** → Should show 8 medications
- [ ] **Login as doctor@demo.com** → Verify 10 patients
- [ ] **Check Barbara Wilson** → Should show 5 medications (Parkinson's)
- [ ] **Verify adherence stats** → Caregiver 93.5%, Doctor 91.8%
- [ ] **Check at-risk patients** → Should show 3 (Elizabeth, Susan, Barbara)
- [ ] **Test dark mode** → Toggle on/off, verify readability
- [ ] **Test responsive** → Resize window, check mobile view
- [ ] **Close unnecessary tabs** → Reduce memory usage

---

## Emergency Contacts (If Demo Breaks Mid-Presentation)

### Have These Ready
```
1. Backup browser tab already logged in
2. Second laptop/device as backup
3. Screenshots of dashboards (static fallback)
4. Video recording of demo (last resort)
```

### Stalling Tactics
```
"Let me pull up a different view..."
"I'll show you the analytics dashboard..."
"While that loads, let me explain the architecture..."
"Let's look at the medication database instead..."
```

---

## Known Issues (November 7, 2025)

### Non-Critical
1. **Photo loading delay** - Unsplash CDN may be slow (~2-3 seconds)
2. **First login slow** - Demo data initialization takes 1-2 seconds
3. **Adherence calculation** - May show decimals (93.5% instead of 93%)

### Critical (Would Break Demo)
None identified as of Nov 7, 2025

---

## Support Resources

**Developer Documentation:**
- `/Guidelines.md` - Complete guidelines
- `/🎯_INVESTOR_DEMO_READY_NOV7_2025.md` - Demo instructions
- `/📊_DEMO_DATA_SUMMARY.md` - Quick reference

**GitHub:**
- Frontend: Current repository
- Backend: https://github.com/icodebits/goit-capstone-project-g5

**Developer:**
- https://github.com/MMatviiuk

---

## Quick Command Reference

```bash
# Start application
npm run dev

# Clear cache and restart
npm run clear-cache  # If script exists
# OR
rm -rf node_modules/.vite
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Browser Console Quick Fixes

```javascript
// Clear everything and restart
localStorage.clear();
sessionStorage.clear();
window.location.href = '/';

// Check demo data
console.log(JSON.parse(localStorage.getItem('mock_users')));

// Force demo data reload
import('/utils/demoData.js').then(m => m.initializeDemoUsers());

// Check current user
console.log(JSON.parse(localStorage.getItem('mock_auth')));
```

---

**Last Updated:** November 7, 2025  
**Status:** Ready for Investor Demo  
**Confidence Level:** 95% (demo-ready)

