# Elderly-Friendly Quick Reference Guide

⚡ **Fast Copy-Paste Patterns for Elderly Optimization**

---

## 🎯 Core Principles

```
✅ Minimum text:    18px (text-lg)
✅ Minimum button:  56px (h-14)
✅ Minimum icon:    24px (size={24})
✅ Minimum spacing: 16px (gap-4)
✅ Font weight:     semibold (all interactive)
✅ Icon stroke:     2.5 (always)
✅ Line height:     tight/relaxed (explicit)
```

---

## 📝 Common Patterns

### Page Header
```tsx
<h1 className="text-xl sm:text-2xl font-semibold leading-tight text-gray-900 dark:text-white">
  Page Title
</h1>
```

### Section Header
```tsx
<h2 className="text-lg sm:text-xl font-semibold leading-tight mb-4 text-gray-900 dark:text-white">
  Section Title
</h2>
```

### Body Text
```tsx
<p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
  Body paragraph text
</p>
```

---

## 🔘 Buttons

### Primary Button
```tsx
<button
  type="submit"
  className="w-full h-14 sm:h-16 bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl font-semibold rounded-lg touch-manipulation leading-tight"
>
  Submit
</button>
```

### Secondary Button
```tsx
<button
  className="h-14 sm:h-16 px-6 sm:px-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-lg sm:text-xl font-semibold rounded-lg touch-manipulation leading-tight"
>
  Cancel
</button>
```

### Icon Button
```tsx
<button
  className="min-w-[56px] min-h-[56px] p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center touch-manipulation"
  aria-label="Action"
>
  <Icon size={28} strokeWidth={2.5} className="text-gray-700 dark:text-gray-300" />
</button>
```

---

## 📝 Form Elements

### Text Input
```tsx
<div className="space-y-2">
  <label className="block text-lg sm:text-xl font-semibold leading-tight text-gray-900 dark:text-white">
    Label
  </label>
  <input
    type="text"
    className="w-full h-14 sm:h-16 px-4 sm:px-5 text-lg sm:text-xl border-2 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
    placeholder="Placeholder"
  />
</div>
```

### Select Dropdown
```tsx
<select
  className="w-full h-14 sm:h-16 px-4 sm:px-5 text-lg sm:text-xl border-2 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Checkbox
```tsx
<div className="flex items-center gap-4">
  <input
    type="checkbox"
    className="w-6 h-6 sm:w-7 sm:h-7 border-2 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 touch-manipulation"
    id="checkbox-id"
  />
  <label htmlFor="checkbox-id" className="text-lg sm:text-xl leading-tight cursor-pointer">
    Checkbox label
  </label>
</div>
```

### Toggle Switch
```tsx
<button
  onClick={handleToggle}
  className={`relative inline-flex h-8 w-14 sm:h-9 sm:w-16 items-center rounded-full transition-colors touch-manipulation ${
    enabled ? 'bg-blue-600' : 'bg-gray-300'
  }`}
  aria-label="Toggle"
>
  <span
    className={`inline-block h-6 w-6 sm:h-7 sm:w-7 transform rounded-full bg-white transition-transform ${
      enabled ? 'translate-x-7 sm:translate-x-8' : 'translate-x-1'
    }`}
  />
</button>
```

---

## 🎴 Cards

### Basic Card
```tsx
<div className="p-5 sm:p-6 rounded-xl border-2 bg-white dark:bg-gray-800">
  <h3 className="text-lg sm:text-xl font-semibold leading-tight text-gray-900 dark:text-white mb-2">
    Card Title
  </h3>
  <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
    Card description
  </p>
</div>
```

### Icon Card
```tsx
<div className="p-5 sm:p-6 rounded-xl border-2 bg-white dark:bg-gray-800">
  <div className="flex items-center gap-4">
    <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
      <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
    </div>
    <div className="flex-1">
      <h3 className="text-lg sm:text-xl font-semibold leading-tight text-gray-900 dark:text-white">
        Title
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
        Description
      </p>
    </div>
  </div>
</div>
```

### Clickable Card
```tsx
<button
  onClick={handleClick}
  className="w-full p-5 sm:p-6 rounded-xl border-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation text-left min-h-[88px]"
>
  <div className="flex items-center gap-4">
    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
      <Icon size={28} strokeWidth={2.5} className="text-blue-600" />
    </div>
    <div className="flex-1">
      <h3 className="text-lg sm:text-xl font-semibold leading-tight text-gray-900 dark:text-white">
        Card Title
      </h3>
      <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
        Card subtitle
      </p>
    </div>
  </div>
</button>
```

---

## 🎨 Icons

### Standard Icon Usage
```tsx
import { Icon } from 'lucide-react';

