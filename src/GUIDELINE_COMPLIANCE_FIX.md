# Guideline Compliance Fix - Typography Override Removal

## Issue Summary

**Problem:** Components were violating Guidelines.md by using Tailwind typography classes (font-size, font-weight, line-height) which should rely on globals.css defaults instead.

**Guideline Rule:**
> "IMPORTANT: Do not output any Tailwind classes for font size (e.g. text-2xl), font-weight (e.g. font-bold), or line-height (e.g. leading-none), unless the user specifically asks to change these."

---

## Fixes Applied

### Phase 1: Shadcn UI Components (✅ Complete)

These components are used throughout the entire application, so fixing them first provides the widest impact.

#### 1. `/components/ui/alert-dialog.tsx`
**Before:**
```tsx
className={cn("text-lg font-semibold", className)}
```

**After:**
```tsx
className={cn("", className)}
```

**Impact:** All AlertDialog titles now use default typography

---

#### 2. `/components/ui/dialog.tsx`
**Before:**
```tsx
className={cn("text-lg leading-none font-semibold", className)}
```

**After:**
```tsx
className={cn("", className)}
```

**Impact:** All Dialog titles now use default typography

---

#### 3. `/components/ui/drawer.tsx`
**Before:**
```tsx
className={cn("text-foreground font-semibold", className)}
```

**After:**
```tsx
className={cn("text-foreground", className)}
```

**Impact:** All Drawer titles now use default typography (kept text-foreground for theming)

---

#### 4. `/components/ui/sheet.tsx`
**Before:**
```tsx
className={cn("text-foreground font-semibold", className)}
```

**After:**
```tsx
className={cn("text-foreground", className)}
```

**Impact:** All Sheet titles now use default typography (kept text-foreground for theming)

---

## Remaining Work

### Phase 2: Critical User-Facing Components (🔴 High Priority)

These components have the most user interaction and should be fixed next:

1. **Login.tsx** - 15+ violations
   - Line 72: `text-4xl sm:text-5xl font-bold` (h1)
   - Line 77: `text-xl sm:text-2xl` (subtitle)
   - Line 100: `text-lg font-bold` (labels)
   - Line 115: `text-lg` (inputs)
   - Line 178: `text-xl font-bold` (button)
   - And 10+ more instances

2. **SignUp.tsx** - Similar violations expected

3. **MainSchedule.tsx** - 2+ violations
   - Line 416: `text-xl sm:text-2xl font-semibold`
   - Line 419: `text-base sm:text-lg`

4. **Dashboard.tsx** - Needs audit

5. **LandingPage.tsx** - Needs audit

### Phase 3: Secondary Components (🟡 Medium Priority)

6. **Onboarding.tsx** - 8+ violations
   - Multiple heading and button text overrides

7. **AddPrescription.tsx** - Needs audit
8. **EditPrescription.tsx** - Needs audit
9. **Profile.tsx** - Needs audit
10. **SettingsPage.tsx** - Needs audit

### Phase 4: All Other Components (🟢 Low Priority)

11. Scan and fix all remaining `.tsx` files
12. Verify visual consistency
13. Test on all breakpoints

---

## Why This Matters

### Benefits of Removing Typography Classes

1. **Consistency:** All typography inherits from globals.css
2. **Maintainability:** Single source of truth for font sizing
3. **Accessibility:** Base 18px font ensures elderly-friendly sizing
4. **Guidelines Compliance:** Follows project standards
5. **Simpler Code:** Less class clutter in components

### Typography Hierarchy (from globals.css)

```css
/* Base font size for body */
body {
  font-size: 18px; /* Elderly-friendly */
}

/* Semantic HTML handles sizing */
h1 { /* Large heading */ }
h2 { /* Medium heading */ }
h3 { /* Small heading */ }
p  { /* Body text at 18px */ }
label { /* Form labels */ }
button { /* Button text */ }
```

---

## Testing Plan

### Visual Regression Testing

After each component fix:

1. **Mobile (375px)**
   - [ ] Text is readable (minimum 18px effective size)
   - [ ] Headings have proper hierarchy
   - [ ] Buttons are touch-friendly (min 44px height)

