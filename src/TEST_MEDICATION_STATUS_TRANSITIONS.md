# 🧪 ТЕСТ: Автоматична Зміна Статусів Medication

## 📅 Поточна Дата: 12 Листопада 2025

---

## ✅ ТЕСТ 1: SCHEDULED → ACTIVE (Завтра стає Сьогодні)

### Створюємо medication з startDate = ЗАВТРА (13 листопада)

**Дані для створення:**
```json
{
  "name": "TEST: Vitamin D",
  "dosage": "1000 IU",
  "form": "tablet",
  "quantity": 1,
  "timesPerDay": 1,
  "time": "09:00",
  "startDate": "2025-11-13",
  "endDate": "2025-12-13"
}
```

### Очікувана Поведінка

**СЬОГОДНІ (12 Листопада 2025):**
- ✅ Status: `SCHEDULED` (startDate > today)
- ✅ Показується в "All Medications" з синім бейджем
- ❌ НЕ показується в "Today's Schedule"
- ❌ НЕ можна відмітити прийом (кнопка disabled)
- ✅ Можна редагувати/видалити

**ЗАВТРА (13 Листопада 2025):**
- ✅ Status: `ACTIVE` (startDate <= today <= endDate)
- ✅ Показується в "Today's Schedule"
- ✅ Показується в "All Medications" з зеленим бейджем
- ✅ МОЖНА відмітити прийом (кнопка active)

---

## ✅ ТЕСТ 2: ACTIVE → COMPLETED (Курс Завершується)

### Створюємо medication з endDate = ВЧОРА (11 листопада)

**Дані для створення:**
```json
{
  "name": "TEST: Antibiotics Course",
  "dosage": "500mg",
  "form": "tablet",
  "quantity": 1,
  "timesPerDay": 2,
  "times": ["08:00", "20:00"],
  "startDate": "2025-10-28",
  "endDate": "2025-11-11"
}
```

### Очікувана Поведінка

**ВЧОРА (11 Листопада 2025):**
- ✅ Status: `ACTIVE` (today <= endDate)
- ✅ Показувався в "Today's Schedule"
- ✅ Можна було відмітити прийом

**СЬОГОДНІ (12 Листопада 2025):**
- ✅ Status: `COMPLETED` (endDate < today)
- ❌ НЕ показується в "Today's Schedule"
- ✅ Показується в "All Medications" з сірим бейджем
- ✅ Показується в "History" (read-only)
- ❌ НЕ можна відмітити прийом

**Помилка при спробі відмітити:**
```
❌ "Cannot mark completed medication as taken"
"This medication course ended on 11 November 2025"
```

---

## ✅ ТЕСТ 3: Lifetime Medication (Без Дат)

### Створюємо medication БЕЗ startDate і endDate

**Дані для створення:**
```json
{
  "name": "TEST: Blood Pressure Pills",
  "dosage": "5mg",
  "form": "tablet",
  "quantity": 1,
  "timesPerDay": 1,
  "time": "08:00",
  "startDate": null,
  "endDate": null
}
```

### Очікувана Поведінка

**ЗАВЖДИ:**
- ✅ Status: `ACTIVE` (немає дат = lifetime)
- ✅ Показується в "Today's Schedule"
- ✅ Показується в "All Medications" з зеленим бейджем
- ✅ ЗАВЖДИ можна відмітити прийом
- ✅ Ніколи не стане COMPLETED або SCHEDULED

---

## ✅ ТЕСТ 4: Створення "Заднім Числом"

### Створюємо medication з датами в минулому

**Дані для створення:**
```json
{
  "name": "TEST: Old Vitamins",
  "dosage": "500mg",
  "form": "tablet",
  "quantity": 1,
  "timesPerDay": 1,
  "time": "09:00",
  "startDate": "2025-10-01",
  "endDate": "2025-10-15",
  "createdAt": "2025-11-12"
}
```

### Очікувана Поведінка

