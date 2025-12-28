/**
 * Enhanced Analytics Data Generator for Caregiver & Doctor Analytics
 * Generates realistic 3-month medication histories with 5-8 medications per patient
 */

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  mealTiming: 'before' | 'with' | 'after' | 'any';
  form: string;
}

interface IntakeRecord {
  date: string;
  medicationId: string;
  scheduled: string;
  taken: boolean;
  takenAt?: string;
  skippedReason?: string;
}

interface PatientMedicationHistory {
  patientId: string;
  patientName: string;
  medications: Medication[];
  intakeHistory: IntakeRecord[];
  adherenceRate: number;
}

// Expanded European medication database (realistic meds for elderly patients)
const MEDICATION_POOL = [
  // Cardiovascular (common for elderly)
  { name: 'Ramipril', dosage: '5mg', form: 'Tablet', times: ['08:00'], mealTiming: 'with' as const, condition: 'Hypertension' },
  { name: 'Bisoprolol', dosage: '5mg', form: 'Tablet', times: ['08:00'], mealTiming: 'with' as const, condition: 'Heart failure' },
  { name: 'Atorvastatin', dosage: '20mg', form: 'Tablet', times: ['20:00'], mealTiming: 'after' as const, condition: 'High cholesterol' },
  { name: 'Aspirin', dosage: '75mg', form: 'Tablet', times: ['08:00'], mealTiming: 'with' as const, condition: 'Cardiovascular protection' },
  { name: 'Clopidogrel', dosage: '75mg', form: 'Tablet', times: ['08:00'], mealTiming: 'any' as const, condition: 'Blood clot prevention' },
  { name: 'Warfarin', dosage: '5mg', form: 'Tablet', times: ['18:00'], mealTiming: 'any' as const, condition: 'Atrial fibrillation' },
  { name: 'Amlodipine', dosage: '5mg', form: 'Tablet', times: ['08:00'], mealTiming: 'any' as const, condition: 'Hypertension' },
  
  // Diabetes
  { name: 'Metformin', dosage: '1000mg', form: 'Tablet', times: ['08:00', '20:00'], mealTiming: 'with' as const, condition: 'Type 2 Diabetes' },
  { name: 'Glimepiride', dosage: '2mg', form: 'Tablet', times: ['08:00'], mealTiming: 'before' as const, condition: 'Type 2 Diabetes' },
  { name: 'Insulin Glargine', dosage: '20 units', form: 'Injection', times: ['22:00'], mealTiming: 'any' as const, condition: 'Diabetes' },
  
  // Gastric
  { name: 'Omeprazole', dosage: '20mg', form: 'Capsule', times: ['07:30'], mealTiming: 'before' as const, condition: 'GERD' },
  { name: 'Lansoprazole', dosage: '30mg', form: 'Capsule', times: ['07:00'], mealTiming: 'before' as const, condition: 'Gastritis' },
  
  // Pain/Inflammation
  { name: 'Paracetamol', dosage: '500mg', form: 'Tablet', times: ['08:00', '14:00', '20:00'], mealTiming: 'any' as const, condition: 'Pain relief' },
  { name: 'Ibuprofen', dosage: '400mg', form: 'Tablet', times: ['08:00', '20:00'], mealTiming: 'with' as const, condition: 'Inflammation' },
  
  // Respiratory
  { name: 'Salbutamol', dosage: '100mcg', form: 'Inhaler', times: ['08:00', '20:00'], mealTiming: 'any' as const, condition: 'COPD' },
  { name: 'Montelukast', dosage: '10mg', form: 'Tablet', times: ['20:00'], mealTiming: 'any' as const, condition: 'Asthma' },
  
  // Neurological
  { name: 'Levodopa', dosage: '100/25mg', form: 'Tablet', times: ['08:00', '14:00', '20:00'], mealTiming: 'before' as const, condition: 'Parkinsons disease' },
  { name: 'Donepezil', dosage: '10mg', form: 'Tablet', times: ['20:00'], mealTiming: 'with' as const, condition: 'Alzheimers disease' },
  
  // Thyroid
  { name: 'Levothyroxine', dosage: '50mcg', form: 'Tablet', times: ['07:00'], mealTiming: 'before' as const, condition: 'Hypothyroidism' },
  
  // Vitamins/Supplements (common for elderly)
  { name: 'Vitamin D3', dosage: '1000 IU', form: 'Capsule', times: ['08:00'], mealTiming: 'with' as const, condition: 'Bone health' },
  { name: 'Calcium', dosage: '500mg', form: 'Tablet', times: ['08:00', '20:00'], mealTiming: 'with' as const, condition: 'Osteoporosis prevention' },
  { name: 'Omega-3', dosage: '1000mg', form: 'Capsule', times: ['08:00'], mealTiming: 'with' as const, condition: 'Heart health' },
  { name: 'Vitamin B12', dosage: '1000mcg', form: 'Tablet', times: ['08:00'], mealTiming: 'any' as const, condition: 'Energy support' },
  
  // Mental Health
  { name: 'Sertraline', dosage: '50mg', form: 'Tablet', times: ['08:00'], mealTiming: 'any' as const, condition: 'Depression' },
  { name: 'Lorazepam', dosage: '1mg', form: 'Tablet', times: ['20:00'], mealTiming: 'any' as const, condition: 'Anxiety' },
];

