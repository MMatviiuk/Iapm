# Quick Test Guide - November 5, 2025

## 🎯 Priority Testing

### 1. Test Switch Role (2 minutes)

**Desktop:**
```
1. Log in
2. Click role icon in sidebar (circular button with user icon)
3. Modal opens? ✅
4. Select different role
5. Dashboard changes? ✅
6. Toast appears? ✅
```

**Mobile:**
```
1. Log in
2. Click hamburger menu
3. Click "Switch Role" button
4. Modal opens? ✅
5. Select role
6. Menu closes? ✅
7. Dashboard updates? ✅
```

---

### 2. View History Demo (1 minute)

```
1. Click bug icon (bottom-right corner)
2. Click "History Demo" (green button)
3. See charts and stats? ✅
4. Check adherence ~85-92%? ✅
5. See 4 medications? ✅
```

---

### 3. Test Collapsible Navigation (1 minute)

**Patient Role:**
```
1. Switch to Patient role
2. See 3 sections in sidebar? ✅
   - Overview
   - Tracking
   - Personal
3. Click section header to collapse ✅
4. Click again to expand ✅
```

**Caregiver/Doctor:**
```
1. Switch to Caregiver
2. See simple list (no sections)? ✅
3. Switch to Doctor
4. See simple list? ✅
```

---

## 📊 Expected Results

### Switch Role
- ✅ Modal opens smoothly
- ✅ Current role highlighted (colored border + checkmark)
- ✅ Role changes update entire UI
- ✅ Toast notification: "Switched to [Role]"

### History Demo
- ✅ Overall adherence: 85-92%
- ✅ Line chart (30 days)
- ✅ Bar chart (12 weeks)
- ✅ 4 progress bars (medications)
- ✅ Skip reasons list
- ✅ ~450 total entries

### Navigation
- ✅ Patient: 3 collapsible sections
- ✅ Caregiver: 3 items (no sections)
- ✅ Doctor: 4 items (no sections)
- ✅ No scrolling needed

---

## 🐛 If Something Breaks

### Switch Role Not Working
- Check browser console for errors
- Verify you're logged in
- Try refreshing page
- Clear localStorage and log in again

### History Demo Not Showing
- Make sure `NODE_ENV=development`
- Check debug panel is visible
- Try navigating directly: `setCurrentPage('history-demo')`

### Navigation Collapsed
- Click section headers to expand
- All sections open by default

---

## ✅ Quick Checklist

- [ ] Switch role on desktop works
- [ ] Switch role on mobile works
- [ ] History demo loads
- [ ] Charts display correctly
- [ ] Adherence ~85-92%
- [ ] Patient navigation has 3 sections
- [ ] Sections collapse/expand
- [ ] Caregiver has simple list
- [ ] Doctor has simple list
- [ ] Dark mode works
- [ ] Mobile responsive

---

## 📱 Screen Sizes to Test

- [ ] Mobile: 375px width
- [ ] Tablet: 768px width
- [ ] Desktop: 1440px width

---

## 🎨 Visual Checks

- [ ] All text readable (18px base)
- [ ] Buttons large enough (56px+)
- [ ] Icons visible (28px+)
- [ ] High contrast
- [ ] No text cutoff
- [ ] Proper spacing

---

## ⏱️ Total Time: ~5 minutes

**Priority:** High  
**Complexity:** Low  
**Risk:** Low

---

For detailed testing: See `/TESTING_INSTRUCTIONS.md`  
For bug reporting: See `/FUNCTIONALITY_TEST_REPORT.md`

**Last Updated:** November 5, 2025