// Minimum (24px)
<Icon size={24} strokeWidth={2.5} />

// Recommended (28px)
<Icon size={28} strokeWidth={2.5} />

// Large (32px)
<Icon size={32} strokeWidth={2.5} />

// With Tailwind (alternative)
<Icon className="w-7 h-7" strokeWidth={2.5} />
```

---

## 📐 Spacing

### Form Spacing
```tsx
<form className="space-y-5 sm:space-y-6">
  {/* Form fields with gap */}
</form>
```

### List Spacing
```tsx
<div className="space-y-3 sm:space-y-4">
  {/* List items */}
</div>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 gap-4 sm:gap-5">
  {/* Cards */}
</div>
```

### Flex Items
```tsx
<div className="flex items-center gap-4 sm:gap-5">
  {/* Flex children */}
</div>
```

---

## 🎭 Dark Mode

### Text Colors
```tsx
// Headers
className="text-gray-900 dark:text-white"

// Body
className="text-gray-600 dark:text-gray-400"

// Muted
className="text-gray-500 dark:text-gray-500"
```

### Background Colors
```tsx
// Page background
className="bg-[#E8F4F8] dark:bg-gray-900"

// Card background
className="bg-white dark:bg-gray-800"

// Button background
className="bg-gray-100 dark:bg-gray-700"
```

### Border Colors
```tsx
className="border-gray-200 dark:border-gray-700"
```

---

## ⚠️ Common Mistakes

### ❌ DON'T
```tsx
// Too small
<button className="h-11 text-sm">Button</button>
<Icon size={16} />
<p className="text-xs">Text</p>

// No font weight
<button>Click</button>
<label>Name</label>

// No stroke width
<Icon size={24} />

// No line height
<h1 className="text-xl">Title</h1>

// Small spacing
<div className="space-y-2 gap-1">
```

### ✅ DO
```tsx
// Adequate size
<button className="h-14 sm:h-16 text-lg sm:text-xl font-semibold leading-tight">
  Button
</button>
<Icon size={24} strokeWidth={2.5} />
<p className="text-base sm:text-lg leading-relaxed">Text</p>

// Always font-semibold on interactive
<button className="font-semibold">Click</button>
<label className="font-semibold">Name</label>

// Always strokeWidth
<Icon size={28} strokeWidth={2.5} />

// Always line height
<h1 className="text-xl sm:text-2xl leading-tight">Title</h1>

// Adequate spacing
<div className="space-y-5 gap-4">
```

---

## 🚀 Quick Checklist

Before committing:

```
[ ] All text ≥ 18px (text-lg minimum)
[ ] All buttons ≥ 56px (h-14 minimum)
[ ] All icons ≥ 24px (size={24} minimum)
[ ] All icons have strokeWidth={2.5}
[ ] All buttons/labels have font-semibold
[ ] All text has leading-tight or leading-relaxed
[ ] All interactive elements have touch-manipulation
[ ] All spacing ≥ 16px (gap-4, space-y-5)
[ ] Dark mode classes added
[ ] Responsive (sm:) prefixes used
```

---

## 📏 Size Reference

### Text Sizes
```
text-lg      = 18px  ✅ Minimum
text-xl      = 20px  ✅ Good
text-2xl     = 24px  ✅ Headers
text-3xl     = 30px  ✅ Page titles
text-4xl     = 36px  ✅ Hero sections

text-base    = 16px  ⚠️ Only with sm:text-lg
text-sm      = 14px  ❌ Avoid
text-xs      = 12px  ❌ Never use
```

### Button Heights
```
h-14         = 56px  ✅ Standard
h-16         = 64px  ✅ Primary
h-12         = 48px  ⚠️ Secondary only

h-11         = 44px  ❌ Too small
h-10         = 40px  ❌ Never use
```

### Icon Sizes
```
size={32}    = 32px  ✅ Best
size={28}    = 28px  ✅ Good
size={24}    = 24px  ✅ Minimum

size={20}    = 20px  ❌ Too small
size={16}    = 16px  ❌ Never use
```

### Spacing
```
gap-5        = 20px  ✅ Best
gap-4        = 16px  ✅ Good
gap-3        = 12px  ⚠️ Tight

gap-2        = 8px   ❌ Too tight
gap-1        = 4px   ❌ Never use
```

---

## 🔗 Links

- Full guide: `/ELDERLY_FRIENDLY_OPTIMIZATION.md`
- Progress: `/ELDERLY_OPTIMIZATION_PROGRESS.md`
- Complete report: `/COMPLETE_ELDERLY_OPTIMIZATION.md`
- Guidelines: `/guidelines/Guidelines.md`

---

**Quick Tip:** Copy this file to your second monitor for easy reference while coding! 💡