**ВІДРАЗУ ПІСЛЯ СТВОРЕННЯ:**
- ✅ Status: `COMPLETED` (автоматично розраховано)
- ❌ НЕ показується в "Today's Schedule"
- ✅ Показується в "All Medications" (сірий бейдж)
- ✅ Показується в "History" (read-only)
- ❌ НЕ можна відмітити прийом

---

## 🔍 Як Перевірити в Коді

### 1. Відкрийте Developer Console (F12)

### 2. Додайте тестовий medication:

```javascript
// ТЕСТ 1: SCHEDULED (стартує завтра)
const testScheduled = {
  id: Date.now(),
  name: "TEST: Vitamin D (Scheduled)",
  dosage: "1000 IU",
  form: "tablet",
  quantity: 1,
  timesPerDay: 1,
  time: "09:00",
  startDate: "2025-11-13", // ← ЗАВТРА
  endDate: "2025-12-13",
  daysOfWeek: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
};

// Додайте його до medications
const currentMeds = JSON.parse(localStorage.getItem('medications') || '[]');
currentMeds.push(testScheduled);
localStorage.setItem('medications', JSON.stringify(currentMeds));
location.reload();
```

### 3. Перевірте статус у console:

```javascript
import { calculateMedicationStatus } from '../utils/medicationStatusManager';

const medication = {
  startDate: "2025-11-13",
  endDate: "2025-12-13"
};

console.log(calculateMedicationStatus(medication)); 
// Має показати: "SCHEDULED"
```

### 4. Змініть дату на завтра:

```javascript
// Симулюємо завтра (13 листопада)
const medication = {
  startDate: "2025-11-13",
  endDate: "2025-12-13"
};

// Підміняємо сьогоднішню дату
const originalDate = Date;
global.Date = class extends Date {
  constructor() {
    super();
    return new originalDate('2025-11-13T12:00:00');
  }
};

console.log(calculateMedicationStatus(medication)); 
// Має показати: "ACTIVE" ✅
```

---

## 📊 Логіка Розрахунку (Код)

```typescript
export function calculateMedicationStatus(medication: MedicationWithStatus): MedicationStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Порівнюємо тільки дати

  const startDate = medication.startDate ? new Date(medication.startDate) : null;
  const endDate = medication.endDate ? new Date(medication.endDate) : null;

  if (startDate) startDate.setHours(0, 0, 0, 0);
  if (endDate) endDate.setHours(0, 0, 0, 0);

  // 1. Якщо endDate < today → COMPLETED
  if (endDate && endDate < today) {
    return 'COMPLETED';
  }

  // 2. Якщо startDate > today → SCHEDULED
  if (startDate && startDate > today) {
    return 'SCHEDULED';
  }

  // 3. У всіх інших випадках → ACTIVE
  return 'ACTIVE';
}
```

---

## ✅ Де Використовується Автоматичний Розрахунок

### 1. MainSchedule.tsx (рядок 256)
```typescript
// Step 1: Update all medication statuses
const medicationsWithStatus = updateMedicationStatuses(medications || []);

// Step 2: Filter only ACTIVE medications
const filteredMedications = medicationsWithStatus
  .filter(med => shouldShowInTodayList(med)) // ← Тільки ACTIVE
```

### 2. MedicationsList.tsx
```typescript
const medicationsWithStatus = updateMedicationStatuses(medications);
// Показує всі medications з правильними бейджами
```

### 3. History.tsx
```typescript
const medicationsWithStatus = updateMedicationStatuses(medications);
const historyMedications = medicationsWithStatus
  .filter(med => shouldShowInHistory(med)); // ← ACTIVE + COMPLETED
```

---

## 🎯 Acceptance Criteria (AC) - Перевірка

