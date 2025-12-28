# Demo Accounts

This application comes pre-loaded with realistic demo data from a comprehensive European medication database.

## 🚀 Quick Login (Email/Password ONLY)

**Important:** This app uses **Email/Password authentication ONLY**. Social login (Google/Apple/Facebook) is NOT available.

### Simple Demo Accounts

All accounts use password: `demo123`

| Role | Email | Password | Name |
|------|-------|----------|------|
| **Patient** | patient@demo.com | demo123 | John Smith |
| **Caregiver** | caregiver@demo.com | demo123 | Anna Johnson |
| **Doctor** | doctor@demo.com | demo123 | Dr. Rodriguez |

**How to Login:**
1. Go to Login page
2. Enter email (e.g., `caregiver@demo.com`)
3. Enter password: `demo123`
4. Click "Sign In"

---

## 📊 Complete Database Accounts

The following accounts exist in the complete database (used for dashboards, not direct login):

All demo accounts use password: `demo123`

### Patients (15 accounts)

| Email | Name | Age | Medications | Adherence | Conditions |
|-------|------|-----|-------------|-----------|------------|
| margaret.williams@example.com | Margaret Williams | 72 | 6 | 94% | Hypertension, High cholesterol, Hypothyroidism, Osteoporosis |
| thomas.oconnor@example.com | Thomas O'Connor | 76 | 5 | 88% | Type 2 Diabetes, Hypertension, BPH |
| sophie.dubois@example.com | Sophie Dubois | 69 | 5 | 96% | GERD, Anxiety, Hypertension, Seasonal allergies |
| hans.mueller@example.com | Hans Müller | 74 | 6 | 91% | Parkinson's, Heart failure, Atrial fibrillation, Glaucoma |
| elena.garcia@example.com | Elena García | 66 | 6 | 93% | Rheumatoid arthritis, Hypertension, GERD |
| jan.devries@example.com | Jan De Vries | 71 | 5 | 85% | COPD, High cholesterol |
| maria.andersson@example.com | Maria Andersson | 68 | 5 | 97% | Atrial fibrillation, Heart failure, Edema |
| giuseppe.bianchi@example.com | Giuseppe Bianchi | 73 | 5 | 89% | Type 1 Diabetes, Diabetic nephropathy, High cholesterol |
| patricia.oneill@example.com | Patricia O'Neill | 70 | 4 | 92% | Hypertension, Post-MI, High cholesterol, GERD |
| francois.leclerc@example.com | François Leclerc | 75 | 7 | 87% | Atrial fibrillation, Heart failure, Type 2 Diabetes |
| brigitte.schmidt@example.com | Brigitte Schmidt | 69 | 6 | 95% | Hypothyroidism, Hypertension, Osteoporosis |
| antonio.martinez@example.com | Antonio Martinez | 77 | 5 | 84% | COPD, High cholesterol, Osteoarthritis |
| catherine.brown@example.com | Catherine Brown | 71 | 4 | 93% | Type 2 Diabetes, Hypertension |
| lars.nielsen@example.com | Lars Nielsen | 74 | 6 | 90% | Parkinson's, Hypertension, Depression, BPH |
| isabella.rossi@example.com | Isabella Rossi | 68 | 5 | 96% | Rheumatoid arthritis, Hypertension, Hypothyroidism |

### Caregivers (5 accounts)

| Email | Name | Relationship | Dependents |
|-------|------|--------------|------------|
| catherine.bennett@example.com | Catherine Bennett | Daughter | 3 dependents |
| michael.obrien@example.com | Michael O'Brien | Son | 2 dependents |
| martina.rossi@example.com | Martina Rossi | Niece | 2 dependents |
| anna.weber@example.com | Anna Weber | Daughter | 3 dependents |
| robert.johnson@example.com | Robert Johnson | Spouse | 4 dependents |

### Doctors (5 accounts)

| Email | Name | Specialty | Experience | Patients |
|-------|------|-----------|------------|----------|
| j.anderson@medicalpractice.com | Dr. James Anderson | General Practice | 28 years | 3 patients |
| s.mitchell@endocrineclinic.com | Dr. Sarah Mitchell | Endocrinology | 15 years | 3 patients |
| c.rodriguez@rheumatology.com | Dr. Carlos Rodriguez | Rheumatology | 22 years | 3 patients |
| e.murphy@cardiology.ie | Dr. Emma Murphy | Cardiology | 19 years | 4 patients |
| k.schmidt@neurologie.de | Dr. Klaus Schmidt | Neurology | 31 years | 3 patients |

