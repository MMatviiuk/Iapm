# 📸 Налаштування Google Cloud Vision API

**Мета:** Розпізнавання фото паперового розкладу з галочками ✓

---

## 🎯 Як Це Працює

```
1. Батько роздруковує недільний розклад ліків
2. Протягом тижня ставить галочки ✓ ручкою
3. В кінці тижня фотографує розклад
4. Google Vision розпізнає текст і символи
5. Алгоритм знаходить галочки в клітинках
6. Автоматично відмічає ліки як "прийняті"
7. Ви як опікун бачите оновлену історію!
```

---

## 💰 Вартість

**Безкоштовно:**
- Перші 1,000 фото/місяць - **$0**
- Для 1 користувача (щоденно) = 30 фото/місяць ✅
- Для 10 користувачів (раз на тиждень) = 40 фото/місяць ✅
- Для 30 користувачів (раз на тиждень) = 120 фото/місяць ✅

**Платно (якщо перевищите ліміт):**
- 1,001-5,000,000 фото = $1.50 за 1,000 фото
- Приклад: 2,000 фото/місяць = $1.50 (дуже дешево!)

---

## 🚀 Крок 1: Створити Google Cloud Проект

### 1.1. Відкрийте Google Cloud Console
```
https://console.cloud.google.com
```

### 1.2. Створіть новий проект
1. Натисніть "Select a project" → "New Project"
2. Назва проекту: **"MedicationApp"**
3. Натисніть "Create"

### 1.3. Активуйте Cloud Vision API
1. У пошуку введіть: "Vision API"
2. Натисніть "Cloud Vision API"
3. Натисніть "ENABLE" (Активувати)
4. Зачекайте 1-2 хвилини

---

## 🔑 Крок 2: Отримати API Key

### 2.1. Створіть API Key
1. Перейдіть: APIs & Services → Credentials
2. Натисніть "+ CREATE CREDENTIALS" → "API key"
3. **Скопіюйте API Key** (виглядає як: `AIzaSy...`)
4. Натисніть "RESTRICT KEY" (обов'язково!)

### 2.2. Обмежте API Key (безпека!)
1. Назва: "MedicationApp Vision API Key"
2. Application restrictions:
   - Оберіть: **"HTTP referrers (web sites)"**
   - Додайте:
     ```
     http://localhost:3000/*
     https://ваш-домен.vercel.app/*
     ```
3. API restrictions:
   - Оберіть: **"Restrict key"**
   - Виберіть тільки: ✅ **"Cloud Vision API"**
4. Натисніть "SAVE"

### 2.3. Збережіть API Key
```bash
# У корені проекту створіть файл .env
VITE_GOOGLE_VISION_API_KEY=AIzaSy...ваш_ключ
```

**⚠️ ВАЖЛИВО:** Ніколи не комітьте `.env` в Git!

---

## 📦 Крок 3: Встановити Залежності

```bash
# У терміналі:
npm install axios
```

Не треба встановлювати окремий SDK - використаємо REST API!

---

## 💻 Крок 4: Код Інтеграції

### 4.1. Створити Utility для Vision API

Файл: `/src/utils/visionAPI.ts`

```typescript
// Викликає Google Cloud Vision API для розпізнавання тексту
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

/**
 * Розпізнає текст і символи на фото
 */
export async function recognizePhoto(imageBase64: string): Promise<VisionResult[]> {
  const requestBody = {
    requests: [
      {
        image: {
          content: imageBase64.split(',')[1], // Видаляємо "data:image/png;base64,"
        },
        features: [
          {
            type: 'TEXT_DETECTION', // Розпізнавання тексту
            maxResults: 50,
          },
          {
            type: 'DOCUMENT_TEXT_DETECTION', // Детальне розпізнавання
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
      throw new Error(`Vision API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Обробляємо результати
    const textAnnotations = data.responses[0]?.textAnnotations || [];

    return textAnnotations.map((annotation: any) => ({
      text: annotation.description,
      confidence: annotation.confidence || 0,
      boundingBox: {
        x: annotation.boundingPoly?.vertices[0]?.x || 0,
        y: annotation.boundingPoly?.vertices[0]?.y || 0,
        width:
          (annotation.boundingPoly?.vertices[2]?.x || 0) -
          (annotation.boundingPoly?.vertices[0]?.x || 0),
        height:
          (annotation.boundingPoly?.vertices[2]?.y || 0) -
          (annotation.boundingPoly?.vertices[0]?.y || 0),
      },
    }));
  } catch (error) {
    console.error('Vision API Error:', error);
    throw error;
  }
}

/**
 * Шукає галочки в розпізнаному тексті
 */
export function findCheckmarks(results: VisionResult[]): string[] {
  const checkmarkSymbols = ['✓', '✔', '√', 'v', 'V', 'x', 'X', '+'];
  const foundCheckmarks: string[] = [];

  results.forEach((result) => {
    const text = result.text.trim();
    if (checkmarkSymbols.includes(text)) {
      foundCheckmarks.push(text);
    }
  });

  return foundCheckmarks;
}

/**
 * Розпізнає структуру таблиці і галочки
 */
export interface MedicationFromPhoto {
  medicationName: string;
  day: string; // Monday, Tuesday, etc.
  time: string; // 08:00
  taken: boolean; // чи є галочка
}

