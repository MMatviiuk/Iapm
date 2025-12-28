# Testing Dashboards with Complete Database

## Quick Test Guide

### 1. Test Patient Dashboard
```bash
# In App.tsx or wherever Dashboard is rendered
import completeDatabase from './data/complete-database.json';

const testPatient = completeDatabase.patients[0]; // Margaret Williams
<Dashboard 
  darkMode={darkMode}
  setCurrentPage={setCurrentPage}
  medications={testPatient.medications}
/>
```

### 2. Test Caregiver Dashboard
```typescript
// In CaregiverDashboard.tsx, replace hardcoded state with:
import completeDatabase from '../data/complete-database.json';

// Use Catherine Bennett (cg_001) as test user
const currentCaregiverId = 'cg_001';
const myDependents = completeDatabase.patients.filter(
  p => p.caregiverId === currentCaregiverId
);

// Convert to DependentData format
const dependentsData = myDependents.map(patient => ({
  id: patient.id,
  name: `${patient.firstName} ${patient.lastName}`,
  dateOfBirth: patient.dateOfBirth,
  adherence: patient.adherenceRate,
  lastCheckIn: '2 hours ago', // Calculate from real data later
  photoUrl: patient.photoUrl,
  gender: patient.gender,
  prescriptions: patient.medications.map(med => ({
    id: parseInt(med.id.replace('rx_', '')),
    medication: med.name,
    name: med.name,
    dosage: `${med.dosage} - ${med.frequency}`,
    prescribed: med.startDate,
    status: 'active' as const,
    time: med.times[0],
    daysOfWeek: {
      mon: true, tue: true, wed: true, thu: true,
      fri: true, sat: true, sun: true
    }
  }))
}));
```

### 3. Test Doctor Dashboard
```typescript
// In DoctorDashboard.tsx, replace hardcoded state with:
import completeDatabase from '../data/complete-database.json';

// Use Dr. James Anderson (doc_001) as test user
const currentDoctorId = 'doc_001';
const myPatients = completeDatabase.patients.filter(
  p => p.primaryDoctorId === currentDoctorId
);

// Convert to Patient format
const patientsData = myPatients.map(patient => ({
  id: patient.id,
  name: `${patient.firstName} ${patient.lastName}`,
  dateOfBirth: patient.dateOfBirth,
  adherence: patient.adherenceRate,
  status: patient.adherenceRate >= 90 ? 'Active' : 
          patient.adherenceRate >= 80 ? 'At Risk' : 'Critical',
  lastVisit: '2 hours ago', // Calculate from real data later
  photoUrl: patient.photoUrl,
  gender: patient.gender,
  prescriptions: patient.medications.map(med => ({
    id: parseInt(med.id.replace('rx_', '')),
    medication: med.name,
    name: med.name,
    dosage: `${med.dosage} - ${med.frequency}`,
    prescribed: med.startDate,
    status: 'active' as const,
    time: med.times[0],
    daysOfWeek: {
      mon: true, tue: true, wed: true, thu: true,
      fri: true, sat: true, sun: true
    }
  }))
}));
```

## Test Users

### Catherine Bennett (Caregiver - cg_001)
**Dependents:**
- Margaret Williams (patient_001) - 73 yrs, 6 medications, 94% adherence
- Hans Müller (patient_004) - 75 yrs, 7 medications, 91% adherence
- Maria Andersson (patient_007) - 69 yrs, 6 medications, 97% adherence

**Expected Stats:**
- 3 Dependents
- ~94% Average Adherence
- 19 Total Prescriptions

### Dr. James Anderson (Doctor - doc_001)
**Patients:**
- Margaret Williams (patient_001) - 94% adherence
- Thomas O'Connor (patient_002) - 88% adherence
- Sophie Dubois (patient_003) - 96% adherence

**Expected Stats:**
- 3 Patients
- ~93% Average Adherence
- 17 Total Prescriptions
- 0 At Risk (all above 85%)

### Dr. Emma Murphy (Cardiologist - doc_004)
**Patients:**
- Maria Andersson (patient_007) - 97% adherence
- Patricia O'Neill (patient_009) - 92% adherence
- François Martin (patient_010) - 86% adherence
- Ingrid Larsson (patient_011) - 95% adherence
- Antonio Silva (patient_012) - 90% adherence

**Expected Stats:**
- 5 Patients
- ~92% Average Adherence
- 27 Total Prescriptions
- 1 At Risk (François Martin at 86%)

## Complex Cases to Test

### 1. Parkinson's Disease
**Patient:** Hans Müller (patient_004)
**Complexity:**
- 7 medications
- 3 times daily dosing (Levodopa, Ropinirole)
- Specific timing requirements (before meals)
- Eye drops at night

