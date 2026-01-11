/**
 * Google Cloud Vision API Integration
 * Розпізнавання фото паперового розкладу з галочками
 */

const VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;

export interface VisionResult {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface MedicationFromPhoto {
  medicationName: string;
  day: string; // Monday, Tuesday, etc.
  time: string; // 08:00
  taken: boolean; // чи є галочка
  confidence: number; // впевненість алгоритму (0-1)
}

/**
 * Розпізнає текст і символи на фото за допомогою Google Vision API
 */
export async function recognizePhoto(imageBase64: string): Promise<VisionResult[]> {
  if (!VISION_API_KEY) {
    throw new Error('Google Vision API key не налаштований. Додайте VITE_GOOGLE_VISION_API_KEY в .env файл');
  }

  // Видаляємо префікс "data:image/...;base64," якщо є
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
            type: 'TEXT_DETECTION', // Розпізнавання тексту
            maxResults: 100,
          },
          {
            type: 'DOCUMENT_TEXT_DETECTION', // Детальне розпізнавання документів
          },
        ],
      },
    ],
  };

  try {
    console.log('📸 Відправляємо фото в Google Vision API...');

    const response = await fetch(VISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Vision API error:', errorData);
      throw new Error(`Vision API помилка: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.responses[0]?.error) {
      throw new Error(`Vision API error: ${data.responses[0].error.message}`);
    }

    // Обробляємо результати
    const textAnnotations = data.responses[0]?.textAnnotations || [];

    console.log(`✅ Розпізнано ${textAnnotations.length} текстових елементів`);

    return textAnnotations.map((annotation: any) => {
      const vertices = annotation.boundingPoly?.vertices || [];
      const topLeft = vertices[0] || { x: 0, y: 0 };
      const bottomRight = vertices[2] || { x: 0, y: 0 };

      return {
        text: annotation.description || '',
        confidence: annotation.confidence || 0.9, // Vision API часто не повертає confidence
        boundingBox: {
          x: topLeft.x,
          y: topLeft.y,
          width: bottomRight.x - topLeft.x,
          height: bottomRight.y - topLeft.y,
        },
      };
    });
  } catch (error: any) {
    console.error('❌ Vision API Error:', error);
    throw new Error(`Не вдалося розпізнати фото: ${error.message}`);
  }
}

/**
 * Шукає галочки і позначки в розпізнаному тексті
 */
export function findCheckmarks(results: VisionResult[]): VisionResult[] {
  // Різні варіанти галочок які люди можуть писати
  const checkmarkSymbols = [
    '✓', '✔', '√', // Unicode галочки
    'v', 'V', // Літера V
    'x', 'X', // Хрестик
    '+', // Плюс
    '•', // Точка
    '/', // Слеш
    'ok', 'OK', // Текст "ок"
  ];

  return results.filter((result) => {
    const text = result.text.trim();

    // Перевіряємо чи текст є галочкою
    if (checkmarkSymbols.includes(text)) {
      return true;
    }

    // Перевіряємо чи дуже короткий текст (1-2 символи) схожий на галочку
    if (text.length <= 2) {
      return checkmarkSymbols.some(symbol => text.includes(symbol));
    }

    return false;
  });
}

/**
 * Визначає дні тижня з розпізнаного тексту
 */
function identifyDaysOfWeek(results: VisionResult[]): Map<string, { x: number; width: number }> {
  const daysMap = new Map<string, { x: number; width: number }>();
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
    'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя',
  ];

  results.forEach((result) => {
    const text = result.text.trim();
    const matchedDay = daysOfWeek.find(
      (day) => text.toLowerCase() === day.toLowerCase()
    );

    if (matchedDay) {
      // Нормалізуємо назву дня до англійської повної
      let normalizedDay = matchedDay;
      if (matchedDay.includes('Mon') || matchedDay.includes('Понеділок')) normalizedDay = 'Monday';
      if (matchedDay.includes('Tue') || matchedDay.includes('Вівторок')) normalizedDay = 'Tuesday';
      if (matchedDay.includes('Wed') || matchedDay.includes('Середа')) normalizedDay = 'Wednesday';
      if (matchedDay.includes('Thu') || matchedDay.includes('Четвер')) normalizedDay = 'Thursday';
      if (matchedDay.includes('Fri') || matchedDay.includes("П'ятниця")) normalizedDay = 'Friday';
      if (matchedDay.includes('Sat') || matchedDay.includes('Субота')) normalizedDay = 'Saturday';
      if (matchedDay.includes('Sun') || matchedDay.includes('Неділя')) normalizedDay = 'Sunday';

      daysMap.set(normalizedDay, {
        x: result.boundingBox.x,
        width: result.boundingBox.width,
      });
    }
  });

  return daysMap;
}

/**
 * Знаходить назви ліків в розпізнаному тексті
 */
function findMedicationsInText(
  results: VisionResult[],
  knownMedications: any[]
): Map<string, VisionResult> {
  const foundMeds = new Map<string, VisionResult>();

  knownMedications.forEach((med) => {
    const medName = med.name.toLowerCase();

    // Шукаємо точний збіг або часткове співпадіння
    const found = results.find((result) => {
      const text = result.text.toLowerCase();
      // Точний збіг
      if (text === medName) return true;
      // Ліки містяться в тексті (наприклад "Aspirin 100mg")
      if (text.includes(medName) && text.length < medName.length + 10) return true;
      return false;
    });

    if (found) {
      foundMeds.set(med.name, found);
    }
  });

  return foundMeds;
}

/**
 * Основна функція: Аналізує фото розкладу і повертає відмічені ліки
 */
export async function analyzeSchedulePhoto(
  imageBase64: string,
  currentMedications: any[]
): Promise<MedicationFromPhoto[]> {
  console.log('🔍 Починаємо аналіз фото розкладу...');
  console.log(`📋 Відомо ліків: ${currentMedications.length}`);

  // Крок 1: Розпізнаємо весь текст
  const allResults = await recognizePhoto(imageBase64);
  console.log(`📝 Розпізнано елементів: ${allResults.length}`);

  // Крок 2: Знаходимо галочки
  const checkmarks = findCheckmarks(allResults);
  console.log(`✓ Знайдено галочок: ${checkmarks.length}`);

  // Крок 3: Знаходимо дні тижня (для точнішого визначення)
  const daysMap = identifyDaysOfWeek(allResults);
  console.log(`📅 Знайдено днів тижня: ${daysMap.size}`);

  // Крок 4: Знаходимо назви ліків
  const medicationsMap = findMedicationsInText(allResults, currentMedications);
  console.log(`💊 Знайдено ліків на фото: ${medicationsMap.size}`);

  // Крок 5: Співставляємо галочки з ліками
  const takenMedications: MedicationFromPhoto[] = [];

  medicationsMap.forEach((medResult, medName) => {
    const medY = medResult.boundingBox.y; // Рядок де знаходиться ліки
    const medHeight = medResult.boundingBox.height;

    // Знаходимо всі галочки в тому ж рядку (±50px по Y)
    const relevantCheckmarks = checkmarks.filter((checkmark) => {
      const checkY = checkmark.boundingBox.y;
      return Math.abs(checkY - medY) < (medHeight + 50);
    });

    console.log(`  ${medName}: знайдено ${relevantCheckmarks.length} галочок`);

    // Для кожної галочки визначаємо день тижня
    relevantCheckmarks.forEach((checkmark) => {
      const checkX = checkmark.boundingBox.x;

      // Знаходимо найближчий день тижня по X координаті
      let closestDay = 'Unknown';
      let minDistance = Infinity;

      daysMap.forEach((dayPos, dayName) => {
        const distance = Math.abs(checkX - dayPos.x);
        if (distance < minDistance) {
          minDistance = distance;
          closestDay = dayName;
        }
      });

      // Знаходимо час прийому для цього ліку
      const medication = currentMedications.find(
        (m) => m.name.toLowerCase() === medName.toLowerCase()
      );
      const time = medication?.times?.[0] || '08:00';

      takenMedications.push({
        medicationName: medName,
        day: closestDay,
        time: time,
        taken: true,
        confidence: 0.85, // Середня впевненість (можна покращити)
      });
    });
  });

  console.log(`✅ Фінальний результат: ${takenMedications.length} відміток`);

  return takenMedications;
}

/**
 * Допоміжна функція: перевірка чи налаштований API key
 */
export function isVisionAPIConfigured(): boolean {
  return !!VISION_API_KEY && VISION_API_KEY !== 'your_api_key_here';
}

/**
 * Тестова функція для демо (без справжнього API)
 */
export async function analyzeDemoSchedule(
  currentMedications: any[]
): Promise<MedicationFromPhoto[]> {
  // Симулюємо затримку API
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Повертаємо фейкові результати для демо
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const results: MedicationFromPhoto[] = [];

  currentMedications.forEach((med) => {
    // Випадково "знаходимо" галочки (для демо)
    const numCheckmarks = Math.floor(Math.random() * 5) + 2; // 2-6 галочок
    for (let i = 0; i < numCheckmarks; i++) {
      results.push({
        medicationName: med.name,
        day: daysOfWeek[Math.floor(Math.random() * 7)],
        time: med.times?.[0] || '08:00',
        taken: true,
        confidence: 0.7 + Math.random() * 0.3, // 70-100%
      });
    }
  });

  return results;
}
