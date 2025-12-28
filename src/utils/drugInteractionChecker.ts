/**
 * MEDICATION INTERACTION CHECKER
 * Medical-grade medication safety system
 * Checks for dangerous medication-medication interactions
 */

export interface Medication {
  id: string | number;
  name: string;
  activeIngredient?: string;
  category?: string;
}

export interface MedicationInteraction {
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  medication1: string;
  medication2: string;
  description: string;
  recommendation: string;
  sources?: string[];
}

export interface InteractionCheckResult {
  hasInteractions: boolean;
  interactions: MedicationInteraction[];
  safeToTake: boolean;
  warningLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Common Medication Interaction Database
 * Based on FDA and medical literature
 * 
 * NOTE: This is a DEMO implementation with common interactions.
 * Production version should use a comprehensive medical API like:
 * - RxNorm API (National Library of Medicine)
 * - Medication Database API
 * - First Databank Medication Interaction API
 */

const INTERACTION_DATABASE: Record<string, Record<string, MedicationInteraction>> = {
  // Warfarin (Blood Thinner) - Critical interactions
  warfarin: {
    aspirin: {
      severity: 'critical',
      medication1: 'Warfarin',
      medication2: 'Aspirin',
      description: 'Both medications increase bleeding risk. Combined use may lead to serious bleeding events.',
      recommendation: 'URGENT: Consult your doctor immediately. Alternative pain relievers may be needed.',
      sources: ['FDA Drug Safety Communication', 'American Heart Association'],
    },
    ibuprofen: {
      severity: 'major',
      medication1: 'Warfarin',
      medication2: 'Ibuprofen',
      description: 'NSAIDs like ibuprofen can increase bleeding risk when combined with warfarin.',
      recommendation: 'Avoid ibuprofen. Use acetaminophen for pain relief instead. Consult your doctor.',
      sources: ['FDA', 'NIH'],
    },
    'vitamin k': {
      severity: 'major',
      medication1: 'Warfarin',
      medication2: 'Vitamin K',
      description: 'Vitamin K reduces warfarin effectiveness, potentially leading to blood clots.',
      recommendation: 'Maintain consistent Vitamin K intake. Avoid sudden increases in leafy greens.',
      sources: ['American College of Cardiology'],
    },
  },

  // Metformin (Diabetes) - Important interactions
  metformin: {
    alcohol: {
      severity: 'moderate',
      medication1: 'Metformin',
      medication2: 'Alcohol',
      description: 'Alcohol increases risk of lactic acidosis and hypoglycemia with metformin.',
      recommendation: 'Limit alcohol intake. Monitor blood sugar closely if drinking.',
      sources: ['American Diabetes Association'],
    },
    'contrast dye': {
      severity: 'major',
      medication1: 'Metformin',
      medication2: 'Iodinated Contrast Dye',
      description: 'May cause kidney problems and lactic acidosis.',
      recommendation: 'Stop metformin 48 hours before and after procedures with contrast dye.',
      sources: ['FDA', 'Radiology Society'],
    },
  },

  // Lisinopril (ACE Inhibitor for Blood Pressure)
  lisinopril: {
    ibuprofen: {
      severity: 'moderate',
      medication1: 'Lisinopril',
      medication2: 'Ibuprofen',
      description: 'NSAIDs may reduce effectiveness of blood pressure medication and harm kidneys.',
      recommendation: 'Use acetaminophen for pain instead. Monitor blood pressure regularly.',
      sources: ['American Heart Association'],
    },
    potassium: {
      severity: 'major',
      medication1: 'Lisinopril',
      medication2: 'Potassium Supplements',
      description: 'May cause dangerously high potassium levels (hyperkalemia).',
      recommendation: 'Avoid potassium supplements unless prescribed. Limit high-potassium foods.',
      sources: ['FDA', 'American College of Cardiology'],
    },
  },

  // Amlodipine (Calcium Channel Blocker for Blood Pressure)
  amlodipine: {
    grapefruit: {
      severity: 'moderate',
      medication1: 'Amlodipine',
      medication2: 'Grapefruit Juice',
      description: 'Grapefruit increases amlodipine blood levels, causing low blood pressure and dizziness.',
      recommendation: 'Avoid grapefruit and grapefruit juice while taking amlodipine.',
      sources: ['FDA'],
    },
    simvastatin: {
      severity: 'moderate',
      medication1: 'Amlodipine',
      medication2: 'Simvastatin',
      description: 'Increases risk of muscle damage (rhabdomyolysis).',
      recommendation: 'Simvastatin dose should not exceed 20mg daily when combined with amlodipine.',
      sources: ['FDA Drug Safety Communication'],
    },
  },

  // Levothyroxine (Thyroid Hormone)
  levothyroxine: {
    calcium: {
      severity: 'moderate',
      medication1: 'Levothyroxine',
      medication2: 'Calcium Supplements',
      description: 'Calcium reduces levothyroxine absorption.',
      recommendation: 'Take levothyroxine 4 hours before or after calcium supplements.',
      sources: ['American Thyroid Association'],
    },
    iron: {
      severity: 'moderate',
      medication1: 'Levothyroxine',
      medication2: 'Iron Supplements',
      description: 'Iron reduces levothyroxine absorption.',
      recommendation: 'Take levothyroxine 4 hours before or after iron supplements.',
      sources: ['American Thyroid Association'],
    },
  },

  // Omeprazole (Proton Pump Inhibitor for Stomach Acid)
  omeprazole: {
    clopidogrel: {
      severity: 'major',
      medication1: 'Omeprazole',
      medication2: 'Clopidogrel (Plavix)',
      description: 'Omeprazole reduces effectiveness of clopidogrel, increasing risk of heart attack.',
      recommendation: 'Use alternative acid reducer (e.g., pantoprazole). Consult cardiologist.',
      sources: ['FDA Drug Safety Communication', 'American Heart Association'],
    },
  },

  // Aspirin (Blood Thinner / Pain Reliever)
  aspirin: {
    ibuprofen: {
      severity: 'moderate',
      medication1: 'Aspirin',
      medication2: 'Ibuprofen',
      description: 'Ibuprofen may interfere with aspirin\'s heart-protective effects.',
      recommendation: 'Take aspirin at least 30 minutes before ibuprofen if both needed.',
      sources: ['FDA', 'American Heart Association'],
    },
    warfarin: {
      severity: 'critical',
      medication1: 'Aspirin',
      medication2: 'Warfarin',
      description: 'Both medications increase bleeding risk. Combined use may lead to serious bleeding events.',
      recommendation: 'URGENT: Consult your doctor immediately. Close monitoring required.',
      sources: ['FDA Drug Safety Communication'],
    },
  },

  // Atorvastatin (Statin for Cholesterol)
  atorvastatin: {
    grapefruit: {
      severity: 'moderate',
      medication1: 'Atorvastatin',
      medication2: 'Grapefruit Juice',
      description: 'Grapefruit increases statin levels, raising risk of muscle damage.',
      recommendation: 'Avoid grapefruit and grapefruit juice. Consider pravastatin as alternative.',
      sources: ['FDA'],
    },
  },

  // Digoxin (Heart Medication)
  digoxin: {
    amiodarone: {
      severity: 'major',
      medication1: 'Digoxin',
      medication2: 'Amiodarone',
      description: 'Amiodarone increases digoxin levels, potentially causing toxicity.',
      recommendation: 'Reduce digoxin dose by 50%. Monitor digoxin blood levels closely.',
      sources: ['American College of Cardiology'],
    },
  },

  // Ramipril (ACE Inhibitor - European)
  ramipril: {
    ibuprofen: {
      severity: 'moderate',
      medication1: 'Ramipril',
      medication2: 'Ibuprofen',
      description: 'NSAIDs may reduce effectiveness of blood pressure medication and harm kidneys.',
      recommendation: 'Use paracetamol for pain instead. Monitor blood pressure regularly.',
      sources: ['European Medicines Agency'],
    },
    potassium: {
      severity: 'major',
      medication1: 'Ramipril',
      medication2: 'Potassium Supplements',
      description: 'May cause dangerously high potassium levels (hyperkalemia).',
      recommendation: 'Avoid potassium supplements unless prescribed. Limit high-potassium foods.',
      sources: ['EMA', 'European Society of Cardiology'],
    },
  },

  // Bisoprolol (Beta Blocker - European)
  bisoprolol: {
    verapamil: {
      severity: 'major',
      medication1: 'Bisoprolol',
      medication2: 'Verapamil',
      description: 'Both slow heart rate. Combined use may cause dangerous bradycardia.',
      recommendation: 'Avoid combination. Consult cardiologist for alternative treatment.',
      sources: ['European Society of Cardiology'],
    },
    insulin: {
      severity: 'moderate',
      medication1: 'Bisoprolol',
      medication2: 'Insulin',
      description: 'Beta blockers may mask symptoms of low blood sugar (hypoglycemia).',
      recommendation: 'Monitor blood sugar closely. Be aware of hypoglycemia warning signs.',
      sources: ['European Diabetes Association'],
    },
  },

  // Clopidogrel (Blood Thinner - European)
  clopidogrel: {
    omeprazole: {
      severity: 'major',
      medication1: 'Clopidogrel',
      medication2: 'Omeprazole',
      description: 'Omeprazole reduces effectiveness of clopidogrel, increasing risk of heart attack.',
      recommendation: 'Use alternative acid reducer (e.g., pantoprazole). Consult cardiologist.',
      sources: ['EMA Drug Safety Communication', 'ESC'],
    },
    aspirin: {
      severity: 'moderate',
      medication1: 'Clopidogrel',
      medication2: 'Aspirin',
      description: 'Both increase bleeding risk. Often prescribed together but needs monitoring.',
      recommendation: 'Usually safe if prescribed together. Report any unusual bleeding immediately.',
      sources: ['European Society of Cardiology'],
    },
  },

  // Lansoprazole (Proton Pump Inhibitor - European)
  lansoprazole: {
    clopidogrel: {
      severity: 'moderate',
      medication1: 'Lansoprazole',
      medication2: 'Clopidogrel',
      description: 'May slightly reduce clopidogrel effectiveness, though less than omeprazole.',
      recommendation: 'Pantoprazole is a safer alternative. Discuss with your doctor.',
      sources: ['EMA'],
    },
  },

  // Paracetamol (Pain Relief - European)
  paracetamol: {
    warfarin: {
      severity: 'moderate',
      medication1: 'Paracetamol',
      medication2: 'Warfarin',
      description: 'Regular paracetamol use may increase warfarin\'s blood-thinning effect.',
      recommendation: 'Safe for occasional use. Regular use requires INR monitoring.',
      sources: ['British National Formulary'],
    },
  },

  // Glimepiride (Diabetes - European)
  glimepiride: {
    alcohol: {
      severity: 'moderate',
      medication1: 'Glimepiride',
      medication2: 'Alcohol',
      description: 'Alcohol increases risk of dangerously low blood sugar (hypoglycemia).',
      recommendation: 'Limit alcohol intake. Always eat when drinking. Monitor blood sugar.',
      sources: ['European Diabetes Association'],
    },
    clarithromycin: {
      severity: 'major',
      medication1: 'Glimepiride',
      medication2: 'Clarithromycin',
      description: 'Antibiotic may increase glimepiride levels, causing severe hypoglycemia.',
      recommendation: 'Monitor blood sugar closely if taking antibiotics. May need dose adjustment.',
      sources: ['EMA'],
    },
  },

  // Levodopa (Parkinson\'s - European)
  levodopa: {
    'vitamin b6': {
      severity: 'major',
      medication1: 'Levodopa',
      medication2: 'Vitamin B6 (Pyridoxine)',
      description: 'High-dose B6 reduces levodopa effectiveness.',
      recommendation: 'Avoid B6 supplements >10mg. Check multivitamin content.',
      sources: ['European Parkinson\'s Disease Association'],
    },
    protein: {
      severity: 'moderate',
      medication1: 'Levodopa',
      medication2: 'High Protein Meals',
      description: 'Protein competes with levodopa absorption.',
      recommendation: 'Take levodopa 30 minutes before meals or distribute protein evenly.',
      sources: ['Movement Disorder Society'],
    },
  },

  // Donepezil (Alzheimer\'s - European)
  donepezil: {
    'anticholinergic drugs': {
      severity: 'moderate',
      medication1: 'Donepezil',
      medication2: 'Anticholinergic Drugs',
      description: 'Anticholinergics counteract donepezil\'s effects.',
      recommendation: 'Avoid antihistamines and bladder medications. Consult doctor for alternatives.',
      sources: ['Alzheimer Europe'],
    },
  },

  // Sertraline (Antidepressant - European)
  sertraline: {
    tramadol: {
      severity: 'major',
      medication1: 'Sertraline',
      medication2: 'Tramadol',
      description: 'Risk of serotonin syndrome - potentially life-threatening condition.',
      recommendation: 'URGENT: Contact doctor immediately. Alternative pain relief needed.',
      sources: ['EMA Drug Safety Alert'],
    },
    ibuprofen: {
      severity: 'moderate',
      medication1: 'Sertraline',
      medication2: 'Ibuprofen',
      description: 'Increased risk of stomach bleeding.',
      recommendation: 'Use paracetamol instead. If NSAIDs needed, add stomach protection.',
      sources: ['British National Formulary'],
    },
  },

  // Montelukast (Asthma - European)
  montelukast: {
    phenobarbital: {
      severity: 'moderate',
      medication1: 'Montelukast',
      medication2: 'Phenobarbital',
      description: 'Phenobarbital may reduce montelukast effectiveness.',
      recommendation: 'May need higher montelukast dose. Monitor asthma control closely.',
      sources: ['European Respiratory Society'],
    },
  },
};

/**
 * Normalize medication name for matching
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}

/**
 * Check for interactions between two medications
 */
function checkPairInteraction(med1: Medication, med2: Medication): MedicationInteraction | null {
  const name1 = normalizeName(med1.name);
  const name2 = normalizeName(med2.name);

  // Check both directions
  if (INTERACTION_DATABASE[name1]?.[name2]) {
    return INTERACTION_DATABASE[name1][name2];
  }

  if (INTERACTION_DATABASE[name2]?.[name1]) {
    return INTERACTION_DATABASE[name2][name1];
  }

  // Check by active ingredient if available
  if (med1.activeIngredient && med2.activeIngredient) {
    const ingredient1 = normalizeName(med1.activeIngredient);
    const ingredient2 = normalizeName(med2.activeIngredient);

    if (INTERACTION_DATABASE[ingredient1]?.[ingredient2]) {
      return INTERACTION_DATABASE[ingredient1][ingredient2];
    }

    if (INTERACTION_DATABASE[ingredient2]?.[ingredient1]) {
      return INTERACTION_DATABASE[ingredient2][ingredient1];
    }
  }

  return null;
}

/**
 * Check all medications for interactions
 */
export function checkMedicationInteractions(medications: Medication[]): InteractionCheckResult {
  const interactions: MedicationInteraction[] = [];

  // Check each pair of medications
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const interaction = checkPairInteraction(medications[i], medications[j]);
      if (interaction) {
        interactions.push(interaction);
      }
    }
  }

  // Determine overall warning level
  let warningLevel: InteractionCheckResult['warningLevel'] = 'none';
  let safeToTake = true;

  if (interactions.length > 0) {
    const severities = interactions.map((i) => i.severity);

    if (severities.includes('critical')) {
      warningLevel = 'critical';
      safeToTake = false;
    } else if (severities.includes('major')) {
      warningLevel = 'high';
      safeToTake = false;
    } else if (severities.includes('moderate')) {
      warningLevel = 'medium';
    } else {
      warningLevel = 'low';
    }
  }

  return {
    hasInteractions: interactions.length > 0,
    interactions,
    safeToTake,
    warningLevel,
  };
}

