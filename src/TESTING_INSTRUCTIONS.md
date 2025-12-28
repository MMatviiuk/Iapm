# Testing Instructions - November 5, 2025

## Quick Start Testing

### 1. Switch Role Functionality

**Desktop (Sidebar):**
1. Log in to the application
2. Look for the circular role icon in the sidebar (top section with "Active Role")
3. Click the icon (shows User/Users/Stethoscope icon based on current role)
4. Modal should open with 3 role cards
5. Current role should be highlighted with colored border and checkmark
6. Click a different role card
7. Toast notification should appear: "Switched to [Role Name]"
8. Modal should close
9. Dashboard should update to show new role's interface
10. Sidebar navigation items should update

**Mobile (Burger Menu):**
1. Log in to the application
2. Click hamburger menu (three lines) in top bar
3. Burger menu should slide in from left
4. Click "Switch Role" button (with refresh icon)
5. Modal should open with 3 role cards
6. Current role highlighted
7. Select different role
8. Toast notification appears
9. Modal closes
10. Burger menu closes
11. Dashboard updates

**Expected Behavior:**
- ✅ Modal opens smoothly with animation
- ✅ Current role has colored border (blue/orange/purple)
- ✅ Clicking same role closes modal without changing anything
- ✅ Clicking different role shows toast and switches
- ✅ Backdrop click closes modal
- ✅ X button closes modal
- ✅ Keyboard Escape closes modal (Radix UI default)

---

### 2. View Medication History Demo

**Access via Debug Panel:**
1. Make sure you're in development mode (`NODE_ENV=development`)
2. Click the floating debug button (bug icon) in bottom-right corner
3. Debug panel should open
4. Click "History Demo" button (green button)
5. Should navigate to History Demo page

**What You'll See:**
- **Header:** "Medication History Demo" title
- **4 Stat Cards:**
  - Overall adherence % (should be ~85-92%)
  - Last 7 days % 
  - Doses taken (total count)
  - Missed doses (count)
  
- **Daily Adherence Chart:** 
  - Line chart showing last 30 days
  - Blue line with dots
  - Y-axis 0-100%
  - X-axis shows dates
  
- **Weekly Adherence Chart:**
  - Bar chart showing last 12 weeks
  - Green bars
  - Y-axis 0-100%
  - X-axis "Week 1", "Week 2", etc.
  
- **Adherence by Medication:**
  - Progress bars for each medication
  - Different colors (blue, orange, purple, green, amber)
  - Shows percentage and dose counts
  
- **Skip Reasons:**
  - Top 5 reasons for missed doses
  - Numbered list with counts
  - Examples: "Forgot", "Away from home", etc.
  
- **Sample Data Info:**
  - Blue info card at bottom
  - Lists 4 medications (Lisinopril, Metformin, Vitamin D, Atorvastatin)
  - Shows 90-day period
  - Total entries count (~450 entries)

**Verify Realistic Patterns:**
- Adherence should be 85-92% overall (not 100%)
- Weekend days should have slightly lower adherence
- Morning medications should have higher adherence than evening
- Vitamin D should have lower adherence than blood pressure meds
- Charts should show natural variation (not flat lines)

---

### 3. Test Collapsible Navigation

**Desktop Sidebar - Patient Role:**
1. Switch to Patient role
2. Sidebar should show 3 section headers:
   - Overview (with chevron icon)
   - Tracking (with chevron icon)
   - Personal (with chevron icon)
3. All sections should be expanded by default
4. Click "Overview" header
   - Section should collapse
   - Chevron should change from up to down
   - Dashboard, Today, Week View items should hide
5. Click "Overview" again
   - Section should expand
   - Items should reappear
6. Try collapsing all 3 sections
   - All navigation items should be hidden
   - Only headers visible
7. Expand all sections again

**Desktop Sidebar - Caregiver/Doctor Roles:**
1. Switch to Caregiver role
2. Should see simple list (NO collapsible sections)
3. Items: Dependents, Analytics, Settings
4. Switch to Doctor role
5. Simple list: Patients, Analytics, Medication Database, Settings

**Mobile Burger Menu:**
1. Same behavior as desktop
2. Patient role has 3 collapsible sections
3. Caregiver/Doctor have simple lists

**Verify:**
- ✅ Sections collapse/expand smoothly
- ✅ Chevron icons rotate correctly
- ✅ Active page highlight persists when collapsed
- ✅ Click on navigation item works when expanded
- ✅ Large touch targets (56px height minimum)
- ✅ No scrolling needed with all sections expanded

---

## Manual Testing Checklist

### Authentication
- [ ] Sign up with new account
- [ ] Login with existing account
- [ ] Logout clears token
- [ ] Protected pages redirect to login when not authenticated
- [ ] Token persists across page refresh

### Navigation - Desktop
- [ ] Sidebar visible on screens > 1024px
- [ ] All navigation items clickable
- [ ] Active page highlighted
- [ ] Role-specific navigation shown
- [ ] "Add Medication" button only for Patient role
- [ ] Profile button at bottom works
- [ ] Sign Out button works

### Navigation - Mobile
- [ ] Sidebar hidden on screens < 1024px
- [ ] Top bar shows hamburger button
- [ ] Burger menu slides in from left
- [ ] User profile shown at top
- [ ] Navigation items work
- [ ] Menu closes on item click
- [ ] Menu closes on backdrop click