const SKIP_REASONS = [
  'Forgot to take',
  'Felt better, skipped dose',
  'Side effects experienced',
  'Away from home',
  'Medication ran out',
  'Sleeping, missed alarm',
];

/**
 * Generate realistic adherence profile
 */
function generateAdherenceProfile(): { rate: number; consistency: 'excellent' | 'good' | 'fair' | 'poor' } {
  const rand = Math.random();
  if (rand > 0.75) {
    return { rate: 90 + Math.random() * 10, consistency: 'excellent' }; // 90-100%
  } else if (rand > 0.45) {
    return { rate: 75 + Math.random() * 15, consistency: 'good' }; // 75-90%
  } else if (rand > 0.15) {
    return { rate: 55 + Math.random() * 20, consistency: 'fair' }; // 55-75%
  } else {
    return { rate: 35 + Math.random() * 20, consistency: 'poor' }; // 35-55%
  }
}

/**
 * Generate 3-month medication history for one patient
 */
export function generatePatientMedicationHistory(
  patientId: string,
  patientName: string,
  medicationCount: number = 6
): PatientMedicationHistory {
  const profile = generateAdherenceProfile();
  
  // Select random medications (no duplicates)
  const selectedMeds = [...MEDICATION_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, medicationCount)
    .map((med, idx) => ({
      id: `med_${patientId}_${idx + 1}`,
      name: med.name,
      dosage: med.dosage,
      times: med.times,
      mealTiming: med.mealTiming,
      form: med.form,
    }));
  
  // Generate intake history for last 90 days
  const intakeHistory: IntakeRecord[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 90);
  
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    selectedMeds.forEach(med => {
      med.times.forEach(scheduledTime => {
        // Determine if taken based on profile + day-to-day variation
        const dailyVariation = (Math.random() - 0.5) * 20; // ±10% variation
        const effectiveRate = Math.max(0, Math.min(100, profile.rate + dailyVariation));
        const isTaken = Math.random() * 100 < effectiveRate;
        
        let takenAt: string | undefined;
        if (isTaken) {
          // Add realistic time variation (-15 to +45 minutes)
          const [hour, minute] = scheduledTime.split(':').map(Number);
          const variance = Math.floor(Math.random() * 60 - 15);
          const actualMinute = minute + variance;
          const actualHour = hour + Math.floor(actualMinute / 60);
          takenAt = `${String(actualHour % 24).padStart(2, '0')}:${String(actualMinute % 60).padStart(2, '0')}`;
        }
        
        intakeHistory.push({
          date: dateStr,
          medicationId: med.id,
          scheduled: scheduledTime,
          taken: isTaken,
          takenAt,
          skippedReason: !isTaken ? SKIP_REASONS[Math.floor(Math.random() * SKIP_REASONS.length)] : undefined,
        });
      });
    });
  }
  
  // Calculate actual adherence
  const takenCount = intakeHistory.filter(r => r.taken).length;
  const adherenceRate = Math.round((takenCount / intakeHistory.length) * 100);
  
  return {
    patientId,
    patientName,
    medications: selectedMeds,
    intakeHistory,
    adherenceRate,
  };
}

/**
 * Generate histories for multiple patients/dependents
 */
