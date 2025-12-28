# Testing Checklist - Prescription Clarity Web SaaS

## Pre-Deployment Verification

Use this checklist before deploying to production or presenting to stakeholders.

---

## 🎯 Core Functionality

### Authentication & Registration
- [ ] **Landing Page**
  - [ ] "Get Started" button → SignUp page
  - [ ] "Sign In" button → Login page
  - [ ] All sections visible and styled correctly
  
- [ ] **Sign Up Flow**
  - [ ] Enter name, email, password
  - [ ] Password confirmation validation
  - [ ] Select role (Patient/Caregiver/Doctor)
  - [ ] **Patient only**: Date of Birth picker appears
  - [ ] **Patient only**: Gender selector appears (Male/Female/Other)
  - [ ] Terms checkbox required
  - [ ] Create Account button works
  - [ ] Redirects to onboarding
  - [ ] Demo signup button works

- [ ] **Login Flow**
  - [ ] Enter email and password
  - [ ] "Remember me" checkbox works
  - [ ] Login button works
  - [ ] Redirects to appropriate dashboard
  - [ ] "Forgot password" link present

- [ ] **Logout**
  - [ ] Logout button in sidebar (desktop)
  - [ ] Logout button in burger menu (mobile)
  - [ ] Clears session
  - [ ] Redirects to landing page

---

## 🎨 Layout & Responsiveness

### Desktop (≥1024px)
- [ ] **Sidebar Visible**
  - [ ] Logo and branding at top
  - [ ] "Active Role" section shows current role
  - [ ] Role switcher icon button present
  - [ ] All navigation items visible
  - [ ] "Add Medication" button (patient only)
  - [ ] Profile section at bottom
  - [ ] Sign Out button at bottom
  - [ ] Sidebar width: 264px
  - [ ] Navigation items highlight on active page

- [ ] **Main Content Area**
  - [ ] TopBar hidden (not visible)
  - [ ] Content fills remaining space
  - [ ] No horizontal scrollbars
  - [ ] Proper spacing and margins

### Mobile & Tablet (<1024px)
- [ ] **TopBar Visible**
  - [ ] Menu button (hamburger) on left
  - [ ] Page title in center
  - [ ] Notifications button on right
  - [ ] All buttons minimum 48px touch targets
  - [ ] Proper spacing on small screens (320px)

- [ ] **BurgerMenu**
  - [ ] Opens when menu button clicked
  - [ ] Slides in smoothly from left
  - [ ] Shows user avatar (unique, based on name+email)
  - [ ] Shows user name and email
  - [ ] Shows role badge (Patient/Caregiver/Doctor)
  - [ ] "Switch Role" button present
  - [ ] All navigation items visible
  - [ ] "Home" and "Logout" at bottom
  - [ ] Closes when navigation item clicked
  - [ ] Closes when overlay clicked
  - [ ] Closes when X button clicked
  - [ ] Backdrop blur visible
  - [ ] Menu width: 85vw (max 400px)

- [ ] **Sidebar Hidden**
  - [ ] Desktop sidebar not visible on mobile
  - [ ] No layout conflicts

### Specific Screen Sizes
Test on these exact widths:

- [ ] **320px** (iPhone SE)
  - [ ] All text readable
  - [ ] Buttons not cut off
  - [ ] Forms fit on screen
  - [ ] No horizontal scroll

- [ ] **375px** (iPhone 12, 13)
  - [ ] Optimal spacing
  - [ ] Cards stack properly

- [ ] **390px** (iPhone 14, 15)
  - [ ] All content visible
  - [ ] Touch targets comfortable

- [ ] **768px** (iPad)
  - [ ] Layout scales nicely
  - [ ] Sidebar still hidden
  - [ ] Burger menu functional

- [ ] **1024px** (iPad Pro - Breakpoint!)
  - [ ] Sidebar appears
  - [ ] TopBar/BurgerMenu disappear
  - [ ] Smooth transition

- [ ] **1440px** (MacBook)
  - [ ] Content not too stretched
  - [ ] Sidebar proportional

- [ ] **1920px** (Full HD)
  - [ ] Max-width containers work
  - [ ] No excessive whitespace

---

## 👤 User Avatars

