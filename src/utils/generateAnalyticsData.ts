/**
 * Generate realistic medication history for analytics
 * Creates 3 months of daily medication intake data with varying adherence patterns
 */

interface MedicationIntake {
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  takenTime: string | null;
  taken: boolean;
  date: string;
  skippedReason?: string;
}

interface PatientHistory {
  patientId: string;
  patientName: string;
  intakeHistory: MedicationIntake[];
  adherenceRate: number;
}

const MEDICATIONS = [
  // Cardiovascular
  { id: 'med_001', name: 'Lisinopril', dosage: '10mg', times: ['08:00', '20:00'] },
  { id: 'med_002', name: 'Atorvastatin', dosage: '20mg', times: ['20:00'] },
  { id: 'med_003', name: 'Metoprolol', dosage: '50mg', times: ['08:00', '14:00', '20:00'] },
  
  // Diabetes
  { id: 'med_004', name: 'Metformin', dosage: '500mg', times: ['08:00', '20:00'] },
  { id: 'med_005', name: 'Glimepiride', dosage: '2mg', times: ['08:00'] },
  
  // Pain/Inflammation
  { id: 'med_006', name: 'Ibuprofen', dosage: '400mg', times: ['08:00', '14:00', '20:00'] },
  { id: 'med_007', name: 'Paracetamol', dosage: '500mg', times: ['08:00', '12:00', '16:00', '20:00'] },
  
  // Supplements
  { id: 'med_008', name: 'Vitamin D3', dosage: '1000 IU', times: ['08:00'] },
  { id: 'med_009', name: 'Omega-3', dosage: '1000mg', times: ['08:00'] },
  { id: 'med_010', name: 'Calcium', dosage: '500mg', times: ['08:00', '20:00'] },
  
  // Respiratory
  { id: 'med_011', name: 'Montelukast', dosage: '10mg', times: ['20:00'] },
  
  // Thyroid
  { id: 'med_012', name: 'Levothyroxine', dosage: '50mcg', times: ['07:00'] },
];

const SKIP_REASONS = [
  'Forgot to take',
  'Felt better',
  'Side effects',
  'Away from home',
  'Medication ran out',
];

/**
 * Generate random adherence rate based on patient profile
 */
function getAdherenceProfile(): { rate: number; consistency: 'high' | 'medium' | 'low' } {
  const rand = Math.random();
  if (rand > 0.7) {
    return { rate: 90 + Math.random() * 10, consistency: 'high' }; // 90-100%
  } else if (rand > 0.3) {
    return { rate: 75 + Math.random() * 15, consistency: 'medium' }; // 75-90%
  } else {
    return { rate: 50 + Math.random() * 25, consistency: 'low' }; // 50-75%
  }
}

/**
 * Generate intake history for one patient
 */
export function generatePatientHistory(
  patientId: string,
  patientName: string,
  monthsBack: number = 3,
  medicationCount: number = 7
): PatientHistory {
  const profile = getAdherenceProfile();
  const intakeHistory: MedicationIntake[] = [];
  
  // Select random medications
  const selectedMeds = MEDICATIONS
    .sort(() => Math.random() - 0.5)
    .slice(0, medicationCount);
  
  // Generate history for last N months
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsBack);
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    
    // For each medication
    selectedMeds.forEach(med => {
      // For each scheduled time
      med.times.forEach(time => {
        // Determine if taken based on adherence profile
        const isTaken = Math.random() * 100 < profile.rate;
        
        // Add some consistency - high adherence patients skip less often
        const skipChance = profile.consistency === 'high' ? 0.05 : 
                          profile.consistency === 'medium' ? 0.15 : 0.30;
        const shouldSkip = Math.random() < skipChance;
        
        let takenTime: string | null = null;
        if (isTaken && !shouldSkip) {
          // Add realistic time variation (-30 to +60 minutes)
          const [hour, minute] = time.split(':').map(Number);
          const variance = Math.floor(Math.random() * 90 - 30); // -30 to +60 minutes
          const actualDate = new Date(date);
          actualDate.setHours(hour, minute + variance, 0);
          takenTime = actualDate.toTimeString().slice(0, 5);
        }
        
        intakeHistory.push({
          medicationId: med.id,
          medicationName: `${med.name} ${med.dosage}`,
          scheduledTime: time,
          takenTime,
          taken: isTaken && !shouldSkip,
          date: dateStr,
          skippedReason: (!isTaken || shouldSkip) ? 
            SKIP_REASONS[Math.floor(Math.random() * SKIP_REASONS.length)] : undefined
        });
      });
    });
  }
  
  // Calculate actual adherence rate
  const takenCount = intakeHistory.filter(i => i.taken).length;
  const adherenceRate = Math.round((takenCount / intakeHistory.length) * 100);
  
  return {
    patientId,
    patientName,
    intakeHistory,
    adherenceRate
  };
}

