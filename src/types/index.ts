// Core Types for Prescription Clarity

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timesPerDay: string[];
  mealTiming?: string;
  duration?: {
    amount: number;
    unit: 'days' | 'weeks' | 'months' | 'lifetime';
  };
  startDate: string;
  endDate?: string;
  notes?: string;
  photoUrl?: string;
  active: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicationHistoryEntry {
  id?: string;
  medicationId: string;
  medicationName: string;
  date: string;
  time: string;
  taken: boolean;
  skippedReason?: string;
  takenAt?: string;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  role: 'myself' | 'caregiver' | 'doctor';
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dependent {
  id: string;
  caregiverId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: string;
  gender?: 'Male' | 'Female' | 'Other';
  photoUrl?: string;
  medications?: Prescription[];
  adherence?: number;
  createdAt: string;
}

export interface Patient {
  id: string;
  doctorId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: 'Male' | 'Female' | 'Other';
  photoUrl?: string;
  email?: string;
  phone?: string;
  medications?: Prescription[];
  adherence?: number;
  isAtRisk?: boolean;
  createdAt: string;
}

export interface AdherenceStats {
  overall: number;
  last7Days: number;
  last30Days: number;
  byMedication: Record<string, { taken: number; total: number; percentage: number }>;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
}

export interface DashboardStats {
  totalMedications: number;
  activeMedications: number;
  todaysDoses: number;
  dosesTaken: number;
  adherenceRate: number;
  upcomingDoses: Array<{
    medicationId: string;
    medicationName: string;
    time: string;
    dosage: string;
  }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface NotificationSettings {
  enabled: boolean;
  medicationReminders: boolean;
  adherenceAlerts: boolean;
  refillReminders: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderTime: number; // minutes before dose
}

// Database Types (from complete-database.json)

export interface DatabaseMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  mealTiming: 'before' | 'with' | 'after' | 'any';
  startDate: string;
  duration: string;
  prescribedBy: string;
  condition: string;
  daysOfWeek?: string[];
}

export interface DatabaseAddress {
  street: string;
  city: string;
  postcode: string;
  country: string;
}

export interface DatabasePatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  photoUrl: string;
  address: DatabaseAddress;
  caregiverId: string;
  primaryDoctorId: string;
  medications: DatabaseMedication[];
  adherenceRate: number;
}

export interface DatabaseDoctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  phoneNumber: string;
  photoUrl: string;
  yearsOfExperience: number;
  patients: string[];
}

export interface DatabaseCaregiver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
  relationship: string;
  dependents: string[];
}

export interface CompleteDatabase {
  doctors: DatabaseDoctor[];
  caregivers: DatabaseCaregiver[];
  patients: DatabasePatient[];
}