### Avatar Generation
- [ ] **Unique Avatars**
  - [ ] Different users get different avatars
  - [ ] Same user gets same avatar (consistent)
  - [ ] Uses `generateAvatarSeed(name, email)`
  - [ ] Not just name-based (email adds uniqueness)

- [ ] **Role-Specific Styling**
  - [ ] Patient: Blue border (ring-blue-500)
  - [ ] Caregiver: Orange border (ring-orange-500)
  - [ ] Doctor: Purple border (ring-purple-500)

- [ ] **Gender Support** (if provided)
  - [ ] Male: Possible facial hair
  - [ ] Female: No facial hair
  - [ ] Other: Default styling

- [ ] **Avatar Display Locations**
  - [ ] Burger menu header (mobile)
  - [ ] Sidebar profile section (desktop)
  - [ ] Dependent cards (caregiver role)
  - [ ] Patient cards (doctor role)
  - [ ] All are 56-64px size (readable)

---

## 🔄 Role Switching

### Desktop Role Switcher
- [ ] **Sidebar "Active Role" Section**
  - [ ] Shows current role name
  - [ ] Shows role icon button (colored)
  - [ ] Click icon → Modal opens
  
- [ ] **Modal Behavior**
  - [ ] Shows all 3 roles as cards
  - [ ] Current role has checkmark
  - [ ] Each card shows: Icon, Title, Subtitle
  - [ ] Click card → Switch role
  - [ ] Current role card does nothing (already active)
  - [ ] Success toast appears
  - [ ] Modal closes automatically
  - [ ] Navigates to new dashboard

### Mobile Role Switcher
- [ ] **Burger Menu Button**
  - [ ] "Switch Role" button visible
  - [ ] Icon: RefreshCw
  - [ ] Click → Modal opens
  
- [ ] **Same Modal Behavior**
  - [ ] Works identically to desktop
  - [ ] Touch-friendly (large cards)

### Role Switch Results
Test each combination:

- [ ] **Patient → Caregiver**
  - [ ] Color changes to orange
  - [ ] Navigation updates (Dependents, Analytics, Settings)
  - [ ] Redirects to Dependents page
  - [ ] Patient data still saved

- [ ] **Patient → Doctor**
  - [ ] Color changes to purple
  - [ ] Navigation updates (Patients, Analytics, Medication Database, Settings)
  - [ ] Redirects to Patients page

- [ ] **Caregiver → Patient**
  - [ ] Color changes to blue
  - [ ] Navigation updates (Dashboard, Today, Week, etc.)
  - [ ] Redirects to Dashboard

- [ ] **Caregiver → Doctor**
  - [ ] Color changes to purple
  - [ ] Proper navigation shown

- [ ] **Doctor → Patient**
  - [ ] Color changes to blue
  - [ ] All patient features available

- [ ] **Doctor → Caregiver**
  - [ ] Color changes to orange
  - [ ] Caregiver features available

---

## 📱 Navigation

### Patient Navigation (Desktop Sidebar)
- [ ] Dashboard → Dashboard page
- [ ] Today → MainSchedule page
- [ ] Week View → WeekView page
- [ ] History → History page
- [ ] All Medications → MedicationsList page
- [ ] Notifications → NotificationsManager page
- [ ] Achievements → Rewards page
- [ ] Settings → SettingsPage
- [ ] Add Medication (blue button) → AddPrescription page
- [ ] Profile (bottom) → Profile page

### Patient Navigation (Mobile Burger Menu)
- [ ] All same items as desktop
- [ ] Home → Landing page
- [ ] Logout → Logs out and redirects

### Caregiver Navigation
- [ ] Dependents → CaregiverDashboard
- [ ] Analytics → CaregiverAnalytics
- [ ] Settings → SettingsPage

### Doctor Navigation
- [ ] Patients → DoctorDashboard
- [ ] Analytics → DoctorAnalytics
- [ ] Medication Database → MedicationReference
- [ ] Settings → SettingsPage

---

## 📝 Forms & Data Entry

### Add Medication Form
- [ ] **All Fields Present**
  - [ ] Medication Name (text)
  - [ ] Quantity per dose (number)
  - [ ] Dosage in mg (number)
  - [ ] Times per day (1, 2, or 3)
  - [ ] Time of day (Morning/Afternoon/Evening)
  - [ ] Meal timing (Before/With/After/Anytime)
  - [ ] Specific time pickers for each slot
  - [ ] Days of week (Mon-Sun checkboxes)
  - [ ] Duration (number + unit dropdown)
  - [ ] Lifetime checkbox
  - [ ] Medication photo upload