/**
 * Generate histories for multiple patients
 */
export function generateMultiplePatientHistories(
  patients: Array<{ id: string; name: string }>,
  monthsBack: number = 3,
  medicationsPerPatient: { min: number; max: number } = { min: 5, max: 7 }
): PatientHistory[] {
  return patients.map(patient => {
    const medCount = Math.floor(
      Math.random() * (medicationsPerPatient.max - medicationsPerPatient.min + 1) + 
      medicationsPerPatient.min
    );
    return generatePatientHistory(patient.id, patient.name, monthsBack, medCount);
  });
}

/**
 * Get analytics summary from history
 */
export function getAnalyticsSummary(histories: PatientHistory[]) {
  const totalPatients = histories.length;
  const avgAdherence = Math.round(
    histories.reduce((sum, h) => sum + h.adherenceRate, 0) / totalPatients
  );
  
  const totalIntakes = histories.reduce((sum, h) => sum + h.intakeHistory.length, 0);
  const totalTaken = histories.reduce(
    (sum, h) => sum + h.intakeHistory.filter(i => i.taken).length, 
    0
  );
  
  // Weekly adherence trend (last 12 weeks)
  const weeklyTrend = [];
  const endDate = new Date();
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(endDate);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    
    let weekTotal = 0;
    let weekTaken = 0;
    
    histories.forEach(h => {
      h.intakeHistory.forEach(intake => {
        if (intake.date >= weekStartStr && intake.date <= weekEndStr) {
          weekTotal++;
          if (intake.taken) weekTaken++;
        }
      });
    });
    
    weeklyTrend.push({
      week: `Week ${12 - i}`,
      adherence: weekTotal > 0 ? Math.round((weekTaken / weekTotal) * 100) : 0,
      date: weekStartStr
    });
  }
  
  // Adherence distribution
  const distribution = {
    excellent: histories.filter(h => h.adherenceRate >= 90).length,
    good: histories.filter(h => h.adherenceRate >= 75 && h.adherenceRate < 90).length,
    fair: histories.filter(h => h.adherenceRate >= 50 && h.adherenceRate < 75).length,
    poor: histories.filter(h => h.adherenceRate < 50).length,
  };
  
  // At-risk patients (adherence < 75%)
  const atRiskPatients = histories.filter(h => h.adherenceRate < 75);
  
  return {
    totalPatients,
    avgAdherence,
    totalIntakes,
    totalTaken,
    weeklyTrend,
    distribution,
    atRiskPatients: atRiskPatients.map(h => ({
      id: h.patientId,
      name: h.patientName,
      adherenceRate: h.adherenceRate
    }))
  };
}

/**
 * Save histories to localStorage for demo
 */
export function saveHistoriesToLocalStorage(
  role: 'caregiver' | 'doctor',
  histories: PatientHistory[]
) {
  const key = role === 'caregiver' ? 'dependentHistories' : 'patientHistories';
  localStorage.setItem(key, JSON.stringify(histories));
  
  const summary = getAnalyticsSummary(histories);
  localStorage.setItem(`${key}Summary`, JSON.stringify(summary));
  
  console.log(`✅ Generated ${histories.length} ${role} histories with analytics data`);
  console.log(`📊 Average adherence: ${summary.avgAdherence}%`);
  console.log(`⚠️ At-risk patients: ${summary.atRiskPatients.length}`);
}
