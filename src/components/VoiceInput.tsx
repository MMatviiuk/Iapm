import { useState, useEffect } from 'react';
import { Mic, MicOff, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputProps {
  onResult: (text: string, parsedData?: {
    medication?: string;
    expirationDate?: Date;
    quantity?: number;
  }) => void;
  darkMode: boolean;
  currentMedications: Array<{ name: string }>;
}

export default function VoiceInput({ onResult, darkMode, currentMedications }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.lang = 'uk-UA';
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        const parsed = parseVoiceInput(text);
        onResult(text, parsed);
        toast.success('Розпізнано', { description: text, duration: 3000 });
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast.error('Помилка розпізнавання');
      };

      recognitionInstance.onend = () => setIsListening(false);
      setRecognition(recognitionInstance);
    }
  }, []);

  const parseVoiceInput = (text: string) => {
    const lower = text.toLowerCase();
    let medication: string | undefined;
    let expirationDate: Date | undefined;
    let quantity: number | undefined;

    // Знаходимо медикамент
    for (const med of currentMedications) {
      if (lower.includes(med.name.toLowerCase())) {
        medication = med.name;
        break;
      }
    }

    // Дата (наприклад: "грудня 2026", "12.2026", "грудень двадцять шостого")
    const months: Record<string, number> = {
      'січня': 0, 'лютого': 1, 'березня': 2, 'квітня': 3, 'травня': 4, 'червня': 5,
      'липня': 6, 'серпня': 7, 'вересня': 8, 'жовтня': 9, 'листопада': 10, 'грудня': 11
    };

    for (const [monthName, monthIndex] of Object.entries(months)) {
      if (lower.includes(monthName)) {
        const yearMatch = text.match(/20\d{2}/);
        const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
        expirationDate = new Date(year, monthIndex, 1);
        break;
      }
    }

    // Формат DD.MM.YYYY або MM.YYYY
    const dateMatch = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})|(\d{1,2})\.(\d{4})/);
    if (dateMatch) {
      if (dateMatch[1]) {
        expirationDate = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[1]));
      } else {
        expirationDate = new Date(parseInt(dateMatch[5]), parseInt(dateMatch[4]) - 1, 1);
      }
    }

    // Кількість (числа або слова)
    const numberWords: Record<string, number> = {
      'один': 1, 'одна': 1, 'два': 2, 'дві': 2, 'три': 3, 'чотири': 4, 'п\'ять': 5,
      'шість': 6, 'сім': 7, 'вісім': 8, 'дев\'ять': 9, 'десять': 10,
      'п\'ятнадцять': 15, 'двадцять': 20, 'тридцять': 30
    };

    for (const [word, num] of Object.entries(numberWords)) {
      if (lower.includes(word)) {
        quantity = num;
        break;
      }
    }

    const numMatch = text.match(/\d+/);
    if (numMatch && !quantity) {
      quantity = parseInt(numMatch[0]);
    }

    return { medication, expirationDate, quantity };
  };

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Голосовий ввід не підтримується');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
      toast.info('Слухаю...');
    }
  };

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleListening}
          className={`p-4 rounded-full transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        <div className="flex-1">
          <p className="text-sm text-gray-500">
            {isListening ? '🎤 Слухаю...' : 'Натисніть мікрофон'}
          </p>
          {transcript && (
            <p className="text-sm font-semibold mt-1">{transcript}</p>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>Приклади:</p>
        <ul className="list-disc list-inside mt-1">
          <li>"Аспірін термін до грудня 2026"</li>
          <li>"Залишилось п'ять таблеток метформіну"</li>
          <li>"Парацетамол закінчується 15.06.2026"</li>
        </ul>
      </div>
    </div>
  );
}
