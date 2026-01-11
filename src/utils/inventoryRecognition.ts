/**
 * Розпізнавання інвентарю медикаментів по фото
 * Використовує Google Cloud Vision API для підрахунку таблеток/капсул
 */

import { recognizePhoto, VisionResult } from './visionAPI';

const VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;

/**
 * Типи упаковок медикаментів
 */
export type PackagingType =
  | 'blister' // Блістер (пластинка з таблетками)
  | 'bottle' // Пляшка/баночка
  | 'loose' // Розсипані таблетки
  | 'box' // Коробка
  | 'strip' // Стрічка
  | 'unknown'; // Невідомо

/**
 * Результат розпізнавання одного медикаменту на фото
 */
export interface RecognizedMedication {
  medicationName: string; // Назва ліків (якщо розпізнано)
  packageType: PackagingType; // Тип упаковки
  estimatedCount: number; // Приблизна кількість таблеток/капсул
  confidence: number; // Впевненість (0-1)
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  ocrText: string[]; // Розпізнаний текст на упаковці
  visualFeatures: {
    hasBlisterPack: boolean;
    hasBottle: boolean;
    visiblePills: number; // Кількість видимих таблеток
    colors: string[]; // Переважаючі кольори
  };
}

/**
 * Розрахунок залишку ліків
 */
export interface MedicationSupply {
  medicationName: string;
  currentStock: number; // Поточна кількість
  dailyDosage: number; // Щоденна доза
  daysRemaining: number; // Днів залишилось
  refillDate: Date; // Коли потрібно поповнити
  status: 'sufficient' | 'low' | 'critical' | 'out'; // Статус
  alerts: string[]; // Попередження
}

/**
 * Розпізнає об'єкти на фото (таблетки, пляшки, блістери)
 */