## Features Demonstrated

### For Patients
- **Medication Management**: Add, edit, delete medications
- **Smart Scheduling**: Time-based reminders with meal timing
- **Today's View**: Daily medication schedule with completion tracking
- **Week View**: 7-day calendar with all scheduled doses
- **History**: 3-month medication history with adherence analytics
- **Achievements**: Medal system for streaks and adherence milestones
- **Print Schedule**: Printer-friendly medication calendar
- **Dark Mode**: Full dark theme support

### For Caregivers
- **Multi-Patient Dashboard**: Manage medications for multiple family members
- **Adherence Analytics**: Track overall adherence across all dependents
- **Quick Add**: Add new dependents with photo upload
- **Notifications**: Get alerts when dependents miss medications

### For Doctors
- **Patient Dashboard**: View all patients and their adherence
- **Cohort Analytics**: Identify at-risk patients
- **Medication Database**: Reference database of common medications
- **Invitation System**: Invite new patients by email

## Realistic Data

The demo database includes:
- **100+ Medications**: Real European medications (Lisinopril, Metformin, Atorvastatin, etc.)
- **Realistic Schedules**: Once daily, twice daily, weekly, as-needed dosing
- **Meal Timing**: Before/with/after meal instructions
- **Duration Tracking**: Lifetime, temporary (3-12 months), ongoing treatments
- **Multiple Conditions**: Hypertension, Diabetes, Heart disease, COPD, Arthritis, etc.
- **Adherence Patterns**: 84-97% adherence rates with realistic variability
- **Multi-Doctor Care**: Patients have primary doctors plus specialists

## Quick Start

1. **Open the app** - Navigate to the landing page
2. **Click "Try Demo"** - Instant login as Margaret Williams (72 years old)
3. **Explore Dashboard** - See 6 medications, adherence stats, next medication
4. **View Today's Schedule** - Mark medications as taken
5. **Check History** - View 3-month adherence patterns
6. **Try Other Roles** - Log out and try caregiver/doctor accounts

## Switching Accounts

To try different demo accounts:

1. Click **Sign Out** from the settings menu
2. Click **Sign In** on the landing page
3. Use any email from the tables above
4. Password: `demo123`

## Data Persistence

Demo data is loaded from `/public/data/complete-database.json` and stored in browser localStorage. Your interactions (marking medications as taken, adding new medications) are saved locally and persist across sessions.

## Resetting Demo Data

To reset to original demo data:
```javascript
localStorage.clear();
// Then refresh the page
```

Or use the "Reset to Demo Data" button in Settings (if available).

## Technical Details

- **Database File**: `/public/data/complete-database.json`
- **Data Loader**: `/utils/demoData.ts`
- **Mock API**: `/services/api.ts` (USE_DEMO_DATA = true)
- **Total Demo Users**: 25 (15 patients + 5 caregivers + 5 doctors)
- **Total Medications**: 100+ across all patients
- **Countries Represented**: UK, Ireland, France, Germany, Spain, Italy, Netherlands, Sweden

## Sample Medication Schedule (Margaret Williams)

| Time | Medication | Dosage | Meal Timing | Condition |
|------|-----------|--------|-------------|-----------|
| 07:00 | Levothyroxine | 75mcg | Before breakfast | Hypothyroidism |
| 08:00 | Lisinopril | 10mg | Before breakfast | Hypertension |
| 08:00 | Vitamin D3 | 2000 IU | With breakfast | Vitamin D deficiency |
| 12:00 | Calcium Carbonate | 500mg | With lunch | Bone health |
| 20:00 | Atorvastatin | 20mg | After dinner | High cholesterol |
| 20:00 | Calcium Carbonate | 500mg | With dinner | Bone health |
| Monday (weekly) | Alendronate | 70mg | Before breakfast | Osteoporosis |

## For Development

To disable demo data and use empty storage:
```typescript
// In /services/api.ts
const USE_DEMO_DATA = false;
```

To connect to real backend API:
```typescript
// In /services/api.ts
const USE_MOCK_API = false;

// Set environment variable
VITE_API_URL=https://api.yoursite.com/api
```

---

**Note**: This is demonstration data only. Do not use for real patient care. Always consult healthcare professionals for actual medical advice.