/**
 * Check if a new medication would interact with existing ones
 */
export function checkNewMedicationSafety(
  newMedication: Medication,
  existingMedications: Medication[]
): InteractionCheckResult {
  const interactions: DrugInteraction[] = [];

  for (const existing of existingMedications) {
    const interaction = checkPairInteraction(newMedication, existing);
    if (interaction) {
      interactions.push(interaction);
    }
  }

  let warningLevel: InteractionCheckResult['warningLevel'] = 'none';
  let safeToTake = true;

  if (interactions.length > 0) {
    const severities = interactions.map((i) => i.severity);

    if (severities.includes('critical')) {
      warningLevel = 'critical';
      safeToTake = false;
    } else if (severities.includes('major')) {
      warningLevel = 'high';
      safeToTake = false;
    } else if (severities.includes('moderate')) {
      warningLevel = 'medium';
    } else {
      warningLevel = 'low';
    }
  }

  return {
    hasInteractions: interactions.length > 0,
    interactions,
    safeToTake,
    warningLevel,
  };
}

/**
 * Get color for severity level
 */
export function getSeverityColor(severity: MedicationInteraction['severity']): string {
  switch (severity) {
    case 'critical':
      return 'red';
    case 'major':
      return 'orange';
    case 'moderate':
      return 'yellow';
    case 'minor':
      return 'blue';
    default:
      return 'gray';
  }
}

/**
 * Get icon for warning level
 */
export function getWarningIcon(level: InteractionCheckResult['warningLevel']): string {
  switch (level) {
    case 'critical':
      return '🚨';
    case 'high':
      return '⚠️';
    case 'medium':
      return '⚡';
    case 'low':
      return 'ℹ️';
    default:
      return '✅';
  }
}

/**
 * Format interaction warning message
 */
export function formatInteractionMessage(interaction: MedicationInteraction): string {
  return `${getWarningIcon(interaction.severity === 'critical' ? 'critical' : interaction.severity === 'major' ? 'high' : interaction.severity === 'moderate' ? 'medium' : 'low')} ${interaction.medication1} + ${interaction.medication2}: ${interaction.description}`;
}

/**
 * Get all medications in database (for autocomplete)
 */
export function getKnownMedications(): string[] {
  return Object.keys(INTERACTION_DATABASE).map(
    (name) => name.charAt(0).toUpperCase() + name.slice(1)
  );
}