async function detectObjects(imageBase64: string): Promise<any[]> {
  if (!VISION_API_KEY) {
    throw new Error('Google Vision API key не налаштований');
  }

  const base64Content = imageBase64.includes('base64,')
    ? imageBase64.split('base64,')[1]
    : imageBase64;

  const requestBody = {
    requests: [
      {
        image: {
          content: base64Content,
        },
        features: [
          {
            type: 'OBJECT_LOCALIZATION', // Виявлення об'єктів
            maxResults: 50,
          },
          {
            type: 'LABEL_DETECTION', // Мітки (bottle, pill, medicine)
            maxResults: 50,
          },
          {
            type: 'TEXT_DETECTION', // Текст на упаковці
            maxResults: 50,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(VISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Vision API помилка: ${response.statusText}`);
    }

    const data = await response.json();
    return data.responses[0] || {};
  } catch (error: any) {
    console.error('❌ Object Detection Error:', error);
    throw new Error(`Не вдалося розпізнати об'єкти: ${error.message}`);
  }
}

/**
 * Визначає тип упаковки на основі міток Vision API
 */
function identifyPackageType(labels: any[], objects: any[]): PackagingType {
  const labelTexts = labels.map(l => l.description.toLowerCase());
  const objectNames = objects.map(o => o.name.toLowerCase());

  const allTexts = [...labelTexts, ...objectNames];

  // Перевіряємо ключові слова
  if (allTexts.some(t => t.includes('blister') || t.includes('pill pack'))) {
    return 'blister';
  }
  if (allTexts.some(t => t.includes('bottle') || t.includes('container') || t.includes('jar'))) {
    return 'bottle';
  }
  if (allTexts.some(t => t.includes('box') || t.includes('package'))) {
    return 'box';
  }
  if (allTexts.some(t => t.includes('pill') || t.includes('tablet') || t.includes('capsule'))) {
    return 'loose';
  }

  return 'unknown';
}

/**
 * Підраховує кількість таблеток на фото
 * Використовує евристики на основі типу упаковки та виявлених об'єктів
 */
function estimatePillCount(
  packageType: PackagingType,
  objects: any[],
  labels: any[]
): number {
  // Підраховуємо об'єкти схожі на таблетки
  const pillLikeObjects = objects.filter((obj: any) => {
    const name = obj.name.toLowerCase();
    return (
      name.includes('pill') ||
      name.includes('tablet') ||
      name.includes('capsule') ||
      name.includes('medicine')
    );
  });

  if (packageType === 'loose') {
    // Розсипані таблетки - підраховуємо видимі об'єкти
    return pillLikeObjects.length;
  }

  if (packageType === 'blister') {
    // Блістер - підраховуємо комірки
    // Зазвичай блістер містить 10-30 таблеток
    const blisterCount = pillLikeObjects.length;

    // Евристика: якщо виявлено 5+ об'єктів, це, ймовірно, повний блістер
    if (blisterCount >= 5) {
      return Math.max(blisterCount, 10); // Мінімум 10 на блістер
    }

    return blisterCount;
  }

  if (packageType === 'bottle') {
    // Пляшка - оцінка на основі розміру
    // Це складно, тому повертаємо консервативну оцінку
    const hasFullBottleLabel = labels.some((l: any) =>
      l.description.toLowerCase().includes('full') ||
      l.description.toLowerCase().includes('medicine bottle')
    );

    if (hasFullBottleLabel) {
      return 30; // Стандартна пляшка
    }

    return 15; // Півпорожня пляшка (консервативна оцінка)
  }

  // Для інших типів - консервативна оцінка
  return Math.max(pillLikeObjects.length, 1);
}

/**
 * Витягує назву ліків з розпізнаного тексту
 */
function extractMedicationName(
  ocrResults: VisionResult[],
  knownMedications: string[]
): string | null {
  if (!ocrResults || ocrResults.length === 0) {
    return null;
  }

  // Весь розпізнаний текст в нижньому регістрі
  const fullText = ocrResults
    .map(r => r.text)
    .join(' ')
    .toLowerCase();

  // Шукаємо точний збіг з відомими ліками
  for (const medName of knownMedications) {
    const medLower = medName.toLowerCase();

    // Точний збіг
    if (fullText.includes(medLower)) {
      return medName;
    }

    // Часткове співпадіння (наприклад, "Aspir" з "Aspirin")
    const medPrefix = medLower.substring(0, Math.min(5, medLower.length));
    if (fullText.includes(medPrefix) && medPrefix.length >= 4) {
      return medName;
    }
  }

  return null;
}

/**
 * Аналізує кольори на фото (для визначення типу таблеток)
 */
function analyzeColors(labels: any[]): string[] {
  const colorKeywords = [
    'white', 'red', 'blue', 'green', 'yellow', 'orange',
    'pink', 'purple', 'brown', 'black', 'grey'
  ];

  const detectedColors: string[] = [];

  labels.forEach((label: any) => {
    const desc = label.description.toLowerCase();
    colorKeywords.forEach((color) => {
      if (desc.includes(color) && !detectedColors.includes(color)) {
        detectedColors.push(color);
      }
    });
  });

  return detectedColors;
}

/**
 * Основна функція: Аналізує фото інвентарю медикаментів
 */
export async function analyzeMedicationInventory(
  imageBase64: string,
  knownMedications: Array<{ name: string; dosage?: string }>
): Promise<RecognizedMedication[]> {
  console.log('🔍 Аналізую фото інвентарю медикаментів...');
  console.log(`📋 Відомих ліків: ${knownMedications.length}`);

  try {
    // Крок 1: Розпізнаємо об'єкти, мітки та текст
    const visionResults = await detectObjects(imageBase64);

    const objects = visionResults.localizedObjectAnnotations || [];
    const labels = visionResults.labelAnnotations || [];
    const textAnnotations = visionResults.textAnnotations || [];

    console.log(`📦 Виявлено об'єктів: ${objects.length}`);
    console.log(`🏷️ Виявлено міток: ${labels.length}`);
    console.log(`📝 Розпізнано тексту: ${textAnnotations.length}`);

    // Крок 2: Розпізнаємо текст для отримання назв ліків
    const ocrText = await recognizePhoto(imageBase64);

    // Крок 3: Групуємо об'єкти по медикаментах
    const recognizedMeds: RecognizedMedication[] = [];

    // Шукаємо кожне відоме ліки на фото
    const knownMedNames = knownMedications.map(m => m.name);
    const foundMedName = extractMedicationName(ocrText, knownMedNames);

    if (foundMedName) {
      console.log(`💊 Знайдено ліки: ${foundMedName}`);
    }

    // Аналізуємо всі виявлені об'єкти
    const packageType = identifyPackageType(labels, objects);
    const pillCount = estimatePillCount(packageType, objects, labels);
    const colors = analyzeColors(labels);

    // Якщо знайшли хоча б щось схоже на ліки
    if (packageType !== 'unknown' || pillCount > 0) {
      recognizedMeds.push({
        medicationName: foundMedName || 'Невідомі ліки',
        packageType: packageType,
        estimatedCount: pillCount,
        confidence: foundMedName ? 0.85 : 0.6,
        boundingBox: objects.length > 0
          ? {
              x: objects[0].boundingPoly?.normalizedVertices?.[0]?.x * 1000 || 0,
              y: objects[0].boundingPoly?.normalizedVertices?.[0]?.y * 1000 || 0,
              width: 100,
              height: 100,
            }
          : { x: 0, y: 0, width: 0, height: 0 },
        ocrText: ocrText.slice(0, 10).map(t => t.text), // Перші 10 текстових елементів
        visualFeatures: {
          hasBlisterPack: packageType === 'blister',
          hasBottle: packageType === 'bottle',
          visiblePills: pillCount,
          colors: colors,
        },
      });
    }

    console.log(`✅ Розпізнано медикаментів: ${recognizedMeds.length}`);
    return recognizedMeds;

  } catch (error: any) {
    console.error('❌ Помилка аналізу інвентарю:', error);
    throw error;
  }
}

/**
 * Розраховує залишок ліків та дати поповнення
 */
export function calculateMedicationSupply(
  currentStock: number,
  dailyDosage: number,
  medicationName: string,
  minStockDays: number = 7 // Мінімум днів для попередження
): MedicationSupply {
  const daysRemaining = Math.floor(currentStock / dailyDosage);
  const refillDate = new Date();
  refillDate.setDate(refillDate.getDate() + daysRemaining);

  // Визначаємо статус
  let status: 'sufficient' | 'low' | 'critical' | 'out';
  const alerts: string[] = [];

  if (currentStock === 0) {
    status = 'out';
    alerts.push('⚠️ Ліки закінчились! Терміново поповніть запас.');
  } else if (daysRemaining <= 2) {
    status = 'critical';
    alerts.push(`🚨 КРИТИЧНО! Залишилось лише на ${daysRemaining} днів.`);
    alerts.push('Купіть ліки найближчим часом!');
  } else if (daysRemaining <= minStockDays) {
    status = 'low';
    alerts.push(`⚠️ Низький залишок: на ${daysRemaining} днів.`);
    alerts.push(`Рекомендуємо купити до ${refillDate.toLocaleDateString('uk-UA')}`);
  } else {
    status = 'sufficient';
    alerts.push(`✅ Достатньо ліків на ${daysRemaining} днів.`);
  }

  return {
    medicationName,
    currentStock,
    dailyDosage,
    daysRemaining,
    refillDate,
    status,
    alerts,
  };
}

/**
 * Перевіряє чи завершився курс лікування
 */
export function checkCourseCompletion(
  medication: {
    name: string;
    courseEndDate?: Date;
    prescribedDuration?: number; // Днів
    startDate?: Date;
  },
  currentStock: number
): {
  isCompleted: boolean;
  shouldStopBuying: boolean;
  message: string;
} {
  const now = new Date();

  // Перевірка по даті завершення курсу
  if (medication.courseEndDate) {
    const isCompleted = now >= medication.courseEndDate;

    if (isCompleted) {
      return {
        isCompleted: true,
        shouldStopBuying: true,
        message: `✅ Курс ${medication.name} завершено ${medication.courseEndDate.toLocaleDateString('uk-UA')}. Більше не купуйте!`,
      };
    }
  }

  // Перевірка по тривалості курсу
  if (medication.startDate && medication.prescribedDuration) {
    const endDate = new Date(medication.startDate);
    endDate.setDate(endDate.getDate() + medication.prescribedDuration);

    const isCompleted = now >= endDate;

    if (isCompleted) {
      return {
        isCompleted: true,
        shouldStopBuying: true,
        message: `✅ Курс ${medication.name} завершено (${medication.prescribedDuration} днів). Припиніть купівлю!`,
      };
    }
  }

  // Якщо залишок є, але курс не визначений
  if (currentStock > 0) {
    return {
      isCompleted: false,
      shouldStopBuying: false,
      message: `📦 ${medication.name}: Курс триває, залишок ${currentStock} од.`,
    };
  }

  return {
    isCompleted: false,
    shouldStopBuying: false,
    message: `ℹ️ Інформація про курс ${medication.name} недоступна.`,
  };
}

/**
 * Демо-функція для тестування без реального API
 */
export async function analyzeDemoInventory(
  knownMedications: Array<{ name: string; dosage?: string }>
): Promise<RecognizedMedication[]> {
  // Симулюємо затримку API
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Повертаємо фейкові результати
  const demoResults: RecognizedMedication[] = [];

  // Випадково "знаходимо" деякі ліки
  const numFound = Math.floor(Math.random() * knownMedications.length) + 1;

  for (let i = 0; i < numFound; i++) {
    const med = knownMedications[i];
    const packageTypes: PackagingType[] = ['blister', 'bottle', 'loose', 'box'];
    const randomType = packageTypes[Math.floor(Math.random() * packageTypes.length)];

    let count = 0;
    if (randomType === 'blister') {
      count = Math.floor(Math.random() * 20) + 10; // 10-30 таблеток
    } else if (randomType === 'bottle') {
      count = Math.floor(Math.random() * 40) + 20; // 20-60 таблеток
    } else {
      count = Math.floor(Math.random() * 15) + 5; // 5-20 таблеток
    }

    demoResults.push({
      medicationName: med.name,
      packageType: randomType,
      estimatedCount: count,
      confidence: 0.7 + Math.random() * 0.3,
      boundingBox: {
        x: Math.random() * 500,
        y: Math.random() * 500,
        width: 100 + Math.random() * 100,
        height: 100 + Math.random() * 100,
      },
      ocrText: [med.name, med.dosage || '100mg', 'EXP 12/2026'],
      visualFeatures: {
        hasBlisterPack: randomType === 'blister',
        hasBottle: randomType === 'bottle',
        visiblePills: count,
        colors: ['white', 'blue'],
      },
    });
  }

  return demoResults;
}

/**
 * Перевірка чи налаштований Vision API
 */
export function isInventoryAPIConfigured(): boolean {
  return !!VISION_API_KEY && VISION_API_KEY !== 'your_api_key_here';
}