### 2. Diabetes with Insulin
**Patient:** Giuseppe Bianchi (patient_008)
**Complexity:**
- 6 medications
- Insulin with meals (3x daily)
- Long-acting insulin at night
- Multiple oral medications

### 3. Rheumatoid Arthritis
**Patient:** Elena García (patient_005)
**Complexity:**
- 6 medications
- Methotrexate once weekly (Sunday only)
- Folic Acid 6 days weekly (NOT Sunday)
- As-needed pain medication

### 4. Heart Failure
**Patient:** Antonio Silva (patient_012)
**Complexity:**
- 6 medications
- Diuretic twice daily (morning/afternoon)
- Anticoagulant with dinner
- Beta blocker twice daily

### 5. Alzheimer's Disease
**Patient:** Helga Schmidt (patient_013)
**Complexity:**
- 6 medications
- Cognitive enhancers twice daily
- Evening behavioral medication
- Support supplements

## Visual Testing

### Check These Elements

#### Font Sizes
- [ ] Headings: 24-40px (text-2xl to text-5xl)
- [ ] Body text: 18-20px (text-base to text-lg)
- [ ] Small text: 16px minimum (text-base on mobile)

#### Button Sizes
- [ ] Primary actions: 56px height desktop, 48px mobile
- [ ] Secondary actions: 48px minimum
- [ ] Icon-only buttons: 48x48px minimum

#### Icon Sizes
- [ ] Action icons: 24px minimum
- [ ] Feature icons: 28-32px
- [ ] Status icons: 20-24px

#### Avatar Sizes
- [ ] List view: 56-64px
- [ ] Header: 56-64px
- [ ] Profile: 96-128px

#### Spacing
- [ ] Between cards: 8-12px
- [ ] Between sections: 16-24px
- [ ] Inside cards: 12-16px
- [ ] Button groups: 8-12px gap

#### Colors
- [ ] Text on background: 4.5:1+ contrast
- [ ] Interactive elements: Clear hover states
- [ ] Status colors: Green (success), Orange (warning), Red (danger)
- [ ] Dark mode: All colors adjusted

## Responsive Testing

### Mobile (375px)
```bash
# Test in DevTools
1. Open Chrome DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone SE (375px)
4. Test all dashboards
```

**Expected:**
- Single column layout
- Full-width buttons
- Stacked statistics
- Abbreviated text where needed
- Touch-friendly spacing (48px minimum)

### Tablet (768px)
```bash
# Test in DevTools
1. Select iPad (768px)
2. Test landscape and portrait
```

**Expected:**
- Two column layout where appropriate
- Larger avatars
- More spacing
- Full text (no abbreviations)

### Desktop (1440px)
```bash
# Test in full browser window
1. Set window to 1440px width
2. Test sidebar navigation
```

**Expected:**
- Persistent sidebar (264px)
- Three column layouts for cards
- Optimal spacing
- All features visible

## Performance Testing

### Load Times
- [ ] Initial page load: < 2 seconds
- [ ] Data render: < 500ms
- [ ] Route changes: < 300ms

### Animations
- [ ] Smooth expand/collapse
- [ ] No jank during scroll
- [ ] Transitions < 300ms

### Memory
- [ ] No memory leaks
- [ ] Efficient re-renders
- [ ] Clean component unmount

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys navigate lists

### Screen Reader
- [ ] Headings announced correctly
- [ ] Buttons have labels
- [ ] Status changes announced
- [ ] Form errors announced

### Visual
- [ ] Focus indicators visible
- [ ] Color not sole indicator
- [ ] Text resizable to 200%
- [ ] No horizontal scroll at 320px

## Browser Testing

### Required Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Safari iOS (latest)
- [ ] Chrome Android (latest)

## Bug Reporting Template

When you find an issue:

```markdown
## Bug Report

**Dashboard:** [Patient/Caregiver/Doctor]
**Test User:** [e.g., Catherine Bennett - cg_001]
**Browser:** [Chrome 119]
**Screen Size:** [1440x900]

**Issue:**
[Clear description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:**
[What should happen]

**Actual:**
[What actually happened]

**Screenshot:**
[Attach if relevant]

**Priority:** [Critical/High/Medium/Low]
```

## Success Criteria

### Critical (Must Pass)
- ✅ All data loads correctly from JSON
- ✅ Statistics calculate accurately
- ✅ No console errors
- ✅ Responsive on all breakpoints
- ✅ Accessible (keyboard, screen reader)

### Important (Should Pass)
- ✅ Smooth animations
- ✅ Proper error handling
- ✅ Loading states shown
- ✅ Dark mode works correctly
- ✅ All buttons properly sized (48px+)

### Nice to Have (Optional)
- ✅ Optimistic updates
- ✅ Offline support
- ✅ Data caching
- ✅ Advanced animations
