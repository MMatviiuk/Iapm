/**
 * Розпізнавання інвентарю медикаментів по ВІДЕО
 * Використовує Google Cloud Video Intelligence API
 */

const VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const VIDEO_API_URL = `https://videointelligence.googleapis.com/v1/videos:annotate?key=${VISION_API_KEY}`;

export interface VideoMedicationResult {
  medicationName: string;
  frames: Array<{
    timeOffset: string; // "0:05s"
    count: number;
    confidence: number;
  }>;
  averageCount: number; // Медіана з усіх кадрів
  medianCount: number; // Найбільш стабільне значення
  confidence: number;
  packageType: 'blister' | 'bottle' | 'loose' | 'box' | 'unknown';
}

export interface VideoAnalysisProgress {
  status: 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error';
  progress: number; // 0-100%
  message: string;
  estimatedTimeRemaining?: number; // секунди
}

/**
 * Аналізує відео з медикаментами
 * ВАЖЛИВО: Відео може бути до 60 секунд для безкоштовного tier
 */
export async function analyzeVideoInventory(
  videoFile: File,
  knownMedications: Array<{ name: string; dosage?: string }>,
  onProgress?: (progress: VideoAnalysisProgress) => void
): Promise<VideoMedicationResult[]> {
  console.log('🎥 Початок аналізу відео інвентарю...');
  console.log(`📹 Розмір відео: ${(videoFile.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`⏱️ Тривалість: ~${await estimateVideoDuration(videoFile)} секунд`);

  // Перевірка розміру відео (макс 50MB для безкоштовного tier)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (videoFile.size > maxSize) {
    throw new Error(`Відео занадто велике. Максимум 50MB, ваше: ${(videoFile.size / 1024 / 1024).toFixed(2)} MB`);
  }

  try {
    // Крок 1: Конвертуємо відео в base64
    onProgress?.({
      status: 'uploading',
      progress: 10,
      message: 'Завантаження відео...',
    });

    const base64Video = await convertVideoToBase64(videoFile);

    // Крок 2: Відправляємо в Google Video Intelligence API
    onProgress?.({
      status: 'processing',
      progress: 30,
      message: 'Обробка відео (це може зайняти 1-2 хвилини)...',
      estimatedTimeRemaining: 120,
    });

    const response = await fetch(VIDEO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputContent: base64Video,
        features: [
          'LABEL_DETECTION', // Виявлення об'єктів (pill, medicine, bottle)
          'OBJECT_TRACKING', // Відстеження об'єктів по кадрах
          'TEXT_DETECTION', // Розпізнавання тексту (назва ліків)
        ],
        videoContext: {
          labelDetectionConfig: {
            labelDetectionMode: 'SHOT_AND_FRAME_MODE',
          },
          objectTrackingConfig: {
            model: 'builtin/latest',
          },
          textDetectionConfig: {
            languageHints: ['uk', 'en', 'ru'], // Українська, англійська, російська
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Video API error:', errorData);
      throw new Error(`Video API помилка: ${response.statusText}`);
    }

    const data = await response.json();

    // Video API працює асинхронно - отримуємо operation name
    const operationName = data.name;

    // Крок 3: Чекаємо завершення обробки
    onProgress?.({
      status: 'processing',
      progress: 50,
      message: 'Аналіз відео покадрово...',
      estimatedTimeRemaining: 60,
    });

    const results = await pollOperationStatus(operationName, onProgress);

    // Крок 4: Обробляємо результати
    onProgress?.({
      status: 'analyzing',
      progress: 80,
      message: 'Розпізнавання медикаментів...',
    });

    const medications = await parseVideoResults(results, knownMedications);

    onProgress?.({
      status: 'completed',
      progress: 100,
      message: `Готово! Розпізнано ${medications.length} медикаментів`,
    });

    console.log(`✅ Відео аналіз завершено: ${medications.length} медикаментів`);
    return medications;

  } catch (error: any) {
    console.error('❌ Помилка відео аналізу:', error);
    onProgress?.({
      status: 'error',
      progress: 0,
      message: `Помилка: ${error.message}`,
    });
    throw error;
  }
}

/**
 * Конвертує відео в base64
 */
async function convertVideoToBase64(videoFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Видаляємо префікс "data:video/...;base64,"
      const base64Content = base64String.includes('base64,')
        ? base64String.split('base64,')[1]
        : base64String;
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(videoFile);
  });
}

/**
 * Оцінює тривалість відео (приблизно)
 */
async function estimateVideoDuration(videoFile: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(Math.round(video.duration));
    };

    video.onerror = () => {
      // Якщо не вдалося отримати metadata, оцінюємо по розміру
      const estimatedDuration = Math.min((videoFile.size / (1024 * 1024)) * 2, 60);
      resolve(Math.round(estimatedDuration));
    };

    video.src = URL.createObjectURL(videoFile);
  });
}

/**
 * Чекає завершення обробки відео (polling)
 */
async function pollOperationStatus(
  operationName: string,
  onProgress?: (progress: VideoAnalysisProgress) => void
): Promise<any> {
  const maxAttempts = 60; // Максимум 5 хвилин (60 × 5 сек)
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(
      `https://videointelligence.googleapis.com/v1/operations/${operationName.split('/').pop()}?key=${VISION_API_KEY}`
    );

    const data = await response.json();

    if (data.done) {
      if (data.error) {
        throw new Error(`Video processing error: ${data.error.message}`);
      }
      return data.response;
    }

    // Оновлюємо прогрес
    const progress = Math.min(50 + (attempts / maxAttempts) * 30, 80);
    const timeRemaining = (maxAttempts - attempts) * 5;

    onProgress?.({
      status: 'processing',
      progress: progress,
      message: `Обробка відео... (${attempts + 1}/${maxAttempts})`,
      estimatedTimeRemaining: timeRemaining,
    });

    // Чекаємо 5 секунд перед наступною спробою
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error('Video processing timeout - спробуйте коротше відео');
}

