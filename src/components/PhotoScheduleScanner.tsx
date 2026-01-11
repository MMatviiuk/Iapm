/**
 * PhotoScheduleScanner Component
 * Компонент для фотографування та розпізнавання паперового розкладу ліків
 */

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  analyzeSchedulePhoto,
  analyzeDemoSchedule,
  isVisionAPIConfigured,
  type MedicationFromPhoto
} from '../utils/visionAPI';

interface PhotoScheduleScannerProps {
  darkMode: boolean;
  currentMedications: any[];
  onMedicationsRecognized: (medications: MedicationFromPhoto[]) => void;
  onClose?: () => void;
}

export default function PhotoScheduleScanner({
  darkMode,
  currentMedications,
  onMedicationsRecognized,
  onClose,
}: PhotoScheduleScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<MedicationFromPhoto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoClick = () => {
    if (scanning) return;

    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валідація типу файлу
    if (!file.type.startsWith('image/')) {
      toast.error('Невірний тип файлу', {
        description: 'Будь ласка, оберіть фото (JPG, PNG)',
      });
      return;
    }

    // Валідація розміру (макс 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Файл занадто великий', {
        description: 'Максимальний розмір: 10MB',
      });
      return;
    }

    try {
      setScanning(true);
      setError(null);
      setResults(null);

      // Створюємо preview
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);

        toast.info('Розпізнавання...', {
          description: 'Аналізуємо фото розкладу',
        });

        try {
          let recognizedMeds: MedicationFromPhoto[];

          // Перевіряємо чи налаштований Google Vision API
          if (isVisionAPIConfigured()) {
            // Використовуємо справжній Google Vision API
            recognizedMeds = await analyzeSchedulePhoto(base64, currentMedications);
          } else {
            // Використовуємо демо режим
            console.warn('⚠️ Google Vision API не налаштований. Використовую демо режим.');
            toast.warning('Демо режим', {
              description: 'Налаштуйте Google Vision API для справжнього розпізнавання',
            });
            recognizedMeds = await analyzeDemoSchedule(currentMedications);
          }

          setResults(recognizedMeds);

          if (recognizedMeds.length > 0) {
            toast.success(`Розпізнано ${recognizedMeds.length} відміток!`, {
              description: 'Перевірте результати нижче',
            });

            if ('vibrate' in navigator) {
              navigator.vibrate([100, 50, 100]);
            }
          } else {
            toast.warning('Галочки не знайдено', {
              description: 'Спробуйте фото з кращим освітленням',
            });
          }

        } catch (err: any) {
          console.error('Помилка розпізнавання:', err);
          setError(err.message || 'Не вдалося розпізнати фото');
          toast.error('Помилка', {
            description: err.message || 'Не вдалося розпізнати фото',
          });
        } finally {
          setScanning(false);
        }
      };

      reader.readAsDataURL(file);

    } catch (err: any) {
      console.error('Помилка завантаження фото:', err);
      toast.error('Помилка завантаження');
      setScanning(false);
    } finally {
      // Очищуємо input для можливості вибрати той самий файл знову
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirm = () => {
    if (results && results.length > 0) {
      onMedicationsRecognized(results);
      toast.success('Дані оновлено!', {
        description: `Відмічено ${results.length} прийомів ліків`,
      });
      onClose?.();
    }
  };

  const handleRetry = () => {
    setPreviewUrl(null);
    setResults(null);
    setError(null);
    handlePhotoClick();
  };

  return (
    <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="space-y-6">
        {/* Заголовок */}
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📸 Сканування Розкладу
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Сфотографуйте паперовий розклад з галочками
          </p>
        </div>

        {/* Інструкція */}
        {!previewUrl && (
          <div className={`p-4 rounded-lg border-2 border-dashed ${
            darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-start gap-3">
              <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="font-medium mb-2">Як це працює:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Роздрукуйте недільний розклад</li>
                  <li>Протягом тижня ставте галочки ✓ ручкою</li>
                  <li>Сфотографуйте розклад</li>
                  <li>Ми автоматично розпізнаємо галочки</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка завантаження або Preview */}
        {!previewUrl ? (
          <button
            onClick={handlePhotoClick}
            disabled={scanning}
            className={`w-full h-64 rounded-lg border-2 border-dashed transition-all ${
              scanning
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-blue-500 hover:bg-blue-50/50 active:scale-95'
            } ${
              darkMode
                ? 'border-gray-600 bg-gray-700/30'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              {scanning ? (
                <>
                  <Loader2 className={`w-16 h-16 animate-spin ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <p className={`text-lg font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Розпізнавання...
                  </p>
                </>
              ) : (
                <>
                  <Camera className={`w-16 h-16 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <div className="space-y-1">
                    <p className={`text-lg font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Завантажити фото
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      або натисніть щоб вибрати файл
                    </p>
                  </div>
                </>
              )}
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            {/* Preview фото */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Фото розкладу"
                className="w-full h-auto max-h-96 object-contain bg-gray-100"
              />
              {scanning && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
              )}
            </div>

            {/* Результати */}
            {error && (
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
                      Помилка розпізнавання
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {results && results.length > 0 && (
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                      Розпізнано {results.length} відміток
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                      Перевірте список нижче перед підтвердженням
                    </p>
                  </div>
                </div>

                {/* Список розпізнаних ліків */}
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {results.map((med, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {med.medicationName}
                          </p>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {med.day}, {med.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {Math.round(med.confidence * 100)}%
                          </span>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Кнопки дій */}
        <div className="flex gap-3">
          {previewUrl ? (
            <>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex-1"
                disabled={scanning}
              >
                <Camera className="w-4 h-4 mr-2" />
                Інше фото
              </Button>
              {results && results.length > 0 && (
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={scanning}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Підтвердити ({results.length})
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Скасувати
            </Button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={scanning}
        />

        {/* API Key попередження */}
        {!isVisionAPIConfigured() && (
          <div className={`p-3 rounded-lg text-xs ${
            darkMode ? 'bg-yellow-900/20 border border-yellow-800 text-yellow-300' : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
          }`}>
            <p className="font-medium">⚠️ Демо режим</p>
            <p className="mt-1">
              Налаштуйте Google Vision API для справжнього розпізнавання.
              Зараз використовуються тестові дані.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