### Role Switching
- [x] Desktop: Role icon opens modal
- [x] Mobile: Switch Role button opens modal
- [x] Modal shows all roles
- [x] Current role highlighted
- [x] Role switch updates dashboard
- [x] Toast notification on switch
- [x] Modal closes properly

### Patient Dashboard
- [ ] Shows today's medications
- [ ] Shows adherence stats
- [ ] Shows upcoming doses
- [ ] Charts display correctly
- [ ] Add Medication button works

### Today's Schedule
- [ ] Shows all today's medications
- [ ] Organized by time
- [ ] Mark as Taken works
- [ ] Taken status shows checkmark
- [ ] Missed status highlighted

### Add Medication
- [ ] All form fields present
- [ ] FIFO time picker works
- [ ] Meal timing selector
- [ ] Duration selector
- [ ] Form validation
- [ ] Submit saves medication
- [ ] Cancel returns to previous page

### Edit Medication
- [ ] Pre-fills with medication data
- [ ] Can modify all fields
- [ ] Save updates medication
- [ ] Cancel discards changes
- [ ] Delete shows confirmation

### History
- [ ] Shows past medication records
- [ ] Grouped by date
- [ ] Shows taken/missed status
- [ ] Calendar navigation works
- [ ] Filter options work

### Achievements
- [ ] Shows earned medals
- [ ] Progress bars for incomplete
- [ ] Achievement details on click
- [ ] Sound effects (if enabled)

### Settings
- [ ] Profile info editable
- [ ] Photo upload works
- [ ] Notification toggles
- [ ] Dark mode toggle
- [ ] Privacy settings
- [ ] Account deletion

### Caregiver Features
- [ ] Dependents list displays
- [ ] Add dependent works
- [ ] Dependent details view
- [ ] Analytics shows aggregate data
- [ ] Can manage dependent medications

### Doctor Features
- [ ] Patients list displays
- [ ] Invite patient works
- [ ] Patient details view
- [ ] Analytics shows cohort data
- [ ] Medication database accessible
- [ ] At-risk patients highlighted

### Dark Mode
- [ ] Toggle in settings works
- [ ] All pages styled correctly
- [ ] Charts readable
- [ ] Proper contrast
- [ ] Icons visible

### Responsive Design
- [ ] Mobile (320px width)
- [ ] Mobile (375px width)
- [ ] Mobile (390px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1024px width)
- [ ] Desktop (1440px width)
- [ ] Desktop (1920px width)

### Performance
- [ ] Pages load < 2 seconds
- [ ] Smooth animations
- [ ] No layout shifts
- [ ] Images load properly
- [ ] API calls complete quickly

### Accessibility
- [ ] Button sizes 56px+ (desktop)
- [ ] Button sizes 48px+ (mobile)
- [ ] Font size 18px base
- [ ] High contrast ratios
- [ ] Keyboard navigation
- [ ] Screen reader compatible

---

## Integration Testing with History Generator

### Setup Test Data
```typescript
import { generateMedicationHistory } from './utils/medicationHistoryGenerator';

// Create test medications
const testMeds = [
  {
    id: '1',
    name: 'Aspirin 100mg',
    dosage: '100mg',
    frequency: 'Once daily',
    timesPerDay: ['08:00'],
    active: true,
    startDate: '2024-08-05',
  },
  {
    id: '2',
    name: 'Metformin 500mg',
    dosage: '500mg',
    frequency: 'Twice daily',
    timesPerDay: ['08:00', '20:00'],
    active: true,
    startDate: '2024-08-05',
  }
];

// Generate history
const history = generateMedicationHistory(testMeds);
console.log(`Generated ${history.length} history entries`);
```

### Test Adherence Calculations
```typescript
import { calculateAdherenceStats } from './utils/medicationHistoryGenerator';

const stats = calculateAdherenceStats(history);
console.log('Overall:', stats.overall);
console.log('Last 7 Days:', stats.last7Days);
console.log('Last 30 Days:', stats.last30Days);
console.log('Total Doses:', stats.totalDoses);
console.log('Taken:', stats.takenDoses);
console.log('Missed:', stats.missedDoses);

// Verify
assert(stats.overall > 0 && stats.overall <= 100);
assert(stats.takenDoses + stats.missedDoses === stats.totalDoses);
```

### Test Chart Data
```typescript
import { getDailyAdherenceData, getWeeklyAdherenceData } from './utils/medicationHistoryGenerator';

const dailyData = getDailyAdherenceData(history, 30);
console.log(`Daily data points: ${dailyData.length}`); // Should be 30

const weeklyData = getWeeklyAdherenceData(history, 12);
console.log(`Weekly data points: ${weeklyData.length}`); // Should be 12

// Verify
assert(dailyData.length === 30);
assert(weeklyData.length === 12);
```

---

## Automated Testing (Future)

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Visual Regression
```bash
npm run test:visual
```

---

## Bug Reporting

When reporting bugs, include:
1. **Environment:** Browser, OS, screen size
2. **Steps to Reproduce:** Exact sequence
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happened
5. **Screenshots:** If visual issue
6. **Console Errors:** If any errors shown

---

## Known Issues

None at this time.

---

**Last Updated:** November 5, 2025
**Testing Status:** In Progress
**Priority Fixes:** Switch Role button (COMPLETED ✅)
