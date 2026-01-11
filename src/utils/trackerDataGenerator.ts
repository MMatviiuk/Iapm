/**
 * Генератор реалістичних даних фітнес-трекера
 * Для тестування та демонстрації кореляції пульс ↔ ліки
 */

export interface TrackerReading {
  id: string;
  userId: string;
  timestamp: Date;
  heartRate: number;
  steps: number;
  sleepHours: number | null;
  activity: 'resting' | 'light' | 'moderate' | 'active';
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
}

export interface MedicationEffect {
  medicationName: string;
  heartRateEffect: number; // Зміна пульсу (+ або -)
  onsetMinutes: number; // Через скільки хв починає діяти
  durationHours: number; // Скільки годин діє
  peakMinutes: number; // Коли максимальний ефект
}

/**
 * Типові ефекти ліків на пульс
 */
export const MEDICATION_EFFECTS: Record<string, MedicationEffect> = {
  // Ліки від тиску (знижують пульс)
  'Ramipril': {
    medicationName: 'Ramipril',
    heartRateEffect: -8,
    onsetMinutes: 60,
    durationHours: 24,
    peakMinutes: 180,
  },
  'Lisinopril': {
    medicationName: 'Lisinopril',
    heartRateEffect: -6,
    onsetMinutes: 60,
    durationHours: 24,
    peakMinutes: 240,
  },
  'Metoprolol': {
    medicationName: 'Metoprolol',
    heartRateEffect: -12,
    onsetMinutes: 30,
    durationHours: 12,
    peakMinutes: 120,
  },

  // Ліки від діабету (невеликий вплив)
  'Metformin': {
    medicationName: 'Metformin',
    heartRateEffect: -3,
    onsetMinutes: 30,
    durationHours: 6,
    peakMinutes: 120,
  },

  // Розріджувачі крові (майже не впливають)
  'Aspirin': {
    medicationName: 'Aspirin',
    heartRateEffect: -1,
    onsetMinutes: 30,
    durationHours: 24,
    peakMinutes: 60,
  },
  'Warfarin': {
    medicationName: 'Warfarin',
    heartRateEffect: 0,
    onsetMinutes: 120,
    durationHours: 48,
    peakMinutes: 360,
  },

  // Статини (холестерин) - майже не впливають на пульс
  'Atorvastatin': {
    medicationName: 'Atorvastatin',
    heartRateEffect: -2,
    onsetMinutes: 120,
    durationHours: 24,
    peakMinutes: 360,
  },
};

/**
 * Генерує базовий (нормальний) пульс в залежності від часу доби та активності
 */
function generateBaseHeartRate(hour: number, activity: string): number {
  let baseRate = 72; // Середній пульс в спокої

  // Циркадний ритм (пульс змінюється протягом дня)
  if (hour >= 0 && hour < 6) {
    baseRate = 60; // Вночі нижчий
  } else if (hour >= 6 && hour < 9) {
    baseRate = 68; // Ранок
  } else if (hour >= 9 && hour < 12) {
    baseRate = 75; // Ранок-день (активність)
  } else if (hour >= 12 && hour < 14) {
    baseRate = 78; // Після обіду
  } else if (hour >= 14 && hour < 18) {
    baseRate = 74; // Післяобідній час
  } else if (hour >= 18 && hour < 22) {
    baseRate = 70; // Вечір
  } else {
    baseRate = 65; // Перед сном
  }

  // Коригування на активність
  switch (activity) {
    case 'resting':
      baseRate -= 5;
      break;
    case 'light':
      baseRate += 5;
      break;
    case 'moderate':
      baseRate += 15;
      break;
    case 'active':
      baseRate += 30;
      break;
  }

  // Додаємо випадковість (±3 удари)
  baseRate += Math.random() * 6 - 3;

  return Math.round(baseRate);
}

/**
 * Обчислює ефект ліків на пульс в конкретний момент часу
 */
function calculateMedicationEffect(
  medicationEffect: MedicationEffect,
  minutesSinceTaken: number
): number {
  const { heartRateEffect, onsetMinutes, durationHours, peakMinutes } = medicationEffect;

  const durationMinutes = durationHours * 60;

  // Якщо ще не почало діяти
  if (minutesSinceTaken < onsetMinutes) {
    return 0;
  }

  // Якщо дія закінчилась
  if (minutesSinceTaken > durationMinutes) {
    return 0;
  }

  // Обчислюємо інтенсивність ефекту (0 до 1)
  let intensity = 0;

  if (minutesSinceTaken < peakMinutes) {
    // Наростання ефекту (onset → peak)
    intensity = (minutesSinceTaken - onsetMinutes) / (peakMinutes - onsetMinutes);
  } else {
    // Спадання ефекту (peak → duration)
    intensity = 1 - ((minutesSinceTaken - peakMinutes) / (durationMinutes - peakMinutes));
  }

  // Застосовуємо intensity до максимального ефекту
  return heartRateEffect * intensity;
}

