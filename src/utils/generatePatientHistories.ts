/**
 * Utility to generate 3-month medication histories for all patients
 * Run this to populate the sample data with realistic adherence patterns
 * 
 * NOTE: Currently disabled due to JSON import issues in production build.
 * The JSON import causes Vite/esbuild to parse JSON as JavaScript.
 * For production, this should load data via fetch() from public/ directory.
 */

import { generateMedicationHistory } from './medicationHistoryGenerator';
// DISABLED: Direct JSON import causes build errors
// import patientsData from '../data/sample-patients-with-history.json';

export function generateAllPatientHistories() {
  // DISABLED: Function needs refactoring to use fetch() instead of import
  console.warn('generateAllPatientHistories is currently disabled - needs fetch() refactor');
  return { patients: [], generatedAt: new Date().toISOString(), patientsWithHistory: [] };
  
  /* ORIGINAL CODE - DISABLED
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90); // 90 days ago

  const patientsWithHistory = patientsData.patients.map(patient => {
    // Generate history for this patient's medications
    const history = generateMedicationHistory(patient.medications as any, startDate);
    
    return {
      ...patient,
      medicationHistory: history,
      historyStats: {
        totalDoses: history.length,
        takenDoses: history.filter(h => h.taken).length,
        missedDoses: history.filter(h => !h.taken).length,
        adherenceRate: Math.round((history.filter(h => h.taken).length / history.length) * 100)
      }
    };
  });

  return {
    ...patientsData,
    generatedAt: new Date().toISOString(),
    patientsWithHistory
  };
  */
}

/* DISABLED - needs refactoring
export function generateAllPatientHistories() {


/**
 * Export individual patient data with history
 */
export function getPatientWithHistory(patientId: string) {
  console.warn('getPatientWithHistory is currently disabled');
  return null;
}

/**
 * Get statistics across all patients
 */
export function getAllPatientsStats() {
  console.warn('getAllPatientsStats is currently disabled');
  return {
    totalPatients: 0,
    totalMedications: 0,
    averageMedicationsPerPatient: 0,
    averageAdherence: 0,
    atRiskPatients: 0,
    excellentAdherence: 0,
    goodAdherence: 0,
    poorAdherence: 0,
  };
}

/**
 * Export for demo/testing purposes
 */
export function exportPatientHistoriesAsJSON() {
  console.warn('exportPatientHistoriesAsJSON is currently disabled');
  return JSON.stringify({ disabled: true, message: 'Feature disabled due to build constraints' }, null, 2);
}
