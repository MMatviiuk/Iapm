# Налаштування Supabase - Покрокова Інструкція

## Крок 1: Створення Проекту

1. Зайдіть на https://supabase.com
2. Натисніть **"New Project"**
3. Заповніть:
   - **Name:** Medication Tracker (або будь-яка назва)
   - **Database Password:** Збережіть пароль! (наприклад: `MedTracker2024!`)
   - **Region:** Europe (Amsterdam) - найближче до України
4. Натисніть **"Create new project"**
5. Зачекайте 1-2 хвилини поки проект створюється

## Крок 2: Запуск SQL Схеми

1. В Supabase Dashboard → ліва панель → **SQL Editor**
2. Натисніть **"+ New query"**
3. Відкрийте файл `supabase-schema.sql` з проекту
4. Скопіюйте **ВЕСЬ вміст** файлу
5. Вставте в SQL Editor
6. Натисніть **"Run"** (або Ctrl+Enter)
7. ✅ Має з'явитись "Success. No rows returned"

**Що створилось:**
- ✅ 7 таблиць (profiles, medications, logs, inventory, tracker_data, ...)
- ✅ RLS policies (безпека)
- ✅ Indexes (швидкість)
- ✅ Trigger для автоматичного створення profile

## Крок 3: Створення Тестових Користувачів

### Варіант А: Через Supabase Dashboard (рекомендовано)

1. **Authentication** → **Users** → **"Add user"** → **"Create new user"**

2. **Пацієнт:**
   - Email: `patient@demo.com`
   - Password: `Patient123!`
   - ✅ Auto Confirm User
   - User Metadata (JSON):
   ```json
   {
     "full_name": "Іван Петренко",
     "role": "patient"
   }
   ```

3. **Опікун:**
   - Email: `caregiver@demo.com`
   - Password: `Caregiver123!`
   - ✅ Auto Confirm User
   - User Metadata:
   ```json
   {
     "full_name": "Анна Коваленко",
     "role": "caregiver"
   }
   ```

4. **Лікар:**
   - Email: `doctor@demo.com`
   - Password: `Doctor123!`
   - ✅ Auto Confirm User
   - User Metadata:
   ```json
   {
     "full_name": "Олександр Шевченко",
     "role": "doctor"
   }
   ```

### Варіант Б: Через додаток

Просто зареєструйтесь в додатку використовуючи ці email/паролі.

## Крок 4: Оновлення Role в Profiles

Після створення користувачів, оновіть їх ролі:

```sql
-- Знайдіть ID користувачів
SELECT id, email FROM auth.users;

-- Оновіть ролі (замініть YOUR_ID на реальні ID з попереднього запиту)
UPDATE profiles SET role = 'patient' WHERE id = 'patient-user-id';
UPDATE profiles SET role = 'caregiver' WHERE id = 'caregiver-user-id';
UPDATE profiles SET role = 'doctor' WHERE id = 'doctor-user-id';
```

Або через SQL Editor:

```sql
-- Автоматично знайти та оновити ролі по email
UPDATE profiles p
SET role = 'patient'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'patient@demo.com';

UPDATE profiles p
SET role = 'caregiver'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'caregiver@demo.com';

UPDATE profiles p
SET role = 'doctor'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'doctor@demo.com';
```

## Крок 5: Зв'язок Опікун ↔ Пацієнт

```sql
-- Створити зв'язок: Анна опікується Іваном
INSERT INTO caregiver_patients (caregiver_id, patient_id, status)
SELECT
  (SELECT id FROM auth.users WHERE email = 'caregiver@demo.com'),
  (SELECT id FROM auth.users WHERE email = 'patient@demo.com'),
  'active';
```

## Крок 6: Отримання API Ключів

1. **Settings** → **API**
2. Скопіюйте:
   - **Project URL:** `https://xxx.supabase.co`
   - **anon public key:** `eyJhbGc...`

3. Створіть файл `.env.local` в корені проекту:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Крок 7: Перевірка

```sql
-- Перевірити користувачів
SELECT
  p.id,
  u.email,
  p.full_name,
  p.role,
  p.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id;

-- Перевірити зв'язки опікунів
SELECT
  u1.email as caregiver_email,
  u2.email as patient_email,
  cp.status
FROM caregiver_patients cp
JOIN auth.users u1 ON cp.caregiver_id = u1.id
JOIN auth.users u2 ON cp.patient_id = u2.id;
```

## Крок 8: Додати Демо Медикаменти (опціонально)

```sql
-- Додати ліки для пацієнта
INSERT INTO medications (user_id, name, dosage, frequency, times, status)
SELECT
  id,
  'Аспірин',
  '100 мг',
  'daily',
  ARRAY['09:00', '21:00'],
  'active'
FROM auth.users WHERE email = 'patient@demo.com';

INSERT INTO medications (user_id, name, dosage, frequency, times, status)
SELECT
  id,
  'Метформін',
  '500 мг',
  'daily',
  ARRAY['08:00', '14:00', '20:00'],
  'active'
FROM auth.users WHERE email = 'patient@demo.com';
```

## ✅ Готово!

Тепер можна:
1. Запустити додаток: `npm run dev`
2. Увійти як `patient@demo.com` / `Patient123!`
3. Або як `caregiver@demo.com` / `Caregiver123!`

---

## Troubleshooting

### Помилка: "violates foreign key constraint"
- Означає що ви намагаєтесь вставити profile з ID, якого немає в auth.users
- Рішення: Створіть користувача через Authentication → Users

### Помилка: "column does not exist"
- Перевірте що ви запустили `supabase-schema.sql`
- Видаліть таблиці та запустіть заново

### RLS блокує запити
- Перевірте що ви авторизовані (auth.uid() повертає ID)
- Або тимчасово вимкніть RLS: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`

### Як видалити все і почати заново?

```sql
-- УВАГА: Це видалить ВСІ дані!
DROP TABLE IF EXISTS doctor_patients CASCADE;
DROP TABLE IF EXISTS caregiver_patients CASCADE;
DROP TABLE IF EXISTS tracker_data CASCADE;
DROP TABLE IF EXISTS medication_inventory CASCADE;
DROP TABLE IF EXISTS medication_logs CASCADE;
DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Тепер запустіть supabase-schema.sql заново
```
