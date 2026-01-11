import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  role: 'patient' | 'caregiver' | 'doctor';
  full_name: string;
  phone?: string;
  avatar_url?: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  times: string[];
  meal_timing?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  deleted_at?: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at: string;
  scheduled_time?: string;
  status: 'taken' | 'missed' | 'skipped';
}

export interface MedicationInventory {
  id: string;
  medication_id: string;
  user_id: string;
  quantity: number;
  expiration_date?: string;
  last_scanned_at?: string;
}

export interface TrackerData {
  id: string;
  user_id: string;
  measured_at: string;
  heart_rate: number;
  activity_level?: string;
}

// API Functions
export const api = {
  // Auth
  signUp: async (email: string, password: string, userData: { role: string; full_name: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Medications
  getMedications: async (userId: string) => {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  addMedication: async (medication: Partial<Medication>) => {
    const { data, error } = await supabase.from('medications').insert([medication]).select();
    return { data, error };
  },

  updateMedication: async (id: string, updates: Partial<Medication>) => {
    const { data, error } = await supabase.from('medications').update(updates).eq('id', id).select();
    return { data, error };
  },

  deleteMedication: async (id: string) => {
    const { data, error } = await supabase
      .from('medications')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return { data, error };
  },

  // Medication Logs
  logMedication: async (log: Partial<MedicationLog>) => {
    const { data, error } = await supabase.from('medication_logs').insert([log]).select();
    return { data, error };
  },

  getMedicationLogs: async (userId: string, startDate?: string, endDate?: string) => {
    let query = supabase.from('medication_logs').select('*').eq('user_id', userId);
    if (startDate) query = query.gte('taken_at', startDate);
    if (endDate) query = query.lte('taken_at', endDate);
    const { data, error } = await query.order('taken_at', { ascending: false });
    return { data, error };
  },

  // Inventory
  getInventory: async (userId: string) => {
    const { data, error } = await supabase.from('medication_inventory').select('*').eq('user_id', userId);
    return { data, error };
  },

  updateInventory: async (medicationId: string, quantity: number) => {
    const { data: existing } = await supabase
      .from('medication_inventory')
      .select('id')
      .eq('medication_id', medicationId)
      .single();

    if (existing) {
      return await supabase
        .from('medication_inventory')
        .update({ quantity, last_scanned_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      return await supabase.from('medication_inventory').insert([
        {
          medication_id: medicationId,
          quantity,
          last_scanned_at: new Date().toISOString(),
        },
      ]);
    }
  },

  // Tracker Data
  addTrackerData: async (data: Partial<TrackerData>) => {
    const { data: result, error } = await supabase.from('tracker_data').insert([data]).select();
    return { data: result, error };
  },

  getTrackerData: async (userId: string, startDate?: string, endDate?: string) => {
    let query = supabase.from('tracker_data').select('*').eq('user_id', userId);
    if (startDate) query = query.gte('measured_at', startDate);
    if (endDate) query = query.lte('measured_at', endDate);
    const { data, error } = await query.order('measured_at', { ascending: true });
    return { data, error };
  },

  // Caregiver-Patient
  addCaregiverRelationship: async (caregiverId: string, patientId: string) => {
    const { data, error } = await supabase
      .from('caregiver_patients')
      .insert([{ caregiver_id: caregiverId, patient_id: patientId }])
      .select();
    return { data, error };
  },

  revokeCaregiverAccess: async (caregiverId: string, patientId: string) => {
    const { data, error } = await supabase
      .from('caregiver_patients')
      .update({ status: 'revoked' })
      .eq('caregiver_id', caregiverId)
      .eq('patient_id', patientId);
    return { data, error };
  },

  getPatients: async (caregiverId: string) => {
    const { data, error } = await supabase
      .from('caregiver_patients')
      .select('patient_id, profiles!patient_id(*)')
      .eq('caregiver_id', caregiverId)
      .eq('status', 'active');
    return { data, error };
  },
};

// Real-time subscriptions
export const subscribeToMedications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('medications_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'medications', filter: `user_id=eq.${userId}` }, callback)
    .subscribe();
};

export const subscribeToMedicationLogs = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('logs_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'medication_logs', filter: `user_id=eq.${userId}` }, callback)
    .subscribe();
};
