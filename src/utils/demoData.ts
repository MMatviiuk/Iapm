// Demo Data Loader
// Inline demo data for guaranteed build success

import { INVESTOR_DEMO_DATABASE } from '../data/investor-demo-data';

export interface DemoPatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photoUrl?: string;
  address?: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  caregiverId?: string;
  primaryDoctorId?: string;
  medications: any[];
  adherenceRate?: number;
}

export interface DemoDoctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  phoneNumber: string;
  photoUrl?: string;
  yearsOfExperience: number;
  patients: string[];
}

export interface DemoCaregiver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoUrl?: string;
  relationship: string;
  dependents: string[];
}

export interface DemoDatabase {
  doctors: DemoDoctor[];
  caregivers: DemoCaregiver[];
  patients: DemoPatient[];
}

// Use investor demo database with comprehensive data
const INLINE_DEMO_DATABASE: DemoDatabase = INVESTOR_DEMO_DATABASE;

let cachedDatabase: DemoDatabase | null = null;

/**
 * Load demo database - uses inline data for guaranteed build success
 */
export async function loadDemoDatabase(): Promise<DemoDatabase> {
  if (cachedDatabase) {
    return cachedDatabase;
  }

  console.log('🔍 Loading inline demo database...');
  
  cachedDatabase = INLINE_DEMO_DATABASE;
  
  console.log('✅ Demo database loaded successfully:', {
    doctors: cachedDatabase.doctors?.length || 0,
    caregivers: cachedDatabase.caregivers?.length || 0,
    patients: cachedDatabase.patients?.length || 0,
    medications: cachedDatabase.patients[0]?.medications?.length || 0
  });
  
  return cachedDatabase;
}

/**
 * Initialize demo users in localStorage from database
 */
export async function initializeDemoUsers() {
  const database = await loadDemoDatabase();
  
  if (!database.patients || database.patients.length === 0) {
    console.error('⚠️ No patients found in database! Using fallback data.');
    // Create a minimal fallback user
    const fallbackUser = {
      id: 'patient_fallback_001',
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo User',
      role: 'patient',
      dateOfBirth: '1950-01-01',
      gender: 'male',
      onboardingComplete: true,
      patientData: {
        id: 'fallback_001',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        dateOfBirth: '1950-01-01',
        gender: 'Male',
        medications: []
      }
    };
    localStorage.setItem('mock_users', JSON.stringify([fallbackUser]));
    return [fallbackUser];
  }
  
  const demoUsers: any[] = [];
  
  // Add simple demo accounts FIRST (these are in DEMO_ACCOUNTS.md)
  // These allow easy login with patient@demo.com, caregiver@demo.com, doctor@demo.com
  demoUsers.push({
    id: 'simple_patient_001',
    email: 'patient@demo.com',
    password: 'demo123',
    name: 'John Smith',
    role: 'patient',
    dateOfBirth: '1952-03-15',
    gender: 'male',
    photoUrl: 'https://images.unsplash.com/photo-1758686253859-8ef7e940096e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjQ2Nzc1N3ww&ixlib=rb-4.1.0&q=80&w=400',
    onboardingComplete: true,
    patientData: {
      id: 'simple_patient_001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'patient@demo.com',
      dateOfBirth: '1952-03-15',
      gender: 'male',
      photoUrl: 'https://images.unsplash.com/photo-1758691461884-ff702418afde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwbWFuJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYyNDYxMzEzfDA&ixlib=rb-4.1.0&q=80&w=400',
      medications: []
    }
  });
  
  demoUsers.push({
    id: 'simple_caregiver_001',
    email: 'caregiver@demo.com',
    password: 'demo123',
    name: 'Anna Johnson',
    role: 'caregiver',
    dateOfBirth: '1978-07-22',
    gender: 'female',
    onboardingComplete: true,
    caregiverData: {
      id: 'simple_caregiver_001',
      firstName: 'Anna',
      lastName: 'Johnson',
      email: 'caregiver@demo.com',
      phoneNumber: '+44 20 1234 5678',
      relationship: 'Daughter',
      dependents: []
    }
  });
  
  demoUsers.push({
    id: 'simple_doctor_001',
    email: 'doctor@demo.com',
    password: 'demo123',
    name: 'Dr. Carlos Rodriguez',
    role: 'doctor',
    dateOfBirth: '1975-11-08',
    gender: 'male',
    specialty: 'General Practice',
    onboardingComplete: true,
    doctorData: {
      id: 'simple_doctor_001',
      firstName: 'Carlos',
      lastName: 'Rodriguez',
      email: 'doctor@demo.com',
      specialty: 'General Practice',
      licenseNumber: 'GMC-123456',
      phoneNumber: '+44 20 9876 5432',
      yearsOfExperience: 22,
      patients: []
    }
  });
  
  console.log('✅ Added 3 simple demo accounts (patient@demo.com, caregiver@demo.com, doctor@demo.com)');
  
  // Add patients as users from the database
  database.patients.forEach((patient) => {
    const user = {
      id: patient.id, // Use patient ID directly (already has patient_ prefix)
      email: patient.email,
      password: 'demo123',
      name: `${patient.firstName} ${patient.lastName}`,
      role: 'patient',
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender.toLowerCase(),
      photoUrl: patient.photoUrl,
      onboardingComplete: true,
      patientData: {
        ...patient,
        id: patient.id // Ensure ID is preserved correctly
      },
    };
    
    console.log(`📝 Creating patient user:`, {
      userId: user.id,
      email: user.email,
      name: user.name,
      hasPatientData: !!user.patientData,
      patientDataId: user.patientData?.id,
      medicationsCount: patient.medications?.length || 0
    });
    
    demoUsers.push(user);
  });
  
  // Add caregivers as users
  database.caregivers.forEach((caregiver) => {
    demoUsers.push({
      id: caregiver.id, // Use caregiver ID directly (already has cg_ prefix)
      email: caregiver.email,
      password: 'demo123',
      name: `${caregiver.firstName} ${caregiver.lastName}`,
      role: 'caregiver',
      photoUrl: caregiver.photoUrl,
      onboardingComplete: true,
      caregiverData: {
        ...caregiver,
        id: caregiver.id
      },
    });
  });
  
  // Add doctors as users
  database.doctors.forEach((doctor) => {
    demoUsers.push({
      id: doctor.id, // Use doctor ID directly (already has doc_ prefix)
      email: doctor.email,
      password: 'demo123',
      name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      role: 'doctor',
      photoUrl: doctor.photoUrl,
      specialty: doctor.specialty,
      onboardingComplete: true,
      doctorData: {
        ...doctor,
        id: doctor.id
      },
    });
  });
  
  localStorage.setItem('mock_users', JSON.stringify(demoUsers));
  console.log(`✅ ${demoUsers.length} demo users initialized:`, {
    patients: database.patients.length,
    caregivers: database.caregivers.length,
    doctors: database.doctors.length,
    sample: demoUsers[0] ? {
      email: demoUsers[0].email,
      hasPatientData: !!demoUsers[0].patientData
    } : null
  });
  
  return demoUsers;
}