export async function analyzeSchedulePhoto(
  imageBase64: string,
  currentMedications: any[]
): Promise<MedicationFromPhoto[]> {
  const results = await recognizePhoto(imageBase64);

  // Простий алгоритм:
  // 1. Знаходимо всі галочки
  // 2. Знаходимо назви ліків
  // 3. Співставляємо позиції

  const checkmarks = findCheckmarks(results);
  const medications: MedicationFromPhoto[] = [];

  // Для кожного ліку шукаємо галочки поруч
  currentMedications.forEach((med) => {
    // Шукаємо назву ліку в розпізнаному тексті
    const medNameResult = results.find((r) =>
      r.text.toLowerCase().includes(med.name.toLowerCase())
    );

    if (medNameResult) {
      // Шукаємо галочки в тій же області (по Y координаті)
      const medY = medNameResult.boundingBox.y;

      results.forEach((result) => {
        if (
          checkmarks.includes(result.text.trim()) &&
          Math.abs(result.boundingBox.y - medY) < 50 // В тому ж рядку
        ) {
          // Знайшли галочку для цього ліку!
          medications.push({
            medicationName: med.name,
            day: 'Unknown', // TODO: визначити день з позиції
            time: med.times[0] || '08:00',
            taken: true,
          });
        }
      });
    }
  });

  return medications;
}
```

---

## 🧪 Крок 5: Тестування

### 5.1. Створіть тестове фото

1. Роздрукуйте розклад з `PrintSchedule`
2. Поставте галочки ✓ ручкою
3. Сфотографуйте (або зробіть скан)

### 5.2. Тестовий код

```typescript
// В компоненті:
const handlePhotoUpload = async (file: File) => {
  // Перетворюємо файл в Base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result as string;

    try {
      // Викликаємо Vision API
      const results = await recognizePhoto(base64);
      console.log('Розпізнано:', results);

      // Шукаємо галочки
      const checkmarks = findCheckmarks(results);
      console.log('Галочки:', checkmarks);

      // Аналізуємо розклад
      const medications = await analyzeSchedulePhoto(base64, userMedications);
      console.log('Ліки з фото:', medications);

      // Оновлюємо дані
      medications.forEach((med) => {
        if (med.taken) {
          // Відмічаємо як прийняте
          markMedicationAsTaken(med.medicationName, med.time);
        }
      });

      toast.success(`Розпізнано ${medications.length} ліків!`);
    } catch (error) {
      toast.error('Помилка розпізнавання');
    }
  };
  reader.readAsDataURL(file);
};
```

---

## 📊 Метрики для Диплому

### Точність Розпізнавання:

```python
# Після тестування можете порахувати:
accuracy = correct_recognitions / total_medications
precision = true_positives / (true_positives + false_positives)
recall = true_positives / (true_positives + false_negatives)

# Приклад:
# Розклад: 21 ліків за тиждень
# Розпізнано правильно: 18
# Accuracy: 18/21 = 85.7% ✅
```

### Для презентації:
- ✅ Показати оригінальне фото
- ✅ Показати розпізнаний текст
- ✅ Показати знайдені галочки
- ✅ Показати результат (які ліки відмічені)

---

## 🔍 Покращення Алгоритму

### Версія 1 (Простий):
- Шукає галочки біля назв ліків
- Точність: ~70-80%

### Версія 2 (Покращений):
- Використовує координати таблиці
- Визначає дні тижня
- Співставляє час
- Точність: ~85-90%

### Версія 3 (ML):
- Натренована модель на ваших розкладах
- Розпізнає навіть незрозумілі галочки
- Точність: ~95%+

---

## ⚠️ Troubleshooting

### Помилка: "API key not valid"
```
Перевірте:
1. API key правильно скопійований в .env
2. Vision API активований
3. API key не обмежений занадто строго
```

### Помилка: "Daily Limit Exceeded"
```
Ви перевищили 1000 фото/день.
Рішення: Додайте billing account (але плата буде мінімальна)
```

### Розпізнає погано
```
Рекомендації:
1. Фото має бути чітким (не розмите)
2. Добре освітлення
3. Текст горизонтально (не під кутом)
4. Мінімум тіней
```

---

## 🎓 Для Диплому

### Що показати:

**1. Технічна частина:**
- Інтеграція Google Vision API
- Алгоритм розпізнавання галочок
- Обробка результатів

**2. ML компонент:**
- Computer Vision в Healthcare
- OCR (Optical Character Recognition)
- Pattern matching

**3. Метрики:**
- Точність розпізнавання
- Час обробки
- Вартість на користувача

**4. UX:**
- Простота для літніх людей
- Паперовий + цифровий підхід
- Зручність

---

## 📚 Додаткові Можливості

### Майбутні покращення:

**1. Batch Processing:**
- Розпізнати кілька тижнів за раз
- Завантажити 4 фото → отримати місячну історію

**2. Auto-rotate:**
- Автоматично повертати фото якщо воно під кутом

**3. Multi-language:**
- Розпізнавати різні мови (українська, англійська)

**4. Handwriting Recognition:**
- Розпізнавати заметки батька

---

**Готово!** Тепер можна інтегрувати в код 🚀

---

*Створено: 11 січня 2026*
*Версія: 1.0*