- [ ] **FIFO Time Selection**
  - [ ] Select "Twice daily"
  - [ ] Click Morning → Selected
  - [ ] Click Afternoon → Selected
  - [ ] Click Evening → Morning deselected, Evening selected
  - [ ] First selected is always removed first

- [ ] **Form Validation**
  - [ ] Empty name → Error
  - [ ] Twice daily without 2 times → Error
  - [ ] Invalid dosage → Error
  - [ ] Submit button disabled when invalid

- [ ] **Image Upload**
  - [ ] Click camera icon
  - [ ] Select image from device
  - [ ] Preview appears
  - [ ] Remove button works

### Edit Medication Form
- [ ] Opens with existing data
- [ ] All fields pre-filled
- [ ] Can modify any field
- [ ] Delete button present
- [ ] Save button updates medication
- [ ] Canceling doesn't save changes

---

## 🎨 Theming & Styling

### Dark Mode
- [ ] **Toggle Works**
  - [ ] Toggle in Settings page
  - [ ] Changes entire app theme
  - [ ] Saved to localStorage
  - [ ] Persists on reload

- [ ] **All Pages Support Dark Mode**
  - [ ] Landing page
  - [ ] Login/SignUp
  - [ ] All authenticated pages
  - [ ] Modals and dialogs
  - [ ] Forms
  - [ ] Navigation (sidebar/burger menu)

- [ ] **Color Consistency**
  - [ ] Text readable on all backgrounds
  - [ ] Borders visible
  - [ ] Icons clearly visible
  - [ ] No white text on white bg bugs

### Role Colors
- [ ] **Patient (Blue)**
  - [ ] Active nav: bg-blue-50, text-blue-600
  - [ ] Buttons: bg-blue-600
  - [ ] Borders: border-blue-500

- [ ] **Caregiver (Orange)**
  - [ ] Active nav: bg-orange-50, text-orange-600
  - [ ] Buttons: bg-orange-600
  - [ ] Borders: border-orange-500

- [ ] **Doctor (Purple)**
  - [ ] Active nav: bg-purple-50, text-purple-600
  - [ ] Buttons: bg-purple-600
  - [ ] Borders: border-purple-500

---

## ♿ Accessibility (Elderly-Friendly)

### Touch Targets
- [ ] **All Buttons**
  - [ ] Minimum 48px height on mobile
  - [ ] Minimum 56px height on desktop
  - [ ] Adequate spacing between buttons
  - [ ] No tiny clickable areas

### Typography
- [ ] **Font Sizes**
  - [ ] Base text: 18px (readable for elderly)
  - [ ] Headings: Larger and bold
  - [ ] Form labels: Clear and prominent
  - [ ] No text smaller than 14px (except metadata)

### Visual Clarity
- [ ] **Contrast**
  - [ ] Text clearly readable
  - [ ] High contrast mode supported
  - [ ] Icons visible against backgrounds

- [ ] **Icons**
  - [ ] Minimum 24px on mobile
  - [ ] Minimum 32px on desktop
  - [ ] Clear, recognizable shapes

### Interaction Feedback
- [ ] **Haptic Feedback** (on mobile devices)
  - [ ] Vibration on button clicks
  - [ ] Vibration on role switch
  - [ ] Vibration on navigation

- [ ] **Visual Feedback**
  - [ ] Buttons change on hover
  - [ ] Buttons change on active/press
  - [ ] Loading states shown
  - [ ] Success/error toasts appear

---

## 🔔 Notifications & Toasts

### Toast Messages
- [ ] **Success Toasts**
  - [ ] Medication added
  - [ ] Medication updated
  - [ ] Medication deleted
  - [ ] Role switched
  - [ ] Login successful
  - [ ] Logout successful

- [ ] **Error Toasts**
  - [ ] Form validation errors
  - [ ] API errors
  - [ ] Network errors
  - [ ] Authentication errors

- [ ] **Info Toasts**
  - [ ] Feature coming soon messages
  - [ ] Help tips

