/**
 * Database Persistence Layer
 * 
 * Allows saving changes to demo data in localStorage
 * for testing and demo purposes without modifying the source JSON.
 * 
 * Benefits:
 * - Test data improvements are preserved
 * - Easy to upgrade demo data
 * - Changes sync across sessions
 * - Can reset to original anytime
 */

export interface DatabaseChanges {
  patients?: any[];
  doctors?: any[];
  caregivers?: any[];
  medications?: any[];
  lastModified?: string;
}

const STORAGE_KEY = 'prescriptionClarity_dbChanges';

/**
 * Save changes to localStorage
 */
export function saveDatabaseChanges(changes: DatabaseChanges): void {
  try {
    const dataToSave = {
      ...changes,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('✅ Database changes saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save database changes:', error);
  }
}

/**
 * Load changes from localStorage
 */
export function loadDatabaseChanges(): DatabaseChanges | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const changes = JSON.parse(stored);
    console.log('✅ Loaded database changes from localStorage');
    return changes;
  } catch (error) {
    console.error('❌ Failed to load database changes:', error);
    return null;
  }
}

/**
 * Merge changes with original database
 */
export function mergeDatabaseChanges(original: any, changes: DatabaseChanges | null): any {
  if (!changes) return original;
  
  return {
    ...original,
    patients: changes.patients || original.patients,
    doctors: changes.doctors || original.doctors,
    caregivers: changes.caregivers || original.caregivers,
    medications: changes.medications || original.medications
  };
}

/**
 * Reset to original database (clear localStorage)
 */
export function resetDatabase(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Database reset to original');
  } catch (error) {
    console.error('❌ Failed to reset database:', error);
  }
}

/**
 * Update patient data
 */
export function updatePatient(patientId: string, updates: any): void {
  const changes = loadDatabaseChanges() || {};
  const patients = changes.patients || [];
  
  const index = patients.findIndex((p: any) => p.id === patientId);
  if (index >= 0) {
    patients[index] = { ...patients[index], ...updates };
  } else {
    patients.push({ id: patientId, ...updates });
  }
  
  saveDatabaseChanges({ ...changes, patients });
}

/**
 * Update doctor data
 */
export function updateDoctor(doctorId: string, updates: any): void {
  const changes = loadDatabaseChanges() || {};
  const doctors = changes.doctors || [];
  
  const index = doctors.findIndex((d: any) => d.id === doctorId);
  if (index >= 0) {
    doctors[index] = { ...doctors[index], ...updates };
  } else {
    doctors.push({ id: doctorId, ...updates });
  }
  
  saveDatabaseChanges({ ...changes, doctors });
}

/**
 * Update caregiver data
 */
export function updateCaregiver(caregiverId: string, updates: any): void {
  const changes = loadDatabaseChanges() || {};
  const caregivers = changes.caregivers || [];
  
  const index = caregivers.findIndex((c: any) => c.id === caregiverId);
  if (index >= 0) {
    caregivers[index] = { ...caregivers[index], ...updates };
  } else {
    caregivers.push({ id: caregiverId, ...updates });
  }
  
  saveDatabaseChanges({ ...changes, caregivers });
}

/**
 * Add new medication to patient
 */
export function addMedicationToPatient(patientId: string, medication: any): void {
  const changes = loadDatabaseChanges() || {};
  const patients = changes.patients || [];
  
  const patientIndex = patients.findIndex((p: any) => p.id === patientId);
  if (patientIndex >= 0) {
    const patient = patients[patientIndex];
    patient.medications = [...(patient.medications || []), medication];
    saveDatabaseChanges({ ...changes, patients });
  }
}

/**
 * Update medication for patient
 */
export function updateMedicationForPatient(
  patientId: string, 
  medicationId: string, 
  updates: any
): void {
  const changes = loadDatabaseChanges() || {};
  const patients = changes.patients || [];
  
  const patientIndex = patients.findIndex((p: any) => p.id === patientId);
  if (patientIndex >= 0) {
    const patient = patients[patientIndex];
    const medIndex = (patient.medications || []).findIndex((m: any) => m.id === medicationId);
    
    if (medIndex >= 0) {
      patient.medications[medIndex] = { 
        ...patient.medications[medIndex], 
        ...updates 
      };
      saveDatabaseChanges({ ...changes, patients });
    }
  }
}

/**
 * Delete medication from patient
 */
export function deleteMedicationFromPatient(patientId: string, medicationId: string): void {
  const changes = loadDatabaseChanges() || {};
  const patients = changes.patients || [];
  
  const patientIndex = patients.findIndex((p: any) => p.id === patientId);
  if (patientIndex >= 0) {
    const patient = patients[patientIndex];
    patient.medications = (patient.medications || []).filter((m: any) => m.id !== medicationId);
    saveDatabaseChanges({ ...changes, patients });
  }
}

/**
 * Export all changes as JSON (for upgrading demo data)
 */
export function exportDatabaseChanges(): string {
  const changes = loadDatabaseChanges();
  return JSON.stringify(changes, null, 2);
}

/**
 * Get last modified timestamp
 */
export function getLastModifiedTimestamp(): string | null {
  const changes = loadDatabaseChanges();
  return changes?.lastModified || null;
}
