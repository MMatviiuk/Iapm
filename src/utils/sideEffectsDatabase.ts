/**
 * SIDE EFFECTS DATABASE
 * Common medication side effects for medical professionals
 * British English terminology (NHS/NICE compliant)
 */

export interface SideEffect {
  severity: 'common' | 'uncommon' | 'rare' | 'serious';
  effect: string;
  frequency?: string;
  action?: string;
}

export interface MedicationSideEffects {
  medicationName: string;
  commonSideEffects: SideEffect[];
  seriousSideEffects: SideEffect[];
  warnings: string[];
  contraindications?: string[];
}

/**
 * Side Effects Database (Demo - NHS/NICE compliant)
 * Production: Use MHRA API or NHS API
 */
const SIDE_EFFECTS_DATABASE: Record<string, MedicationSideEffects> = {
  // Cardiovascular
  aspirin: {
    medicationName: 'Aspirin',
    commonSideEffects: [
      { severity: 'common', effect: 'Indigestion', frequency: '1 in 10', action: 'Take with food' },
      { severity: 'common', effect: 'Nausea', frequency: '1 in 10', action: 'Take with food or milk' },
      { severity: 'uncommon', effect: 'Stomach bleeding', frequency: '1 in 100', action: 'Seek medical advice if black stools' },
    ],
    seriousSideEffects: [
      { severity: 'serious', effect: 'Severe allergic reaction', frequency: 'Rare', action: 'Seek emergency help immediately' },
      { severity: 'serious', effect: 'Bleeding in the brain', frequency: 'Very rare', action: 'Emergency: severe headache, confusion' },
    ],
    warnings: [
      'Do not use in children under 16 (Reye\'s syndrome risk)',
      'Avoid if you have asthma or stomach ulcers',
      'Tell your doctor if you have kidney or liver problems',
    ],
    contraindications: ['Children under 16', 'Active peptic ulcer', 'Haemophilia'],
  },

  atorvastatin: {
    medicationName: 'Atorvastatin',
    commonSideEffects: [
      { severity: 'common', effect: 'Muscle pain', frequency: '1 in 10', action: 'Report to doctor if severe' },
      { severity: 'common', effect: 'Headache', frequency: '1 in 10', action: 'Usually improves after first week' },
      { severity: 'uncommon', effect: 'Digestive problems', frequency: '1 in 100', action: 'Take with food' },
    ],
    seriousSideEffects: [
      { severity: 'serious', effect: 'Rhabdomyolysis (muscle breakdown)', frequency: 'Very rare', action: 'Stop medication, seek urgent medical help' },
      { severity: 'serious', effect: 'Liver problems', frequency: 'Rare', action: 'Annual liver function tests recommended' },
    ],
    warnings: [
      'Avoid grapefruit juice (increases medication levels)',
      'Regular liver function tests needed',
      'Report unexplained muscle pain immediately',
    ],
  },

  // Diabetes
  metformin: {
    medicationName: 'Metformin',
    commonSideEffects: [
      { severity: 'common', effect: 'Diarrhoea', frequency: '1 in 10', action: 'Take with food, usually improves' },
      { severity: 'common', effect: 'Nausea', frequency: '1 in 10', action: 'Take with or after meals' },
      { severity: 'common', effect: 'Stomach pain', frequency: '1 in 10', action: 'Take with food' },
    ],
    seriousSideEffects: [
      { severity: 'serious', effect: 'Lactic acidosis', frequency: 'Very rare', action: 'Emergency: rapid breathing, muscle pain, severe fatigue' },
      { severity: 'serious', effect: 'Vitamin B12 deficiency', frequency: 'Uncommon', action: 'Annual blood tests recommended' },
    ],
    warnings: [
      'Stop before surgery or X-rays with contrast dye',
      'Avoid excessive alcohol',
      'Tell doctor if you have kidney problems',
    ],
  },

  // Blood pressure
  amlodipine: {
    medicationName: 'Amlodipine',
    commonSideEffects: [
      { severity: 'common', effect: 'Swollen ankles', frequency: '1 in 10', action: 'Normal, elevate feet when resting' },
      { severity: 'common', effect: 'Headache', frequency: '1 in 10', action: 'Usually improves after first week' },
      { severity: 'common', effect: 'Flushing', frequency: '1 in 10', action: 'Usually temporary' },
    ],
    seriousSideEffects: [
      { severity: 'serious', effect: 'Severe allergic reaction', frequency: 'Rare', action: 'Seek emergency help' },
      { severity: 'serious', effect: 'Liver problems', frequency: 'Very rare', action: 'Report yellowing of skin/eyes' },
    ],
    warnings: [
      'May cause dizziness - take care when standing',
      'Avoid grapefruit juice',
      'Tell doctor if you have liver problems',
    ],
  },

  ramipril: {
    medicationName: 'Ramipril',
    commonSideEffects: [
      { severity: 'common', effect: 'Dry cough', frequency: '1 in 10', action: 'Tell doctor - may need to switch medication' },
      { severity: 'common', effect: 'Dizziness', frequency: '1 in 10', action: 'Take care when standing up' },
      { severity: 'common', effect: 'Headache', frequency: '1 in 10', action: 'Usually improves' },
    ],
    seriousSideEffects: [
      { severity: 'serious', effect: 'Angioedema (swelling)', frequency: 'Rare', action: 'Emergency: swelling of face/throat' },
      { severity: 'serious', effect: 'Kidney problems', frequency: 'Uncommon', action: 'Regular kidney function tests needed' },
    ],
    warnings: [
      'Not suitable during pregnancy',
      'Avoid salt substitutes containing potassium',
      'Regular blood tests for kidney function',
    ],
  },

  // Pain relief
  paracetamol: {
    medicationName: 'Paracetamol',
    commonSideEffects: [
      { severity: 'common', effect: 'Very few side effects at normal doses', frequency: 'N/A', action: 'Generally well tolerated' },
    ],
    seriousSideEffects: [
      { severity: 'serious', effect: 'Liver damage (overdose)', frequency: 'Overdose only', action: 'NEVER exceed 4g per day' },
      { severity: 'serious', effect: 'Severe allergic reaction', frequency: 'Very rare', action: 'Seek emergency help' },
    ],
    warnings: [
      'NEVER exceed maximum dose (4g/day in adults)',
      'Check other medications don\'t contain paracetamol',
      'Reduced dose needed if liver/kidney problems',
    ],
  },

  ibuprofen: {
    medicationName: 'Ibuprofen',
    commonSideEffects: [
      { severity: 'common', effect: 'Indigestion', frequency: '1 in 10', action: 'Take with food' },
      { severity: 'common', effect: 'Nausea', frequency: '1 in 10', action: 'Take with food or milk' },
      { severity: 'uncommon', effect: 'Stomach ulcers', frequency: '1 in 100', action: 'Report stomach pain or blood in stools' },
    ],
    seriousSideEffects: [
      { severity: 'serious', effect: 'Heart attack/stroke risk', frequency: 'Increased with long-term use', action: 'Use lowest dose for shortest time' },
      { severity: 'serious', effect: 'Kidney problems', frequency: 'Rare', action: 'Avoid if you have kidney disease' },
    ],
    warnings: [
      'Avoid if you have heart disease or high blood pressure',
      'Do not use with aspirin',
      'Take with food to reduce stomach upset',
    ],
  },

  // Antibiotics
  amoxicillin: {
    medicationName: 'Amoxicillin',
    commonSideEffects: [
      { severity: 'common', effect: 'Diarrhoea', frequency: '1 in 10', action: 'Usually mild, stay hydrated' },
      { severity: 'common', effect: 'Nausea', frequency: '1 in 10', action: 'Take with food' },
      { severity: 'uncommon', effect: 'Skin rash', frequency: '1 in 100', action: 'Tell doctor - may be allergic' },
    ],
    seriousSideEffects: [
      { severity: 'serious', effect: 'Severe allergic reaction', frequency: 'Rare', action: 'Emergency: difficulty breathing, swelling' },
      { severity: 'serious', effect: 'Clostridium difficile infection', frequency: 'Rare', action: 'Seek help if severe watery diarrhoea' },
    ],
    warnings: [
      'Complete the full course even if feeling better',
      'Tell doctor if you have had allergic reaction to penicillin',
      'May reduce effectiveness of contraceptive pill',
    ],
  },

  // Mental health
  sertraline: {
    medicationName: 'Sertraline',
    commonSideEffects: [
      { severity: 'common', effect: 'Nausea', frequency: '1 in 10', action: 'Take with food, usually improves' },
      { severity: 'common', effect: 'Headache', frequency: '1 in 10', action: 'Usually temporary' },
      { severity: 'common', effect: 'Insomnia', frequency: '1 in 10', action: 'Take in morning rather than evening' },
    ],
    seriousSideEffects: [
      { severity: 'serious', effect: 'Suicidal thoughts (under 25s)', frequency: 'Uncommon', action: 'Tell doctor immediately' },
      { severity: 'serious', effect: 'Serotonin syndrome', frequency: 'Rare', action: 'Emergency: agitation, confusion, rapid heart rate' },
    ],
    warnings: [
      'May take 4-6 weeks to show full effect',
      'Do not stop suddenly - gradual reduction needed',
      'Avoid alcohol',
    ],
  },
};