### Toast Styling
- [ ] Positioned at top-center
- [ ] Auto-dismisses after 3-5 seconds
- [ ] Close button present
- [ ] Readable in dark mode
- [ ] Multiple toasts stack properly

---

## 📊 Data & State

### Medications
- [ ] **CRUD Operations**
  - [ ] Create medication → Appears in list
  - [ ] Read medication → Details correct
  - [ ] Update medication → Changes saved
  - [ ] Delete medication → Removed from list

- [ ] **Data Persistence**
  - [ ] Refresh page → Data still there
  - [ ] Logout/Login → Data restored
  - [ ] Switch roles → Data separate per role

### User Session
- [ ] **Login State**
  - [ ] Token saved to localStorage
  - [ ] User data cached
  - [ ] Refresh doesn't log out

- [ ] **Logout State**
  - [ ] Token cleared from localStorage
  - [ ] User data cleared
  - [ ] Redirects to landing

---

## 🐛 Edge Cases & Error Handling

### Network Issues
- [ ] **Offline Mode**
  - [ ] Error message when offline
  - [ ] Graceful degradation
  - [ ] Doesn't crash app

- [ ] **Slow Connection**
  - [ ] Loading spinners shown
  - [ ] Timeout handling
  - [ ] Retry options

### Invalid Data
- [ ] **Form Validation**
  - [ ] Empty required fields → Error
  - [ ] Invalid email format → Error
  - [ ] Password mismatch → Error
  - [ ] Future date of birth → Error

- [ ] **API Errors**
  - [ ] 401 Unauthorized → Redirect to login
  - [ ] 404 Not Found → Error message
  - [ ] 500 Server Error → User-friendly message

### User Behavior
- [ ] **Rapid Clicks**
  - [ ] Double-click button → Only one submit
  - [ ] Debouncing works

- [ ] **Browser Back Button**
  - [ ] Doesn't break app
  - [ ] State preserved

- [ ] **Tab Switching**
  - [ ] Session maintained
  - [ ] Data doesn't corrupt

---

## 🚀 Performance

### Load Times
- [ ] **Initial Page Load**
  - [ ] Landing page: <2 seconds
  - [ ] Dashboard: <3 seconds
  - [ ] No blank screens

- [ ] **Navigation**
  - [ ] Page transitions: <500ms
  - [ ] Smooth, no lag

### Asset Loading
- [ ] **Images**
  - [ ] Avatars load quickly
  - [ ] Lazy loading enabled
  - [ ] No broken image icons

- [ ] **Scripts**
  - [ ] No console errors
  - [ ] No infinite loops
  - [ ] No memory leaks

---

## 📋 Final Pre-Deployment Checks

### Code Quality
- [ ] No console.log() statements (remove debug logs)
- [ ] No commented-out code
- [ ] No unused imports
- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed

### Configuration
- [ ] Environment variables set (.env)
- [ ] API URL correct (production endpoint)
- [ ] Analytics configured (if applicable)
- [ ] Error reporting configured (Sentry, etc.)

### Documentation
- [ ] README.md up to date
- [ ] Guidelines.md reflects current state
- [ ] Deployment instructions clear
- [ ] Changelog updated

### Security
- [ ] No API keys in code
- [ ] HTTPS enabled (production)
- [ ] CORS configured correctly
- [ ] Authentication tokens secure (HttpOnly cookies recommended)

---

## 🎉 Sign-Off

**Tester Name**: ___________________________  
**Date**: ___________________________  
**Version**: 2.0.0  

**Overall Status**:
- [ ] All critical tests passed
- [ ] All major features working
- [ ] Ready for production deployment
- [ ] Issues noted (see below)

**Notes / Issues Found**:
```
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
```

---

**Quick Stats**:
- Total Checks: ~250+
- Estimated Testing Time: 2-3 hours
- Roles to Test: 3 (Patient, Caregiver, Doctor)
- Screen Sizes to Test: 7 (320px, 375px, 390px, 768px, 1024px, 1440px, 1920px)

---

**Remember**: 
- Test on real devices when possible
- Use Chrome DevTools for screen size simulation
- Test both light and dark mode for every feature
- Verify elderly-friendly design (large buttons, clear text)
- Check burger menu on mobile!

---

**Last Updated**: November 4, 2025  
**Version**: 2.0.0 - Full Web SaaS Integration