/**
 * Парсить результати відео аналізу
 */
async function parseVideoResults(
  results: any,
  knownMedications: Array<{ name: string; dosage?: string }>
): Promise<VideoMedicationResult[]> {
  const medications: VideoMedicationResult[] = [];

  // Отримуємо відслідковані об'єкти (pills, tablets)
  const objectAnnotations = results.objectAnnotations || [];

  // Отримуємо розпізнаний текст
  const textAnnotations = results.textAnnotations || [];

  // Групуємо об'єкти по типах
  const pillObjects = objectAnnotations.filter((obj: any) => {
    const name = obj.entity?.description?.toLowerCase() || '';
    return (
      name.includes('pill') ||
      name.includes('tablet') ||
      name.includes('capsule') ||
      name.includes('medicine')
    );
  });

  console.log(`📊 Знайдено об'єктів (таблетки): ${pillObjects.length}`);
  console.log(`📝 Розпізнано тексту: ${textAnnotations.length}`);

  // Знаходимо назви ліків в тексті
  const foundMedications = new Map<string, string>();

  textAnnotations.forEach((textAnnotation: any) => {
    const segments = textAnnotation.segments || [];
    segments.forEach((segment: any) => {
      const text = segment.text || '';

      // Шукаємо збіги з відомими ліками
      knownMedications.forEach((med) => {
        if (text.toLowerCase().includes(med.name.toLowerCase())) {
          foundMedications.set(med.name, text);
        }
      });
    });
  });

  // Якщо знайшли ліки - підраховуємо таблетки по кадрах
  if (foundMedications.size > 0 && pillObjects.length > 0) {
    foundMedications.forEach((fullText, medName) => {
      const framesData: Array<{ timeOffset: string; count: number; confidence: number }> = [];

      // Аналізуємо кожен відслідкований об'єкт
      pillObjects.forEach((obj: any) => {
        const frames = obj.frames || [];

        frames.forEach((frame: any) => {
          const timeOffset = formatTimeOffset(frame.timeOffset);
          const confidence = obj.confidence || 0.7;

          // Підраховуємо кількість на цьому кадрі
          // (кожен frame може містити кілька об'єктів)
          const existingFrame = framesData.find(f => f.timeOffset === timeOffset);

          if (existingFrame) {
            existingFrame.count++;
          } else {
            framesData.push({
              timeOffset,
              count: 1,
              confidence,
            });
          }
        });
      });

      // Розраховуємо медіану та середнє
      const counts = framesData.map(f => f.count);
      const averageCount = Math.round(
        counts.reduce((sum, c) => sum + c, 0) / counts.length
      );
      const medianCount = calculateMedian(counts);

      medications.push({
        medicationName: medName,
        frames: framesData.slice(0, 10), // Показуємо перші 10 кадрів
        averageCount,
        medianCount,
        confidence: 0.85,
        packageType: detectPackageType(foundMedications.get(medName) || ''),
      });
    });
  }

  // Якщо не знайшли конкретні ліки, але знайшли таблетки
  if (medications.length === 0 && pillObjects.length > 0) {
    const frames: Array<{ timeOffset: string; count: number; confidence: number }> = [];

    pillObjects.forEach((obj: any) => {
      (obj.frames || []).forEach((frame: any) => {
        frames.push({
          timeOffset: formatTimeOffset(frame.timeOffset),
          count: 1,
          confidence: obj.confidence || 0.7,
        });
      });
    });

    const counts = frames.map(f => f.count);
    const totalCount = counts.reduce((sum, c) => sum + c, 0);

    medications.push({
      medicationName: 'Невідомі ліки',
      frames: frames.slice(0, 10),
      averageCount: Math.round(totalCount / frames.length),
      medianCount: calculateMedian(counts),
      confidence: 0.6,
      packageType: 'unknown',
    });
  }

  return medications;
}

