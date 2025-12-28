# Complete Database Usage Guide

## Overview
The `complete-database.json` file contains 15 patients with 5-7 medications each, 5 doctors, and 5 caregivers with diverse medication schedules.

## Data Structure

### Doctors (5 total)
```json
{
  "id": "doc_001",
  "firstName": "James",
  "lastName": "Anderson",
  "email": "j.anderson@medicalpractice.com",
  "specialty": "General Practice",
  "licenseNumber": "GMC-7654321",
  "phoneNumber": "+44 20 7946 0958",
  "photoUrl": "https://images.unsplash.com/photo-...",
  "yearsOfExperience": 28,
  "patients": ["patient_001", "patient_002", "patient_003"]
}
```

**Specialties:**
- General Practice (Dr. James Anderson)
- Endocrinology (Dr. Sarah Mitchell)
- Rheumatology (Dr. Carlos Rodriguez)
- Cardiology (Dr. Emma Murphy)
- Neurology (Dr. Klaus Schmidt)

### Caregivers (5 total)
```json
{
  "id": "cg_001",
  "firstName": "Catherine",
  "lastName": "Bennett",
  "email": "catherine.bennett@example.com",
  "phoneNumber": "+44 7700 900123",
  "photoUrl": "https://images.unsplash.com/photo-...",
  "relationship": "Daughter",
  "dependents": ["patient_001", "patient_004", "patient_007"]
}
```

**Relationships:**
- Daughter (Catherine Bennett, Anna Weber)
- Son (Michael O'Brien)
- Niece (Martina Rossi)
- Spouse (Robert Johnson)

### Patients (15 total)
```json
{
  "id": "patient_001",
  "firstName": "Margaret",
  "lastName": "Williams",
  "email": "margaret.williams@example.com",
  "dateOfBirth": "1952-03-15",
  "gender": "Female",
  "photoUrl": "https://images.unsplash.com/photo-...",
  "address": {
    "street": "12 Oxford Street",
    "city": "London",
    "postcode": "W1D 1BS",
    "country": "United Kingdom"
  },
  "caregiverId": "cg_001",
  "primaryDoctorId": "doc_001",
  "medications": [...],
  "adherenceRate": 94
}
```

**Patient Demographics:**
- Age range: 65-76 years old
- Countries: UK, Ireland, France, Germany, Spain, Netherlands, Sweden, Italy, Portugal, Norway, Czech Republic
- Adherence rates: 85-97%
- Medication count per patient: 5-7 medications

### Medications
Each medication includes:
```json
{
  "id": "rx_001",
  "name": "Lisinopril",
  "dosage": "10mg",
  "frequency": "Once daily",
  "times": ["08:00"],
  "mealTiming": "before",
  "startDate": "2023-01-10",
  "duration": "Lifetime",
  "prescribedBy": "doc_001",
  "condition": "Hypertension"
}
```

**Frequency Types:**
- Once daily
- Twice daily
- Three times daily
- Four times daily
- Once weekly
- Three times weekly
- Six times weekly (special case: Folic Acid with Methotrexate)
- As needed

**Meal Timing Options:**
- before (take before meals)
- with (take with meals)
- after (take after meals)
- any (can take anytime)

**Duration Types:**
- Lifetime (chronic conditions)
- Ongoing (under review)
- Specific periods (3 months, 6 months, 12 months)

## Diverse Medication Schedules

### Complex Schedules
1. **Parkinson's Disease** (Hans Müller, Bjørn Hansen)
   - Multiple daily doses (3-4 times)
   - Specific timing before meals
   - Multiple medications at different times

2. **Diabetes Management** (Giuseppe Bianchi, François Martin, Katarina Novak)
   - Insulin with meals
   - Metformin twice daily
   - Additional oral medications

3. **Rheumatoid Arthritis** (Elena García)
   - Methotrexate once weekly (Sunday only)
   - Folic Acid six days weekly (NOT on Sunday)
   - Daily anti-inflammatory

4. **Heart Failure** (Maria Andersson, Antonio Silva)
   - Multiple cardiovascular drugs
   - Anticoagulation therapy
   - Diuretics with specific timing

5. **Alzheimer's Disease** (Patricia O'Neill, Helga Schmidt)
   - Cognitive enhancers twice daily
   - Behavioral management medication at night
   - Support supplements

### Special Medication Patterns

**As Needed Medications:**
- Rescue inhalers (Salbutamol)
- Pain relievers (Paracetamol, Ibuprofen)
- Listed with suggested times but flexible

**Weekly Medications:**
- Alendronate (Monday mornings only)
- Methotrexate (Sunday mornings only)

