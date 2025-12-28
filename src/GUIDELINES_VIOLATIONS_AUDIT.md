# Guidelines Violations Audit Report

## Critical Issue: Typography Override Violations

**Problem:** Components are using Tailwind font-size and font-weight classes, which violates the Guidelines.md rule:

> "IMPORTANT: Do not output any Tailwind classes for font size (e.g. text-2xl), font weight (e.g. font-bold), or line-height (e.g. leading-none), unless the user specifically asks to change these."

## Components with Violations

### High Priority (User-Facing)

1. **Login.tsx**
   - ❌ `text-4xl sm:text-5xl font-bold` (h1 heading)
   - ❌ `text-xl sm:text-2xl` (subtitle)
   - ❌ `text-lg font-bold` (labels)
   - ❌ `text-lg` (input fields)
   - ❌ `text-base font-semibold` (forgot password link)
   - ❌ `text-xl font-bold` (submit button)
   - ❌ Multiple other instances

2. **SignUp.tsx**
   - Likely similar violations (needs audit)

3. **MainSchedule.tsx**
   - ❌ `text-xl sm:text-2xl font-semibold` (user name)
   - ❌ `text-base sm:text-lg` (date)

4. **Onboarding.tsx**
   - ❌ `text-lg sm:text-2xl` (title)
   - ❌ `text-base sm:text-xl` (headings)
   - ❌ `text-base sm:text-lg` (button text)

### Medium Priority (Shadcn UI Components)

5. **ui/alert-dialog.tsx**
   - ❌ `text-lg font-semibold` (DialogTitle)

6. **ui/dialog.tsx**
   - ❌ `text-lg leading-none font-semibold` (DialogTitle)

7. **ui/drawer.tsx**
   - ❌ `font-semibold` (DrawerTitle)

8. **ui/sheet.tsx**
   - ❌ `font-semibold` (SheetTitle)

### Low Priority (Debug/Internal)

9. **App.tsx**
   - ❌ `font-bold` (Debug panel - acceptable since it's dev-only)

## Recommended Fixes

### Strategy

Instead of explicitly setting font sizes, we should:

1. **Remove all font-size classes** (text-xl, text-2xl, etc.)
2. **Remove all font-weight classes** (font-bold, font-semibold)
3. **Remove all line-height classes** (leading-none, leading-tight)
4. **Rely on globals.css** for default typography
5. **Only override for semantic HTML** (use proper h1, h2, p tags)

### Example: Login.tsx

**Before:**
```tsx
<h1 className={`text-4xl sm:text-5xl font-bold text-center mb-3`}>
  Welcome Back
</h1>
```

**After:**
```tsx
<h1 className={`text-center mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
  Welcome Back
</h1>
```

### Example: Input Labels

**Before:**
```tsx
<Label className={`text-lg font-bold flex items-center gap-2`}>
  Email Address
</Label>
```

**After:**
```tsx
<Label className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
  Email Address
</Label>
```

### Example: Buttons

**Before:**
```tsx
<Button className="text-xl font-bold bg-blue-600">
  Sign In
</Button>
```

**After:**
```tsx
<Button className="bg-blue-600 hover:bg-blue-700">
  Sign In
</Button>
```

## Implementation Plan

### Phase 1: Critical User-Facing Components
1. ✅ Login.tsx
2. ✅ SignUp.tsx
3. ✅ MainSchedule.tsx
4. ✅ Dashboard.tsx
5. ✅ LandingPage.tsx

### Phase 2: Shadcn UI Components
1. ✅ ui/dialog.tsx
2. ✅ ui/alert-dialog.tsx
3. ✅ ui/drawer.tsx
4. ✅ ui/sheet.tsx

### Phase 3: Secondary Components
1. ✅ Onboarding.tsx
2. ✅ AddPrescription.tsx
3. ✅ EditPrescription.tsx
4. ✅ Profile.tsx
5. ✅ Settings.tsx

### Phase 4: All Other Components
1. ✅ Scan all remaining .tsx files
2. ✅ Remove violations
3. ✅ Test visual consistency

## Verification Checklist

- [ ] Remove `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, etc.
- [ ] Remove `font-thin`, `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`, etc.
- [ ] Remove `leading-none`, `leading-tight`, `leading-snug`, etc.
- [ ] Keep spacing classes (`p-4`, `gap-6`, `mb-3`, etc.)
- [ ] Keep color classes (`text-white`, `text-blue-600`, etc.)
- [ ] Keep layout classes (`flex`, `grid`, `w-full`, etc.)
- [ ] Verify button heights (`h-14 sm:h-16` for primary buttons)
- [ ] Verify icon sizes (`w-6 h-6 sm:w-8 sm:h-8`)
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1440px)

## Impact Analysis

### Before Fix
- ❌ Typography inconsistent across components
- ❌ Overriding globals.css defaults unnecessarily
- ❌ Violates project guidelines
- ❌ Harder to maintain consistent sizing
- ❌ May cause issues with base font-size (18px)

### After Fix
- ✅ Consistent typography from globals.css
- ✅ Follows project guidelines
- ✅ Easier to maintain
- ✅ Proper inheritance of base 18px font
- ✅ Semantic HTML controls sizing

## Next Steps

1. **Immediate:** Fix Login.tsx and SignUp.tsx (most critical user entry points)
2. **Short-term:** Fix all user-facing components
3. **Medium-term:** Fix Shadcn UI components
4. **Long-term:** Audit and fix all remaining components

## Notes

- **Exception:** Debug panels and development-only UI can keep typography classes
- **Exception:** If user explicitly requests specific sizing, add it
- **Important:** Always test visual appearance after removing classes
- **Important:** Ensure elderly-friendly sizing is maintained (base 18px in globals.css)

---

**Status:** 🔴 CRITICAL - Multiple violations found  
**Priority:** P0 - Must fix before production  
**Estimated Effort:** 4-6 hours for complete fix  
**Risk:** Low (removing classes, not changing structure)  

---

**Created:** November 5, 2025  
**Last Updated:** November 5, 2025