export function generateMultipleHistories(
  people: Array<{ id: string; name: string }>,
  medCountRange: { min: number; max: number } = { min: 5, max: 8 }
): PatientMedicationHistory[] {
  // Safety check: ensure people is defined and is an array
  if (!people || !Array.isArray(people) || people.length === 0) {
    console.warn('⚠️ generateMultipleHistories: No valid people array provided');
    return [];
  }

  return people.map(person => {
    const medCount = Math.floor(Math.random() * (medCountRange.max - medCountRange.min + 1)) + medCountRange.min;
    return generatePatientMedicationHistory(person.id, person.name, medCount);
  });
}

/**
 * Calculate weekly adherence trend (last 12 weeks)
 */
export function calculateWeeklyTrend(histories: PatientMedicationHistory[]) {
  // Safety check: ensure histories is defined and is an array
  if (!histories || !Array.isArray(histories) || histories.length === 0) {
    console.warn('⚠️ calculateWeeklyTrend: No valid histories provided');
    return [];
  }

  const weeks = [];
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - (i * 7));
    
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    
    let total = 0;
    let taken = 0;
    
    histories.forEach(h => {
      // Safety check: ensure intakeHistory exists and is an array
      if (h && h.intakeHistory && Array.isArray(h.intakeHistory)) {
        h.intakeHistory.forEach(record => {
          if (record.date >= weekStartStr && record.date <= weekEndStr) {
            total++;
            if (record.taken) taken++;
          }
        });
      }
    });
    
    weeks.push({
      week: `Week ${12 - i}`,
      adherence: total > 0 ? Math.round((taken / total) * 100) : 0,
      date: weekStartStr,
    });
  }
  
  return weeks;
}

/**
 * Calculate adherence distribution
 */
export function calculateDistribution(histories: PatientMedicationHistory[]) {
  // Safety check: ensure histories is defined and is an array
  if (!histories || !Array.isArray(histories) || histories.length === 0) {
    console.warn('⚠️ calculateDistribution: No valid histories provided');
    return {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
    };
  }

  return {
    excellent: histories.filter(h => h && h.adherenceRate >= 90).length,
    good: histories.filter(h => h && h.adherenceRate >= 75 && h.adherenceRate < 90).length,
    fair: histories.filter(h => h && h.adherenceRate >= 50 && h.adherenceRate < 75).length,
    poor: histories.filter(h => h && h.adherenceRate < 50).length,
  };
}

/**
 * Get at-risk patients (adherence < 75%)
 */
export function getAtRiskPatients(histories: PatientMedicationHistory[]) {
  // Safety check: ensure histories is defined and is an array
  if (!histories || !Array.isArray(histories) || histories.length === 0) {
    console.warn('⚠️ getAtRiskPatients: No valid histories provided');
    return [];
  }

  return histories
    .filter(h => h && h.adherenceRate && h.adherenceRate < 75)
    .map(h => ({
      id: h.patientId,
      name: h.patientName,
      adherence: h.adherenceRate,
    }));
}

/**
 * Save to localStorage for caching
 */
export function saveToCache(role: 'caregiver' | 'doctor', histories: PatientMedicationHistory[] | any[]) {
  // Safety check: ensure histories is valid
  if (!histories || !Array.isArray(histories) || histories.length === 0) {
    console.warn(`⚠️ saveToCache: No valid histories to cache for ${role}`);
    return;
  }

  const key = role === 'caregiver' ? 'caregiver_analytics_data' : 'doctor_analytics_data';
  
  try {
    const data = {
      histories,
      weeklyTrend: calculateWeeklyTrend(histories as PatientMedicationHistory[]),
      distribution: calculateDistribution(histories as PatientMedicationHistory[]),
      atRiskPatients: getAtRiskPatients(histories as PatientMedicationHistory[]),
      cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`✅ Analytics data cached for ${role}`);
  } catch (error) {
    console.error(`❌ Failed to cache analytics data for ${role}:`, error);
  }
}

/**
 * Load from cache
 */
export function loadFromCache(role: 'caregiver' | 'doctor') {
  const key = role === 'caregiver' ? 'caregiver_analytics_data' : 'doctor_analytics_data';
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  
  try {
    const data = JSON.parse(cached);
    // Check if cache is less than 24 hours old
    const cacheAge = Date.now() - new Date(data.cachedAt).getTime();
    if (cacheAge > 24 * 60 * 60 * 1000) {
      console.log('⚠️ Cache expired, regenerating data');
      return null;
    }
    console.log(`✅ Loaded analytics from cache for ${role}`);
    return data;
  } catch (e) {
    console.error('Failed to parse cache:', e);
    return null;
  }
}