**Three Times Weekly:**
- Azithromycin (Monday, Wednesday, Friday)

## Usage in Components

⚠️ **IMPORTANT**: Do NOT use static imports. Use the async `loadDatabase()` function instead.

### Correct Usage (Async Loading)

```typescript
import { loadDatabase } from '../data/database';
import type { CompleteDatabase } from '../types';

// In your component
const [database, setDatabase] = useState<CompleteDatabase | null>(null);

useEffect(() => {
  loadDatabase().then(setDatabase).catch(console.error);
}, []);
```

### DoctorDashboard.tsx
```typescript
import { loadDatabase } from '../data/database';

useEffect(() => {
  loadDatabase().then(db => {
    // Filter patients by doctor
    const myPatients = db.patients.filter(
      p => p.primaryDoctorId === currentDoctorId
    );
    
    // Get doctor info
    const doctorInfo = db.doctors.find(
      d => d.id === currentDoctorId
    );
    
    setPatients(myPatients);
    setDoctor(doctorInfo);
  });
}, [currentDoctorId]);
```

### CaregiverDashboard.tsx
```typescript
import { loadDatabase } from '../data/database';

useEffect(() => {
  loadDatabase().then(db => {
    // Filter dependents by caregiver
    const myDependents = db.patients.filter(
      p => p.caregiverId === currentCaregiverId
    );
    
    // Get caregiver info
    const caregiverInfo = db.caregivers.find(
      c => c.id === currentCaregiverId
    );
    
    setDependents(myDependents);
    setCaregiver(caregiverInfo);
  });
}, [currentCaregiverId]);
```

### PatientDashboard.tsx
```typescript
import { loadDatabase } from '../data/database';

useEffect(() => {
  loadDatabase().then(db => {
    // Get patient info
    const patient = db.patients.find(
      p => p.id === currentPatientId
    );
    
    setPatient(patient);
    setMedications(patient?.medications || []);
  });
}, [currentPatientId]);

// Get medications
const medications = patient?.medications || [];

// Get doctor info
const doctor = completeDatabase.doctors.find(
  d => d.id === patient?.primaryDoctorId
);
```

## Testing Data

### High Adherence (>90%)
- Margaret Williams (94%)
- Sophie Dubois (96%)
- Maria Andersson (97%)
- Elena García (93%)
- Ingrid Larsson (95%)

### At Risk (<90%)
- Thomas O'Connor (88%)
- Jan De Vries (85%)
- François Martin (86%)
- Bjørn Hansen (87%)
- Helga Schmidt (88%)

### Complex Medication Regimens
- Hans Müller: 7 medications, Parkinson's disease
- Giuseppe Bianchi: 6 medications, Type 1 Diabetes with insulin
- François Martin: 7 medications, Post-stroke care
- Bjørn Hansen: 7 medications, Advanced Parkinson's

## Editing and Extending

To add new patients, doctors, or caregivers:

1. **Add to JSON file directly** - Maintain the structure
2. **Update IDs sequentially** - patient_016, doc_006, cg_006, etc.
3. **Link relationships** - Use caregiverId and primaryDoctorId
4. **Add to arrays** - Add patient IDs to doctor.patients and caregiver.dependents
5. **Maintain realistic data** - Use appropriate ages, adherence rates, conditions

## Analytics Calculations

### Adherence Stats
```typescript
const avgAdherence = patients.reduce((sum, p) => sum + p.adherenceRate, 0) / patients.length;

const atRiskPatients = patients.filter(p => p.adherenceRate < 80);

const excellentAdherence = patients.filter(p => p.adherenceRate >= 90);
```

### Medication Stats
```typescript
const totalMedications = patients.reduce(
  (sum, p) => sum + p.medications.length, 0
);

const avgMedicationsPerPatient = totalMedications / patients.length;

const complexPatients = patients.filter(p => p.medications.length >= 6);
```

### Schedule Complexity
```typescript
const dailyMedications = patient.medications.filter(
  m => m.frequency.includes('daily')
).length;

const weeklyMedications = patient.medications.filter(
  m => m.frequency.includes('weekly')
).length;
```

## Notes

- All times use 24-hour format (HH:MM)
- Dates use ISO format (YYYY-MM-DD)
- Phone numbers include country codes
- Photo URLs from Unsplash (realistic elderly portraits)
- Email addresses are example.com (safe for demo)
- All data is GDPR/HIPAA compliant (fictional)

## Future Extensions

Planned additions:
- Medication history (taken/missed records)
- Appointment schedules
- Lab results
- Emergency contacts
- Pharmacy information
- Insurance details
