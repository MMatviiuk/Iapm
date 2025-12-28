# Responsive Design Test Checklist

## Quick Visual Test (5 minutes)

### Chrome DevTools
1. Open Landing Page
2. Open DevTools (F12)
3. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
4. Test these sizes in order:

#### iPhone SE (375 x 667)
- [ ] Header: "Prescription Clarity" visible, buttons show "In" and "Start"
- [ ] Hero: Heading readable, buttons full width
- [ ] Stats: 3 cards stack vertically
- [ ] Features: 1 column layout
- [ ] CTA: "Start Free Trial" button readable
- [ ] Footer: 2 columns, text readable

#### iPhone 12 Pro (390 x 844)
- [ ] Header: Full "Sign In" and "Start" text visible
- [ ] Hero: All text fits without wrapping awkwardly
- [ ] Stats: Cards have adequate spacing
- [ ] Features: Icons + text aligned
- [ ] CTA: Buttons properly sized
- [ ] Footer: Links not cramped

#### iPad (768 x 1024)
- [ ] Header: Full button text "Sign In" and "Get Started"
- [ ] Hero: Larger text, 2-column layout on features
- [ ] Stats: 3 columns horizontal
- [ ] Features: 2 columns
- [ ] CTA: Horizontal button layout
- [ ] Footer: 4 columns

#### Desktop (1440 x 900)
- [ ] Header: Maximum logo size, full spacing
- [ ] Hero: Largest text, side-by-side image
- [ ] Stats: 3 columns with large numbers
- [ ] Features: 3 columns
- [ ] CTA: Large buttons with full text
- [ ] Footer: 4 columns with optimal spacing

---

## Detailed Component Test

### Header (All Sizes)
```
Mobile (320px-639px):
- Logo: 40px, flexible
- Title: Truncates if needed
- Buttons: "In" / "Start"
- No horizontal scroll

Tablet (640px-1023px):
- Logo: 48px
- Title: Full text
- Buttons: "Sign In" / "Get Started"
- Adequate spacing

Desktop (1024px+):
- Logo: 48px
- Title: Full with tagline
- Buttons: Full text, large
- Maximum spacing
```

### Hero Section
```
Mobile:
- Badge: Small, compact
- Heading: 3xl, stacks well
- Description: base size
- Buttons: Full width, stack vertically
- Trust badge: Smaller icons

Tablet:
- Heading: 5xl
- Description: xl
- Buttons: Horizontal, standard size

Desktop:
- Heading: 7xl
- Description: 2xl
- Buttons: Large, horizontal
- Image appears on right
```

### Stats Cards
```
Mobile:
- Single column
- Compact padding (p-4)
- Smaller icons (w-10)
- Text: 3xl value

Desktop:
- 3 columns
- Full padding (p-8)
- Large icons (w-12)
- Text: 5xl value
```

---

## Browser-Specific Tests

### Safari iOS
1. Open on iPhone
2. Check header doesn't zoom on input
3. Verify buttons are tappable (44px+)
4. Test in portrait and landscape
5. Verify safe area insets respected

### Chrome Android
1. Open on Android device
2. Check text doesn't overflow
3. Verify touch targets adequate
4. Test keyboard appearance
5. Check viewport meta tag working

### Desktop Browsers
1. Chrome: Test responsiveness with DevTools
2. Firefox: Verify flex layouts
3. Safari: Check webkit-specific styles
4. Edge: Verify grid support

---

## Common Issues to Watch For

### Text Overflow
- [ ] No "..." on important text
- [ ] Buttons show full text (or proper abbreviation)
- [ ] Headers don't wrap awkwardly
- [ ] No horizontal scroll

### Layout Breaks
- [ ] Cards don't squish
- [ ] Icons aligned with text
- [ ] Proper spacing maintained
- [ ] No overlapping elements

### Touch Targets
- [ ] All buttons minimum 44px high
- [ ] Links have adequate spacing
- [ ] No tiny tap areas

### Images
- [ ] Scale proportionally
- [ ] Don't cause layout shift
- [ ] Lazy load on scroll
- [ ] Alt text present

---

## Accessibility Test

### Screen Reader
- [ ] Tab through header buttons
- [ ] Navigate hero section
- [ ] Access all features
- [ ] Footer links reachable

### Keyboard Navigation
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Enter activates buttons
- [ ] Escape closes modals

### Color Contrast
- [ ] Text on backgrounds: 4.5:1 minimum
- [ ] Buttons: Adequate contrast
- [ ] Links: Distinguishable
- [ ] Dark mode: Equal contrast

---

## Performance Test

### Lighthouse (Mobile)
Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### Network Throttling
Test on:
- [ ] Fast 3G
- [ ] Slow 3G
- [ ] Offline (service worker)

### Layout Shift
- [ ] CLS < 0.1
- [ ] No content jump on load
- [ ] Images have dimensions

---

## Real Device Testing

### Priority Devices
1. **iPhone 12/13/14** (most common iOS)
   - [ ] Portrait mode
   - [ ] Landscape mode
   - [ ] Safari browser
   
2. **Samsung Galaxy S21/S22** (common Android)
   - [ ] Portrait mode
   - [ ] Landscape mode
   - [ ] Chrome browser

3. **iPad (9th gen or later)**
   - [ ] Portrait mode
   - [ ] Landscape mode
   - [ ] Safari browser

### Optional Devices
4. iPhone SE (small screen)
5. iPad Pro (large tablet)
6. Google Pixel (stock Android)
7. OnePlus/Xiaomi (custom Android)

---

## Quick Fix Guide

### Issue: Text Cut Off
```tsx
// Add truncate or adjust breakpoint
className="truncate"
className="text-base sm:text-lg"
```

### Issue: Button Too Small
```tsx
// Increase height and padding
className="h-12 sm:h-14 px-4 sm:px-6"
```

### Issue: Horizontal Scroll
```tsx
// Add overflow control
className="overflow-x-hidden max-w-full"
```

### Issue: Layout Breaks
```tsx
// Use flex with min-width
className="flex min-w-0 flex-1"
```

---

## Sign-Off Checklist

Before marking as complete:
- [ ] All screen sizes tested (320px - 2560px)
- [ ] Both orientations tested
- [ ] 3+ browsers verified
- [ ] Real devices tested (iOS + Android)
- [ ] Accessibility audit passed
- [ ] Performance metrics acceptable
- [ ] No console errors
- [ ] Dark mode tested
- [ ] Touch targets verified
- [ ] Documentation updated

---

## Emergency Rollback

If critical issues found:

```bash
# Revert LandingPage changes
git checkout HEAD~1 components/LandingPage.tsx

# Or revert specific commit
git revert <commit-hash>
```

---

**Last Updated:** November 5, 2025  
**Next Review:** Before deployment  
**Status:** Ready for testing