/**
 * Get medications for a specific patient
 */
export async function getDemoMedications(patientId: string): Promise<any[]> {
  const database = await loadDemoDatabase();
  console.log('🔍 getDemoMedications called with patientId:', patientId);
  console.log('📊 Available patients:', database.patients.map(p => ({ id: p.id, name: `${p.firstName} ${p.lastName}` })));
  
  // Try to find patient with various ID formats
  const patient = database.patients.find(p => 
    p.id === patientId || 
    `patient_${p.id}` === patientId ||
    p.id === patientId.replace('patient_', '')
  );
  
  if (!patient) {
    console.log(`ℹ️ Patient with ID "${patientId}" not found in demo database, returning empty medication list`);
    return [];
  }
  
  if (!patient.medications || patient.medications.length === 0) {
    console.warn(`⚠️ Patient ${patient.firstName} ${patient.lastName} has no medications`);
    return [];
  }
  
  console.log(`✅ Found ${patient.medications.length} medications for ${patient.firstName} ${patient.lastName}`);
  
  // Transform medications to the expected format
  return patient.medications.map((med: any, index) => ({
    id: index + 1,
    name: med.name,
    dosage: med.dosage,
    frequency: med.frequency,
    time: med.times?.[0] || '08:00',
    times: med.times || ['08:00'],
    mealTiming: med.mealTiming || 'any',
    startDate: med.startDate,
    duration: med.duration,
    prescribedBy: med.prescribedBy,
    condition: med.condition,
    daysOfWeek: med.daysOfWeek || {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    },
    instructions: med.instructions || `Take ${med.dosage} ${med.mealTiming} meal`,
    taken: false, // Default to not taken
  }));
}

/**
 * Get patient by ID
 */
export async function getDemoPatient(patientId: string): Promise<DemoPatient | null> {
  const database = await loadDemoDatabase();
  return database.patients.find(p => p.id === patientId || `patient_${p.id}` === patientId) || null;
}

/**
 * Get all dependents for a caregiver
 */
export async function getDemoDependents(caregiverId: string): Promise<DemoPatient[]> {
  const database = await loadDemoDatabase();
  const caregiver = database.caregivers.find(c => c.id === caregiverId || `caregiver_${c.id}` === caregiverId);
  
  if (!caregiver) {
    return [];
  }
  
  return database.patients.filter(p => caregiver.dependents.includes(p.id));
}

/**
 * Get all patients for a doctor
 */
export async function getDemoPatients(doctorId: string): Promise<DemoPatient[]> {
  const database = await loadDemoDatabase();
  const doctor = database.doctors.find(d => d.id === doctorId || `doctor_${d.id}` === doctorId);
  
  if (!doctor) {
    return [];
  }
  
  return database.patients.filter(p => doctor.patients.includes(p.id));
}

/**
 * Quick demo login - returns first patient
 */
export async function getQuickDemoUser(): Promise<any> {
  await initializeDemoUsers();
  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  
  // Return patient@demo.com (primary demo account)
  return users.find((u: any) => u.email === 'patient@demo.com') || users[0];
}
