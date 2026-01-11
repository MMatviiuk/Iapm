/**
 * Базові консультації по здоров'ю (поки ChatGPT Health недоступний)
 * Використовує OpenAI API напряму
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export interface HealthConsultationRequest {
  question: string;
  medications?: Array<{ name: string; dosage?: string; times: string[] }>;
  recentLogs?: Array<{ medication: string; takenAt: Date; status: string }>;
  trackerData?: Array<{ heartRate: number; measuredAt: Date }>;
  userContext?: string; // Вік, стать, особливості
}

export interface HealthConsultationResponse {
  answer: string;
  suggestions: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  disclaime: string;
}

/**
 * Отримати консультацію по здоров'ю
 */
export async function getHealthConsultation(
  request: HealthConsultationRequest
): Promise<HealthConsultationResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key не налаштований');
  }

  // Формуємо контекст
  const systemPrompt = `Ти медичний помічник. Надавай точну, зрозумілу інформацію про здоров'я.
ВАЖЛИВО:
- НЕ діагностуй і НЕ призначай лікування
- ЗАВЖДИ рекомендуй звернутися до лікаря при серйозних симптомах
- Враховуй контекст користувача (ліки, історія, пульс)
- Відповідай українською або російською мовою
- Будь чутливим до тривожних ознак`;

  let userMessage = request.question;

  // Додаємо контекст про ліки
  if (request.medications && request.medications.length > 0) {
    userMessage += `\n\nМої ліки:\n${request.medications
      .map((m) => `- ${m.name} ${m.dosage || ''}, ${m.times.length}x на день`)
      .join('\n')}`;
  }

  // Додаємо останні прийоми
  if (request.recentLogs && request.recentLogs.length > 0) {
    const last5 = request.recentLogs.slice(0, 5);
    userMessage += `\n\nОстанні прийоми:\n${last5
      .map((l) => `- ${l.medication}: ${l.status} (${new Date(l.takenAt).toLocaleDateString()})`)
      .join('\n')}`;
  }

  // Додаємо дані пульсу
  if (request.trackerData && request.trackerData.length > 0) {
    const avgHR = Math.round(
      request.trackerData.reduce((sum, t) => sum + t.heartRate, 0) / request.trackerData.length
    );
    userMessage += `\n\nСередній пульс за останній час: ${avgHR} уд/хв`;
  }

  // Контекст користувача
  if (request.userContext) {
    userMessage += `\n\nПро мене: ${request.userContext}`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Дешевша модель $0.150 / 1M tokens
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API помилка: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    // Аналізуємо терміновість на основі ключових слів
    const urgency = analyzeUrgency(request.question, answer);

    // Генеруємо поради
    const suggestions = extractSuggestions(answer);

    return {
      answer,
      suggestions,
      urgency,
      disclaimer:
        '⚠️ Це не медична консультація. При серйозних симптомах звертайтеся до лікаря.',
    };
  } catch (error: any) {
    console.error('Health consultation error:', error);
    throw new Error(`Не вдалося отримати консультацію: ${error.message}`);
  }
}

/**
 * Аналізує терміновість на основі ключових слів
 */
function analyzeUrgency(question: string, answer: string): 'low' | 'medium' | 'high' | 'emergency' {
  const text = (question + ' ' + answer).toLowerCase();

  // Екстрені випадки
  const emergencyKeywords = [
    'серцевий напад',
    'інсульт',
    'важко дихати',
    'біль у грудях',
    'втрата свідомості',
    'кровотеча',
    'алергічна реакція',
  ];
  if (emergencyKeywords.some((k) => text.includes(k))) {
    return 'emergency';
  }

  // Високий пріоритет
  const highKeywords = [
    'висока температура',
    'сильний біль',
    'запаморочення',
    'нудота',
    'блювота',
    'термінов',
  ];
  if (highKeywords.some((k) => text.includes(k))) {
    return 'high';
  }

  // Середній пріоритет
  const mediumKeywords = [
    'побічн',
    'взаємодія ліків',
    'незвичайні симптоми',
    'зміни в стані',
  ];
  if (mediumKeywords.some((k) => text.includes(k))) {
    return 'medium';
  }

  return 'low';
}

/**
 * Витягує поради з відповіді
 */
function extractSuggestions(answer: string): string[] {
  const suggestions: string[] = [];

  // Шукаємо списки
  const lines = answer.split('\n');
  lines.forEach((line) => {
    if (line.trim().match(/^[-*•]\s/)) {
      suggestions.push(line.replace(/^[-*•]\s/, '').trim());
    }
  });

  // Якщо не знайшли списків - розділяємо по реченнях
  if (suggestions.length === 0) {
    const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    return sentences.slice(0, 3).map((s) => s.trim());
  }

  return suggestions.slice(0, 5);
}

/**
 * Приклади для тестування без API
 */
export async function getDemoHealthConsultation(
  request: HealthConsultationRequest
): Promise<HealthConsultationResponse> {
  // Симуляція затримки
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const demoResponses: Record<string, HealthConsultationResponse> = {
    default: {
      answer:
        'На основі ваших ліків та історії прийому, все виглядає нормально. Однак якщо ви відчуваєте незвичайні симптоми, краще проконсультуватися з лікарем.',
      suggestions: [
        'Продовжуйте приймати ліки згідно розкладу',
        'Моніторте пульс щодня',
        'Зверніться до лікаря при погіршенні',
      ],
      urgency: 'low',
      disclaimer: '⚠️ Це демо відповідь. Налаштуйте OpenAI API для реальних консультацій.',
    },
    temperature: {
      answer:
        'Висока температура може бути ознакою інфекції. При температурі вище 38.5°C рекомендується прийняти парацетамол. Якщо температура тримається більше 3 днів або перевищує 39°C - обов\'язково зверніться до лікаря.',
      suggestions: [
        'Прийміть парацетамол 500мг',
        'Пийте багато рідини',
        'Відпочивайте',
        'Зверніться до лікаря якщо погіршиться',
      ],
      urgency: 'high',
      disclaimer: '⚠️ Це не медична консультація. При серйозних симптомах звертайтеся до лікаря.',
    },
  };

  const q = request.question.toLowerCase();
  if (q.includes('температур')) {
    return demoResponses.temperature;
  }

  return demoResponses.default;
}

/**
 * Перевірка чи налаштований OpenAI API
 */
export function isHealthAPIConfigured(): boolean {
  return !!OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here';
}
