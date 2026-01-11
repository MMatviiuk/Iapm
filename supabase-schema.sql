-- Supabase Database Schema для Medication Tracking App
-- Виконати в Supabase SQL Editor

-- 1. Користувачі (розширення auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role TEXT CHECK (role IN ('patient', 'caregiver', 'doctor')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Медикаменти
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  times TEXT[] DEFAULT '{}',
  meal_timing TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Історія прийому ліків
CREATE TABLE medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES medications ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  taken_at TIMESTAMPTZ NOT NULL,
  scheduled_time TIME,
  status TEXT CHECK (status IN ('taken', 'missed', 'skipped')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Інвентар медикаментів
CREATE TABLE medication_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES medications ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  quantity INTEGER NOT NULL,
  expiration_date DATE,
  last_scanned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Дані трекера (пульс)
CREATE TABLE tracker_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  heart_rate INTEGER,
  activity_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Зв'язок Опікун ↔ Підопічний (many-to-many)
CREATE TABLE caregiver_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID REFERENCES auth.users NOT NULL,
  patient_id UUID REFERENCES auth.users NOT NULL,
  status TEXT CHECK (status IN ('active', 'revoked')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(caregiver_id, patient_id)
);

-- 7. Зв'язок Лікар ↔ Пацієнт
CREATE TABLE doctor_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES auth.users NOT NULL,
  patient_id UUID REFERENCES auth.users NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, patient_id)
);

-- RLS (Row Level Security) Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Medications
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own medications" ON medications FOR SELECT
  USING (auth.uid() = user_id OR
         EXISTS (SELECT 1 FROM caregiver_patients WHERE patient_id = user_id AND caregiver_id = auth.uid() AND status = 'active') OR
         EXISTS (SELECT 1 FROM doctor_patients WHERE patient_id = user_id AND doctor_id = auth.uid() AND status = 'active'));

CREATE POLICY "Users manage own medications" ON medications FOR ALL
  USING (auth.uid() = user_id);

-- Medication Logs
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own logs" ON medication_logs FOR SELECT
  USING (auth.uid() = user_id OR
         EXISTS (SELECT 1 FROM caregiver_patients WHERE patient_id = user_id AND caregiver_id = auth.uid() AND status = 'active') OR
         EXISTS (SELECT 1 FROM doctor_patients WHERE patient_id = user_id AND doctor_id = auth.uid() AND status = 'active'));

CREATE POLICY "Users manage own logs" ON medication_logs FOR ALL
  USING (auth.uid() = user_id);

-- Inventory
ALTER TABLE medication_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own inventory" ON medication_inventory FOR SELECT
  USING (auth.uid() = user_id OR
         EXISTS (SELECT 1 FROM caregiver_patients WHERE patient_id = user_id AND caregiver_id = auth.uid() AND status = 'active'));

CREATE POLICY "Users manage own inventory" ON medication_inventory FOR ALL
  USING (auth.uid() = user_id);

-- Tracker Data
ALTER TABLE tracker_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own tracker data" ON tracker_data FOR SELECT
  USING (auth.uid() = user_id OR
         EXISTS (SELECT 1 FROM caregiver_patients WHERE patient_id = user_id AND caregiver_id = auth.uid() AND status = 'active') OR
         EXISTS (SELECT 1 FROM doctor_patients WHERE patient_id = user_id AND doctor_id = auth.uid() AND status = 'active'));

CREATE POLICY "Users manage own tracker data" ON tracker_data FOR ALL
  USING (auth.uid() = user_id);

-- Caregiver-Patient relationships
ALTER TABLE caregiver_patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View relationships" ON caregiver_patients FOR SELECT
  USING (auth.uid() = caregiver_id OR auth.uid() = patient_id);

CREATE POLICY "Patients can revoke access" ON caregiver_patients FOR UPDATE
  USING (auth.uid() = patient_id);

-- Indexes для продуктивності
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_medication_logs_user_id ON medication_logs(user_id);
CREATE INDEX idx_medication_logs_medication_id ON medication_logs(medication_id);
CREATE INDEX idx_tracker_data_user_id ON tracker_data(user_id);
CREATE INDEX idx_tracker_data_measured_at ON tracker_data(measured_at);
CREATE INDEX idx_caregiver_patients_caregiver ON caregiver_patients(caregiver_id);
CREATE INDEX idx_caregiver_patients_patient ON caregiver_patients(patient_id);

-- Functions для updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON medication_inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