| № | Критерій | Очікуваний Результат | Status |
|---|----------|----------------------|--------|
| 1 | Medication з startDate > today | Status = SCHEDULED | ✅ |
| 2 | SCHEDULED не показується в Today | НЕ у списку Today's Schedule | ✅ |
| 3 | SCHEDULED не можна відмітити | canMarkMedicationTaken() = false | ✅ |
| 4 | Коли startDate настає | Status змінюється на ACTIVE | ⚠️ **ПЕРЕВІРИТИ** |
| 5 | ACTIVE можна відмітити | canMarkMedicationTaken() = true | ✅ |
| 6 | ACTIVE показується в Today | У списку Today's Schedule | ✅ |
| 7 | Коли endDate минає | Status змінюється на COMPLETED | ⚠️ **ПЕРЕВІРИТИ** |
| 8 | COMPLETED не показується в Today | НЕ у списку Today's Schedule | ✅ |
| 9 | COMPLETED не можна відмітити | Помилка: "Cannot mark completed" | ✅ |
| 10 | Lifetime (без дат) | Завжди ACTIVE | ✅ |

---

## 🚨 ЩО ПОТРІБНО ПЕРЕВІРИТИ

### ⚠️ Критичне Питання:

**ЧИ АВТОМАТИЧНО ПЕРЕРАХОВУЮТЬСЯ СТАТУСИ ПРИ ЗМІНІ ДАТИ?**

1. **При завантаженні сторінки**: ✅ ТАК
   - `updateMedicationStatuses()` викликається кожен раз
   - Статуси перераховуються динамічно

2. **При переході на наступний день**: ⚠️ **ПОТРІБНО ПЕРЕВІРИТИ**
   - Якщо користувач залишить сторінку відкритою через північ
   - Чи оновляться статуси автоматично?

3. **Рішення**: Додати useEffect з таймером
   ```typescript
   // Оновлювати статуси кожну годину
   useEffect(() => {
     const timer = setInterval(() => {
       setMedications(updateMedicationStatuses(medications));
     }, 3600000); // 1 година

     return () => clearInterval(timer);
   }, [medications]);
   ```

---

## 📝 Висновки

### ✅ ЩО ПРАЦЮЄ:
1. Функція `calculateMedicationStatus()` працює правильно
2. Фільтрація `shouldShowInTodayList()` працює правильно
3. Статуси перераховуються при завантаженні сторінки
4. SCHEDULED не показується в Today
5. COMPLETED не можна відмітити

### ⚠️ ЩО ПОТРІБНО ДОДАТИ:
1. **Автоматичне оновлення статусів** кожну годину
2. **Toast notification** коли medication стає ACTIVE
3. **Toast notification** коли medication стає COMPLETED
4. **Тестові дані** для демонстрації переходів

---

## 🎬 Як Протестувати ПРЯМО ЗАРАЗ

### Спосіб 1: Змінити Системний Час
1. Створіть medication з startDate = завтра
2. Змініть системний час на завтра
3. Перезавантажте сторінку
4. Перевірте чи medication з'явився в Today

### Спосіб 2: Вручну Змінити startDate
1. Створіть medication з startDate = завтра
2. У Developer Console:
   ```javascript
   const meds = JSON.parse(localStorage.getItem('medications'));
   meds[0].startDate = "2025-11-12"; // Сьогодні
   localStorage.setItem('medications', JSON.stringify(meds));
   location.reload();
   ```
3. Medication має з'явитися в Today з зеленим бейджем

### Спосіб 3: Створити Medication "Заднім Числом"
1. Додайте medication через форму
2. Встановіть:
   - Start Date: 01 November 2025
   - End Date: 11 November 2025
3. Збережіть
4. Medication має відразу отримати статус COMPLETED
5. Має показатися в All Medications з сірим бейджем
6. НЕ має показатися в Today's Schedule

---

**ДАТА СТВОРЕННЯ:** 12 Листопада 2025  
**СТАТУС:** Потребує ручного тестування  
**КРИТИЧНІСТЬ:** 🔴 ВИСОКА (медичний застосунок)
