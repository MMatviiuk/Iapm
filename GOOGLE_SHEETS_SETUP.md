# 📊 Настройка Google Sheets как Backend

Эта инструкция поможет вам настроить Google Sheets в качестве базы данных для вашего приложения.

---

## 🎯 Зачем Google Sheets?

**Преимущества для домашнего проекта:**
- ✅ **Бесплатно** - никаких затрат на хостинг
- ✅ **Безопасно** - данные хранятся в вашем Google Drive
- ✅ **Просто** - не нужен сервер и база данных
- ✅ **Доступно** - можете редактировать данные прямо в таблице
- ✅ **Sharing** - легко дать доступ другим пользователям

---

## 📋 Структура Таблиц

Вам нужно создать **одну Google Spreadsheet** с **4 листами (tabs)**:

### 📄 Лист 1: `users`
Все пользователи приложения (пациенты, опекуны, врачи)

| Колонка | Тип | Описание | Пример |
|---------|-----|----------|--------|
| id | текст | Уникальный ID | `user_001` |
| email | текст | Email для входа | `patient@example.com` |
| password | текст | Пароль (хэш в продакшне!) | `password123` |
| name | текст | Полное имя | `Иван Иванов` |
| role | текст | Роль: patient/caregiver/doctor | `patient` |
| dateOfBirth | дата | Дата рождения | `1950-05-15` |
| gender | текст | Пол: male/female | `male` |
| photoUrl | текст | URL фото профиля | `https://...` |
| onboardingComplete | boolean | Завершена ли регистрация | `TRUE` |
| createdAt | дата-время | Когда создан аккаунт | `2025-01-11 10:00:00` |

**Пример строк:**
```
id           email                  password    name            role      dateOfBirth  gender  photoUrl  onboardingComplete  createdAt
user_001     patient@demo.com       demo123     Иван Иванов     patient   1950-05-15   male    (пусто)   TRUE                2025-01-11 10:00:00
user_002     caregiver@demo.com     demo123     Мария Петрова   caregiver 1975-08-22   female  (пусто)   TRUE                2025-01-11 10:00:00
```

---

### 📄 Лист 2: `medications`
Все лекарства всех пользователей

| Колонка | Тип | Описание | Пример |
|---------|-----|----------|--------|
| id | текст | Уникальный ID лекарства | `med_001` |
| userId | текст | ID пациента (foreign key) | `user_001` |
| name | текст | Название лекарства | `Aspirin` |
| dosage | текст | Дозировка | `100mg` |
| form | текст | Форма: Tablet/Capsule/Liquid | `Tablet` |
| frequency | текст | Частота: once daily/twice daily | `once daily` |
| times | текст | Время приема (JSON массив) | `["08:00"]` |
| mealTiming | текст | До/во время/после еды | `with meal` |
| startDate | дата | Дата начала приема | `2025-01-01` |
| endDate | дата | Дата окончания (может быть пусто) | `2025-12-31` |
| status | текст | SCHEDULED/ACTIVE/COMPLETED | `ACTIVE` |
| prescribedBy | текст | Кто назначил (имя врача) | `Dr. Smith` |
| createdAt | дата-время | Когда добавлено | `2025-01-11 10:00:00` |

**Пример строк:**
```
id       userId    name     dosage  form    frequency    times       mealTiming  startDate   endDate     status  prescribedBy  createdAt
med_001  user_001  Aspirin  100mg   Tablet  once daily   ["08:00"]   with meal   2025-01-01  (пусто)     ACTIVE  Self          2025-01-11 10:00:00
med_002  user_001  Metformin 500mg  Tablet  twice daily  ["08:00","20:00"]  with meal   2025-01-01  2025-12-31  ACTIVE  Dr. Smith     2025-01-11 10:00:00
```

---

### 📄 Лист 3: `medication_log`
История приема лекарств (когда пациент отметил "принято")

| Колонка | Тип | Описание | Пример |
|---------|-----|----------|--------|
| id | текст | Уникальный ID записи | `log_001` |
| medicationId | текст | ID лекарства (foreign key) | `med_001` |
| userId | текст | ID пациента | `user_001` |
| scheduledTime | время | Запланированное время | `08:00` |
| takenAt | дата-время | Когда фактически принято | `2025-01-11 08:15:00` |
| status | текст | taken/skipped/missed | `taken` |
| notes | текст | Заметки (необязательно) | `Принял с завтраком` |
| createdAt | дата-время | Когда создана запись | `2025-01-11 08:15:00` |

**Пример строк:**
```
id       medicationId  userId    scheduledTime  takenAt               status  notes              createdAt
log_001  med_001       user_001  08:00          2025-01-11 08:15:00   taken   Принял с завтраком 2025-01-11 08:15:00
log_002  med_001       user_001  08:00          2025-01-12 08:10:00   taken   (пусто)            2025-01-12 08:10:00
```

---

### 📄 Лист 4: `caregivers_dependents`
Связь между опекунами и подопечными