/**
 * Генерує дані трекера для одного дня
 */
export function generateDayTrackerData(
  userId: string,
  date: Date,
  medications: Array<{ name: string; timeTaken: Date }> = []
): TrackerReading[] {
  const readings: TrackerReading[] = [];

  // Генеруємо дані кожну годину
  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new Date(date);
    timestamp.setHours(hour, 0, 0, 0);

    // Визначаємо активність в залежності від часу
    let activity: 'resting' | 'light' | 'moderate' | 'active' = 'resting';
    if (hour >= 0 && hour < 6) activity = 'resting'; // Сон
    else if (hour >= 6 && hour < 9) activity = 'light'; // Ранок
    else if (hour >= 9 && hour < 12) activity = 'moderate'; // Активна частина дня
    else if (hour >= 12 && hour < 14) activity = 'light'; // Обід
    else if (hour >= 14 && hour < 18) activity = 'moderate'; // Післяобідня активність
    else if (hour >= 18 && hour < 22) activity = 'light'; // Вечір
    else activity = 'resting'; // Підготовка до сну

    // Базовий пульс
    let heartRate = generateBaseHeartRate(hour, activity);

    // Додаємо ефект ліків
    let totalMedicationEffect = 0;
    medications.forEach(med => {
      const effect = MEDICATION_EFFECTS[med.name];
      if (effect) {
        const minutesSinceTaken = (timestamp.getTime() - med.timeTaken.getTime()) / 1000 / 60;
        const medEffect = calculateMedicationEffect(effect, minutesSinceTaken);
        totalMedicationEffect += medEffect;
      }
    });

    heartRate += totalMedicationEffect;

    // Обмежуємо реалістичними значеннями
    heartRate = Math.max(55, Math.min(110, heartRate));

    // Генеруємо кроки (реалістично)
    let steps = 0;
    if (activity === 'light') steps = Math.floor(Math.random() * 1000 + 500);
    else if (activity === 'moderate') steps = Math.floor(Math.random() * 2000 + 1000);
    else if (activity === 'active') steps = Math.floor(Math.random() * 3000 + 2000);

    // Сон (тільки вночі)
    let sleepHours = null;
    if (hour === 7) {
      // Записуємо скільки годин спав (вночі)
      sleepHours = 6 + Math.random() * 2; // 6-8 годин
    }

    readings.push({
      id: `tracker_${userId}_${timestamp.getTime()}`,
      userId,
      timestamp,
      heartRate: Math.round(heartRate),
      steps,
      sleepHours,
      activity,
    });
  }

  return readings;
}

/**
 * Генерує дані трекера за період (кілька днів/тижнів)
 */
export function generateTrackerDataset(
  userId: string,
  startDate: Date,
  days: number,
  medicationSchedule: Array<{ name: string; time: string; days: string[] }> = []
): TrackerReading[] {
  const allReadings: TrackerReading[] = [];

  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()];

    // Визначаємо які ліки приймались цього дня
    const todaysMedications: Array<{ name: string; timeTaken: Date }> = [];

    medicationSchedule.forEach(med => {
      if (med.days.includes(dayName)) {
        const [hours, minutes] = med.time.split(':');
        const timeTaken = new Date(currentDate);
        timeTaken.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        todaysMedications.push({
          name: med.name,
          timeTaken,
        });
      }
    });

    // Генеруємо дані для цього дня
    const dayReadings = generateDayTrackerData(userId, currentDate, todaysMedications);
    allReadings.push(...dayReadings);
  }

  return allReadings;
}

/**
 * Експортує дані в CSV формат (для Jupyter Notebook / ML)
 */
export function exportToCSV(readings: TrackerReading[]): string {
  const headers = ['timestamp', 'user_id', 'heart_rate', 'steps', 'sleep_hours', 'activity'];
  const rows = readings.map(r => [
    r.timestamp.toISOString(),
    r.userId,
    r.heartRate,
    r.steps,
    r.sleepHours || '',
    r.activity,
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

/**
 * Експортує в JSON для аналізу
 */
export function exportToJSON(readings: TrackerReading[]): string {
  return JSON.stringify(readings, null, 2);
}

/**
 * Приклад використання:
 */
export function generateDemoData() {
  const userId = 'user_001';
  const startDate = new Date('2026-01-01');
  const days = 30; // Місяць даних

  const medicationSchedule = [
    {
      name: 'Ramipril',
      time: '08:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    {
      name: 'Metformin',
      time: '08:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    {
      name: 'Metformin',
      time: '20:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    {
      name: 'Aspirin',
      time: '08:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
  ];

  const readings = generateTrackerDataset(userId, startDate, days, medicationSchedule);

  console.log(`Згенеровано ${readings.length} записів трекера`);
  console.log(`Приклад даних:`, readings.slice(0, 5));

  // Експорт в CSV
  const csv = exportToCSV(readings);
  console.log('CSV готовий для завантаження');

  return readings;
}