/**
 * Форматує timeOffset з секунд в "MM:SS"
 */
function formatTimeOffset(timeOffset: string): string {
  const seconds = parseFloat(timeOffset.replace('s', ''));
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Розраховує медіану масиву чисел
 */
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return sorted[middle];
}

/**
 * Визначає тип упаковки з тексту
 */
function detectPackageType(text: string): 'blister' | 'bottle' | 'loose' | 'box' | 'unknown' {
  const lower = text.toLowerCase();

  if (lower.includes('blister') || lower.includes('блістер')) return 'blister';
  if (lower.includes('bottle') || lower.includes('пляшка') || lower.includes('флакон')) return 'bottle';
  if (lower.includes('box') || lower.includes('коробка')) return 'box';

  return 'unknown';
}

/**
 * Демо-функція для тестування без реального API
 */
export async function analyzeVideoDemo(
  videoFile: File,
  knownMedications: Array<{ name: string; dosage?: string }>,
  onProgress?: (progress: VideoAnalysisProgress) => void
): Promise<VideoMedicationResult[]> {
  // Симулюємо тривалу обробку
  const steps = [
    { status: 'uploading' as const, progress: 20, message: 'Завантаження відео...', delay: 1000 },
    { status: 'processing' as const, progress: 40, message: 'Обробка відео...', delay: 2000 },
    { status: 'analyzing' as const, progress: 70, message: 'Аналіз кадрів...', delay: 2000 },
    { status: 'completed' as const, progress: 100, message: 'Готово!', delay: 500 },
  ];

  for (const step of steps) {
    onProgress?.(step);
    await new Promise(resolve => setTimeout(resolve, step.delay));
  }

  // Повертаємо фейкові результати
  const demoResults: VideoMedicationResult[] = [];

  knownMedications.slice(0, 2).forEach((med) => {
    const baseCount = Math.floor(Math.random() * 20) + 10;

    demoResults.push({
      medicationName: med.name,
      frames: [
        { timeOffset: '0:05', count: baseCount, confidence: 0.9 },
        { timeOffset: '0:10', count: baseCount + 1, confidence: 0.88 },
        { timeOffset: '0:15', count: baseCount, confidence: 0.91 },
        { timeOffset: '0:20', count: baseCount - 1, confidence: 0.87 },
        { timeOffset: '0:25', count: baseCount, confidence: 0.92 },
      ],
      averageCount: baseCount,
      medianCount: baseCount,
      confidence: 0.89,
      packageType: Math.random() > 0.5 ? 'blister' : 'bottle',
    });
  });

  return demoResults;
}

/**
 * Перевірка чи налаштований API
 */
export function isVideoAPIConfigured(): boolean {
  return !!VISION_API_KEY && VISION_API_KEY !== 'your_api_key_here';
}