| Колонка | Тип | Описание | Пример |
|---------|-----|----------|--------|
| id | текст | Уникальный ID связи | `rel_001` |
| caregiverId | текст | ID опекуна (foreign key) | `user_002` |
| dependentId | текст | ID подопечного (foreign key) | `user_001` |
| relationship | текст | Кем приходится | `Daughter` / `Дочь` |
| createdAt | дата-время | Когда добавлена связь | `2025-01-11 10:00:00` |

**Пример строк:**
```
id       caregiverId  dependentId  relationship  createdAt
rel_001  user_002     user_001     Дочь          2025-01-11 10:00:00
```

---

## 🚀 Пошаговая Настройка

### Вариант A: Sheety.co (РЕКОМЕНДУЕТСЯ - Самый Простой!)

Sheety превращает вашу Google Sheets в REST API за 5 минут.

#### Шаг 1: Создайте Google Spreadsheet

1. Откройте [Google Sheets](https://sheets.google.com)
2. Создайте новую таблицу
3. Назовите её: **"MedicationApp_Database"**
4. Создайте 4 листа (tabs):
   - `users`
   - `medications`
   - `medication_log`
   - `caregivers_dependents`
5. В каждом листе добавьте **заголовки колонок** (первая строка):

**Лист `users`:**
```
id | email | password | name | role | dateOfBirth | gender | photoUrl | onboardingComplete | createdAt
```

**Лист `medications`:**
```
id | userId | name | dosage | form | frequency | times | mealTiming | startDate | endDate | status | prescribedBy | createdAt
```

**Лист `medication_log`:**
```
id | medicationId | userId | scheduledTime | takenAt | status | notes | createdAt
```

**Лист `caregivers_dependents`:**
```
id | caregiverId | dependentId | relationship | createdAt
```

6. **Добавьте тестовые данные** (минимум 1 строку в каждый лист):

**Лист `users` - добавьте 2 строки:**
```
user_001 | patient@demo.com | demo123 | Иван Иванов | patient | 1950-05-15 | male | | TRUE | 2025-01-11 10:00:00
user_002 | caregiver@demo.com | demo123 | Мария Петрова | caregiver | 1975-08-22 | female | | TRUE | 2025-01-11 10:00:00
```

**Лист `medications` - добавьте 1 строку:**
```
med_001 | user_001 | Aspirin | 100mg | Tablet | once daily | ["08:00"] | with meal | 2025-01-01 | | ACTIVE | Self | 2025-01-11 10:00:00
```

**Лист `medication_log` - добавьте 1 строку:**
```
log_001 | med_001 | user_001 | 08:00 | 2025-01-11 08:15:00 | taken | | 2025-01-11 08:15:00
```

**Лист `caregivers_dependents` - добавьте 1 строку:**
```
rel_001 | user_002 | user_001 | Дочь | 2025-01-11 10:00:00
```

#### Шаг 2: Получите ссылку на таблицу

1. Нажмите **Share** (Поделиться) в правом верхнем углу
2. Выберите **Anyone with the link can view**
3. Скопируйте ссылку - она выглядит так:
```
https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit#gid=0
```

#### Шаг 3: Настройте Sheety.co

1. Откройте [Sheety.co](https://sheety.co)
2. Нажмите **"Get Started"** / **"Sign Up"** (бесплатно!)
3. Войдите через Google аккаунт
4. Нажмите **"New Project"**
5. Вставьте ссылку на вашу Google Sheets
6. Нажмите **"Create"**
7. Sheety создаст API endpoints для вашей таблицы!

#### Шаг 4: Получите API URL

После создания проекта, Sheety покажет вам API URL, например:
```
https://api.sheety.co/your-username/medicationapp-database/users
https://api.sheety.co/your-username/medicationapp-database/medications
https://api.sheety.co/your-username/medicationapp-database/medicationLog
https://api.sheety.co/your-username/medicationapp-database/caregiversDependents
```

**Важно:** Sheety конвертирует названия листов в camelCase:
- `users` → `users` (без изменений)
- `medications` → `medications` (без изменений)
- `medication_log` → `medicationLog` (camelCase!)
- `caregivers_dependents` → `caregiversDependents` (camelCase!)

#### Шаг 5: Настройте переменные окружения

В корне проекта создайте файл `.env`:

```bash
VITE_SHEETY_API_URL=https://api.sheety.co/your-username/medicationapp-database
VITE_USE_GOOGLE_SHEETS=true
```

**Замените:**
- `your-username` - ваш username в Sheety
- `medicationapp-database` - название вашего проекта

#### Шаг 6: Готово!

Теперь приложение будет использовать Google Sheets! 🎉

---

### Вариант B: Google Sheets API v4 (Больше Контроля)

Если хотите прямую интеграцию без Sheety:

#### Шаг 1: Создайте Google Cloud Project

1. Откройте [Google Cloud Console](https://console.cloud.google.com)
2. Создайте новый проект: **"MedicationApp"**
3. Включите **Google Sheets API**:
   - APIs & Services → Library
   - Найдите "Google Sheets API"
   - Нажмите "Enable"

#### Шаг 2: Создайте API Credentials

1. APIs & Services → Credentials
2. Create Credentials → **API Key**
3. Скопируйте API Key
4. **Ограничьте API Key** (важно для безопасности!):
   - Edit API Key
   - API restrictions → Restrict key
   - Выберите: Google Sheets API
   - Сохраните

#### Шаг 3: Создайте OAuth 2.0 Client ID (для авторизации пользователей)

1. APIs & Services → Credentials
2. Create Credentials → **OAuth client ID**
3. Application type: **Web application**
4. Authorized redirect URIs:
   ```
   http://localhost:3000
   https://ваш-домен.com
   ```
5. Скопируйте **Client ID** и **Client Secret**

#### Шаг 4: Настройте .env

```bash
VITE_GOOGLE_SHEETS_API_KEY=ваш_api_key
VITE_GOOGLE_OAUTH_CLIENT_ID=ваш_client_id
VITE_GOOGLE_OAUTH_CLIENT_SECRET=ваш_client_secret
VITE_GOOGLE_SPREADSHEET_ID=1ABC...XYZ  # из URL таблицы
VITE_USE_GOOGLE_SHEETS=true
```

#### Шаг 5: Установите библиотеки

```bash
npm install gapi-script @react-oauth/google
```

---

## 🔐 Безопасность

### ⚠️ ВАЖНО для Продакшна:

1. **Пароли:** В таблице `users` храните **хэши паролей**, а не plain text!
   - Используйте bcrypt: `npm install bcryptjs`
   - Хэшируйте пароль перед сохранением:
   ```javascript
   import bcrypt from 'bcryptjs';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **API Keys:** Никогда не коммитьте `.env` в Git!
   - Добавьте `.env` в `.gitignore` (уже сделано)

3. **Sheet Permissions:**
   - Для Sheety: можно сделать API приватным (нужен API token)
   - Для Google API: настройте OAuth правильно

4. **HTTPS:** В продакшне используйте только HTTPS!

---

## 🧪 Тестирование

### Тест 1: Проверка подключения к Sheety

Откройте в браузере:
```
https://api.sheety.co/your-username/medicationapp-database/users
```

Должен вернуться JSON с вашими пользователями:
```json
{
  "users": [
    {
      "id": "user_001",
      "email": "patient@demo.com",
      "name": "Иван Иванов",
      ...
    }
  ]
}
```

### Тест 2: Проверка в приложении

1. Запустите приложение:
```bash
npm run dev
```

2. Откройте http://localhost:3000
3. Попробуйте войти с:
   - Email: `patient@demo.com`
   - Password: `demo123`

4. Если вход успешен - всё работает! 🎉

---

## 🔄 API Операции

### Sheety API Format

**GET все записи:**
```javascript
fetch('https://api.sheety.co/your-username/medicationapp-database/users')
  .then(res => res.json())
  .then(data => console.log(data.users));
```

**POST новая запись:**
```javascript
fetch('https://api.sheety.co/your-username/medicationapp-database/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user: {
      id: 'user_003',
      email: 'new@example.com',
      password: 'pass123',
      name: 'Новый Пользователь',
      role: 'patient',
      ...
    }
  })
})
```

**PUT обновить запись:**
```javascript
fetch('https://api.sheety.co/your-username/medicationapp-database/users/2', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user: {
      name: 'Обновленное Имя'
    }
  })
})
```

**DELETE удалить:**
```javascript
fetch('https://api.sheety.co/your-username/medicationapp-database/users/2', {
  method: 'DELETE'
})
```

---

## 📊 Структура ID в Таблицах

**Формат ID:**
- Пользователи: `user_001`, `user_002`, ...
- Лекарства: `med_001`, `med_002`, ...
- Логи: `log_001`, `log_002`, ...
- Связи: `rel_001`, `rel_002`, ...

**Генерация ID в приложении:**
```javascript
// Генерация нового ID
const newUserId = `user_${Date.now()}`;
const newMedId = `med_${Date.now()}`;
```

---

## ❓ FAQ

### Q: Сколько это стоит?
**A:** Бесплатно!
- Google Sheets: бесплатно
- Sheety: бесплатно до 500 запросов/месяц
- Google Sheets API: бесплатно до 100 запросов/100 секунд

### Q: Какие ограничения?
**A:**
- Sheety free: 500 запросов/месяц (достаточно для 2-10 пользователей)
- Google Sheets API free: 100 запросов/100 секунд
- Размер таблицы: до 5 млн ячеек

### Q: Безопасно ли?
**A:** Для домашнего проекта - да! Для продакшна - нужно добавить:
- Хэширование паролей
- HTTPS
- OAuth авторизацию
- API rate limiting

### Q: Можно ли потом мигрировать на настоящую БД?
**A:** Да! Просто замените `api.ts` на вызовы к новому backend. Структура данных останется той же.

---

## 📞 Поддержка

Если что-то не работает:

1. Проверьте что таблица доступна по ссылке
2. Проверьте что Sheety проект создан правильно
3. Проверьте `.env` файл
4. Проверьте console в браузере (F12) на ошибки

---

**Следующий шаг:** Модификация `/src/services/api.ts` для работы с Google Sheets!

---

*Дата создания: 11 января 2026*
*Версия: 1.0*