/**
 * Get side effects for a medication
 */
export function getMedicationSideEffects(medicationName: string): MedicationSideEffects | null {
  const normalizedName = medicationName.toLowerCase().trim();
  return SIDE_EFFECTS_DATABASE[normalizedName] || null;
}

/**
 * Check if medication has serious side effects
 */
export function hasSeriousSideEffects(medicationName: string): boolean {
  const sideEffects = getMedicationSideEffects(medicationName);
  return sideEffects ? sideEffects.seriousSideEffects.length > 0 : false;
}

/**
 * Get all medications in database
 */
export function getAllMedicationsWithSideEffects(): string[] {
  return Object.keys(SIDE_EFFECTS_DATABASE);
}

/**
 * Search for medications by side effect
 */
export function searchBySideEffect(sideEffectQuery: string): string[] {
  const query = sideEffectQuery.toLowerCase();
  const results: string[] = [];

  Object.entries(SIDE_EFFECTS_DATABASE).forEach(([medName, data]) => {
    const allEffects = [
      ...data.commonSideEffects.map(e => e.effect),
      ...data.seriousSideEffects.map(e => e.effect),
    ];

    if (allEffects.some(effect => effect.toLowerCase().includes(query))) {
      results.push(data.medicationName);
    }
  });

  return results;
}