2. **Tablet (768px)**
   - [ ] Text scales appropriately
   - [ ] Spacing is consistent

3. **Desktop (1440px)**
   - [ ] Text is not too small or too large
   - [ ] Professional appearance maintained

### Functional Testing

- [ ] Dialogs/Modals display correctly
- [ ] Alerts are readable
- [ ] Drawers/Sheets have proper titles
- [ ] Forms are accessible
- [ ] Buttons are clickable
- [ ] Navigation is clear

---

## Guidelines Compliance Checklist

### ✅ Allowed Classes

- **Layout:** `flex`, `grid`, `w-full`, `h-full`, etc.
- **Spacing:** `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`, `mb-3`, etc.
- **Colors:** `text-white`, `text-blue-600`, `bg-slate-900`, etc.
- **Borders:** `border`, `border-2`, `rounded-lg`, etc.
- **Responsive:** `sm:`, `md:`, `lg:` prefixes for all above

### ❌ Forbidden Classes (unless explicitly requested)

- **Font Size:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.
- **Font Weight:** `font-thin`, `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`, etc.
- **Line Height:** `leading-none`, `leading-tight`, `leading-snug`, `leading-normal`, etc.

### 🔵 Semantic HTML (Preferred)

Instead of typography classes, use proper semantic HTML:

```tsx
// ✅ Good - Let HTML semantics control size
<h1>Main Heading</h1>
<h2>Section Heading</h2>
<p>Body text</p>
<label>Form Label</label>

// ❌ Bad - Don't override with classes
<h1 className="text-4xl font-bold">Main Heading</h1>
<p className="text-lg">Body text</p>
```

---

## Migration Strategy

### Approach 1: Remove All Typography Classes

**Pros:**
- Fast
- Ensures compliance
- Consistent results

**Cons:**
- May cause visual regressions
- Requires thorough testing

### Approach 2: Gradual Replacement

**Pros:**
- Lower risk
- Can test incrementally
- Easier to identify issues

**Cons:**
- Takes longer
- Inconsistent during migration

**Recommendation:** Use Approach 1 for Shadcn components, Approach 2 for user-facing components

---

## Rollback Plan

If visual regressions occur:

1. **Check globals.css** - Ensure base typography is defined
2. **Use semantic HTML** - Change `<div>` to `<h1>`, `<h2>`, etc.
3. **Add to globals.css** - If needed, add component-specific defaults
4. **Last resort only** - Add typography classes back with comment explaining why

---

## Status

### Completed ✅
- [x] ui/alert-dialog.tsx
- [x] ui/dialog.tsx
- [x] ui/drawer.tsx
- [x] ui/sheet.tsx
- [x] Created audit report
- [x] Created fix documentation

### In Progress 🔄
- [ ] Login.tsx
- [ ] SignUp.tsx
- [ ] MainSchedule.tsx

### Pending 📋
- [ ] All other user-facing components
- [ ] Visual regression testing
- [ ] Accessibility testing
- [ ] Cross-browser testing

---

## Next Steps

1. **Immediate:**
   - Fix Login.tsx (highest user traffic)
   - Fix SignUp.tsx (critical conversion path)

2. **Short-term:**
   - Fix MainSchedule.tsx
   - Fix Dashboard.tsx
   - Fix LandingPage.tsx

3. **Medium-term:**
   - Audit and fix all remaining components
   - Update documentation with examples

4. **Long-term:**
   - Add linting rule to prevent typography classes
   - Add visual regression tests
   - Document in Guidelines.md

---

## Resources

- **Main Guidelines:** `/Guidelines.md`
- **Audit Report:** `/GUIDELINES_VIOLATIONS_AUDIT.md`
- **Fix Documentation:** This file
- **Typography Rules:** `/styles/globals.css`

---

**Status:** 🟡 IN PROGRESS (Phase 1 Complete)  
**Priority:** P0 - Critical for guidelines compliance  
**Completion:** 20% (4/20 components fixed)  
**Risk:** Low (non-breaking changes)  

---

**Created:** November 5, 2025  
**Last Updated:** November 5, 2025  
**Author:** AI Assistant  
