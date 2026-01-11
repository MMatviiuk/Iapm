-- IAPM Supabase Database Schema
-- Создание таблиц для системы управления лекарствами

-- Включение расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Пользователи (расширение auth.users уже есть в Supabase)
-- Добавляем дополнительные поля к профилю пользователя
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    role TEXT CHECK (role IN ('patient', 'caregiver', 'doctor')) NOT NULL DEFAULT 'patient',
    photo_url TEXT,
    onboarding_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Лекарства/Рецепты
CREATE TABLE IF NOT EXISTS medications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    form TEXT CHECK (form IN ('tablet', 'capsule', 'liquid', 'injection', 'patch', 'other')) DEFAULT 'tablet',
    frequency TEXT NOT NULL,
    times_per_day TEXT[] NOT NULL,
    meal_timing TEXT CHECK (meal_timing IN ('before', 'with', 'after', 'anytime')) DEFAULT 'anytime',
    days_of_week TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    start_date DATE NOT NULL,
    end_date DATE,
    duration TEXT,
    instructions TEXT,
    condition TEXT,
    prescribed_by TEXT,
    photo_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- История приема лекарств
CREATE TABLE IF NOT EXISTS medication_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    taken BOOLEAN NOT NULL,
    skipped_reason TEXT,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Подопечные (для сиделок)
CREATE TABLE IF NOT EXISTS dependents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    caregiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    relationship TEXT NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Пациенты (для врачей)
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    email TEXT,
    phone TEXT,
    photo_url TEXT,
    is_at_risk BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Уведомления
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('reminder', 'adherence_alert', 'refill_reminder', 'achievement')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Настройки уведомлений
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    medication_reminders BOOLEAN DEFAULT true,
    adherence_alerts BOOLEAN DEFAULT true,
    refill_reminders BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    reminder_time_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Достижения
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    progress INTEGER DEFAULT 0,
    target INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Синхронизация (для отслеживания изменений)
CREATE TABLE IF NOT EXISTS sync_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE,
    device_id TEXT
);

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_active ON medications(active);
CREATE INDEX IF NOT EXISTS idx_medication_history_medication_id ON medication_history(medication_id);
CREATE INDEX IF NOT EXISTS idx_medication_history_user_id ON medication_history(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_history_date ON medication_history(date);
CREATE INDEX IF NOT EXISTS idx_dependents_caregiver_id ON dependents(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON patients(doctor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_at ON notifications(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_sync_log_user_id ON sync_log(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_timestamp ON sync_log(timestamp);

-- Включение Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependents ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

-- Политики безопасности (RLS Policies)

-- Профили: пользователи могут видеть только свой профиль
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Лекарства: пользователи могут управлять только своими лекарствами
CREATE POLICY "Users can view own medications" ON medications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own medications" ON medications
    FOR ALL USING (auth.uid() = user_id);

-- История приема лекарств
CREATE POLICY "Users can view own medication history" ON medication_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medication history" ON medication_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medication history" ON medication_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Подопечные: сиделки могут управлять только своими подопечными
CREATE POLICY "Caregivers can view own dependents" ON dependents
    FOR SELECT USING (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can manage own dependents" ON dependents
    FOR ALL USING (auth.uid() = caregiver_id);

-- Пациенты: врачи могут управлять только своими пациентами
CREATE POLICY "Doctors can view own patients" ON patients
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can manage own patients" ON patients
    FOR ALL USING (auth.uid() = doctor_id);

-- Уведомления
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- Настройки уведомлений
CREATE POLICY "Users can manage own notification settings" ON notification_settings
    FOR ALL USING (auth.uid() = user_id);

-- Достижения
CREATE POLICY "Users can view own achievements" ON achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own achievements" ON achievements
    FOR ALL USING (auth.uid() = user_id);

-- Лог синхронизации
CREATE POLICY "Users can manage own sync log" ON sync_log
    FOR ALL USING (auth.uid() = user_id);

-- Создание триггеров для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Применение триггеров к таблицам
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dependents_updated_at BEFORE UPDATE ON dependents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Создание функции для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (new.id, new.email, SPLIT_PART(new.raw_user_meta_data->>'name', ' ', 1), 
            SPLIT_PART(new.raw_user_meta_data->>'name', ' ', 2), 
            COALESCE(new.raw_user_meta_data->>'role', 'patient'));
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Создание представлений (Views) для удобных запросов

-- Статистика по приему лекарств
CREATE OR REPLACE VIEW medication_adherence_stats AS
SELECT 
    m.user_id,
    m.id as medication_id,
    m.name,
    COUNT(mh.id) as total_doses,
    COUNT(CASE WHEN mh.taken = true THEN 1 END) as taken_doses,
    ROUND(
        (COUNT(CASE WHEN mh.taken = true THEN 1 END) * 100.0 / 
         NULLIF(COUNT(mh.id), 0)), 2
    ) as adherence_percentage
FROM medications m
LEFT JOIN medication_history mh ON m.id = mh.medication_id
WHERE m.active = true
GROUP BY m.user_id, m.id, m.name;

-- Сьогоднішні дози
CREATE OR REPLACE VIEW todays_doses AS
SELECT 
    m.user_id,
    m.id as medication_id,
    m.name,
    m.dosage,
    t.time_text::time as time,
    CASE 
        WHEN mh.taken = true THEN 'taken'
        WHEN mh.date = CURRENT_DATE AND mh.time = t.time_text::time THEN 'skipped'
        ELSE 'pending'
    END as status
FROM medications m
JOIN LATERAL (
    SELECT NULLIF(TRIM(x), '') AS time_text
    FROM unnest(m.times_per_day) AS x
) AS t(time_text) ON t.time_text IS NOT NULL
LEFT JOIN medication_history mh ON m.id = mh.medication_id 
    AND mh.date = CURRENT_DATE 
    AND mh.time = t.time_text::time
WHERE m.active = true 
    AND m.start_date <= CURRENT_DATE 
    AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE)
    AND EXISTS (
        SELECT 1
        FROM unnest(m.days_of_week) AS d(day)
        WHERE LOWER(TRIM(day)) = LOWER(TRIM(TO_CHAR(CURRENT_DATE, 'Day')))
    );

-- Вставка демо-данных (опционально)
INSERT INTO public.profiles (id, email, first_name, last_name, role, onboarding_complete) VALUES
    (uuid_generate_v4(), 'patient@demo.com', 'John', 'Smith', 'patient', true),
    (uuid_generate_v4(), 'caregiver@demo.com', 'Anna', 'Johnson', 'caregiver', true),
    (uuid_generate_v4(), 'doctor@demo.com', 'James', 'Anderson', 'doctor', true)
ON CONFLICT (id) DO NOTHING;
