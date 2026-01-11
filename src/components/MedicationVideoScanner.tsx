import { useState, useRef } from 'react';
import { Video, Upload, X, Loader2, Play, Pause, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  analyzeVideoInventory,
  analyzeVideoDemo,
  isVideoAPIConfigured,
  VideoMedicationResult,
  VideoAnalysisProgress,
} from '../utils/videoInventoryRecognition';
import { calculateMedicationSupply, MedicationSupply } from '../utils/inventoryRecognition';

interface MedicationVideoScannerProps {
  darkMode: boolean;
  currentMedications: Array<{
    id: string;
    name: string;
    dosage?: string;
    times: string[];
    frequency?: string;
  }>;
  onInventoryUpdate: (inventory: Array<{
    medicationId: string;
    medicationName: string;
    quantity: number;
    lastUpdated: Date;
  }>) => void;
  onClose: () => void;
}

export default function MedicationVideoScanner({
  darkMode,
  currentMedications,
  onInventoryUpdate,
  onClose,
}: MedicationVideoScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<VideoAnalysisProgress | null>(null);
  const [scanResults, setScanResults] = useState<VideoMedicationResult[]>([]);
  const [supplyCalculations, setSupplyCalculations] = useState<MedicationSupply[]>([]);
  const [showResults, setShowResults] = useState(false);

  const isAPIConfigured = isVideoAPIConfigured();

  /**
   * Обробка вибору відео файлу
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Перевірка типу файлу
    if (!file.type.startsWith('video/')) {
      toast.error('Невірний тип файлу', {
        description: 'Будь ласка, виберіть відео файл (MP4, MOV, AVI)',
        duration: 3000,
      });
      return;
    }

    // Перевірка розміру (макс 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Файл занадто великий', {
        description: `Розмір відео не повинен перевищувати 50MB. Ваш файл: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
        duration: 4000,
      });
      return;
    }

    // Створюємо preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(previewUrl);
    setSelectedVideo(file);
    setShowResults(false);
    setScanResults([]);
    setSupplyCalculations([]);

    toast.success('Відео завантажено', {
      description: 'Натисніть "Аналізувати відео" для розпізнавання',
      duration: 2000,
    });
  };

  /**
   * Відтворення/пауза відео
   */
  const togglePlayPause = () => {
    if (!videoPreviewRef.current) return;

    if (isPlaying) {
      videoPreviewRef.current.pause();
    } else {
      videoPreviewRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Запуск аналізу відео
   */
  const handleAnalyze = async () => {
    if (!selectedVideo) {
      toast.error('Оберіть відео файл');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress({
      status: 'uploading',
      progress: 0,
      message: 'Підготовка...',
    });

    try {
      let results: VideoMedicationResult[];

      if (isAPIConfigured) {
        // Справжній аналіз з Google Video Intelligence API
        console.log('🎥 Використовую Google Video Intelligence API...');

        results = await analyzeVideoInventory(
          selectedVideo,
          currentMedications,
          (progress) => {
            setAnalysisProgress(progress);
          }
        );
      } else {
        // Демо режим
        console.log('🎭 Демо режим (API не налаштований)');
        toast.info('Демо режим', {
          description: 'Video Intelligence API не налаштований. Показую тестові результати.',
          duration: 3000,
        });

        results = await analyzeVideoDemo(
          selectedVideo,
          currentMedications,
          (progress) => {
            setAnalysisProgress(progress);
          }
        );
      }

      setScanResults(results);

      // Розраховуємо залишки
      const supplies: MedicationSupply[] = [];

      results.forEach((result) => {
        const medication = currentMedications.find(
          (m) => m.name.toLowerCase() === result.medicationName.toLowerCase()
        );

        if (medication) {
          const dailyDosage = medication.times.length;

          const supply = calculateMedicationSupply(
            result.medianCount, // Використовуємо медіану (стабільніше)
            dailyDosage,
            medication.name
          );

          supplies.push(supply);
        }
      });

      setSupplyCalculations(supplies);
      setShowResults(true);

      toast.success('Аналіз завершено', {
        description: `Розпізнано ${results.length} медикаментів`,
        duration: 3000,
      });

    } catch (error: any) {
      console.error('Помилка аналізу відео:', error);
      toast.error('Помилка аналізу', {
        description: error.message || 'Не вдалося проаналізувати відео',
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  /**
   * Підтвердження результатів
   */
  const handleConfirm = () => {
    const inventory = scanResults.map((result) => {
      const medication = currentMedications.find(
        (m) => m.name.toLowerCase() === result.medicationName.toLowerCase()
      );

      return {
        medicationId: medication?.id || 'unknown',
        medicationName: result.medicationName,
        quantity: result.medianCount,
        lastUpdated: new Date(),
      };
    });

    onInventoryUpdate(inventory);

    toast.success('Інвентар оновлено', {
      description: `Збережено дані про ${inventory.length} медикаментів`,
      duration: 3000,
    });

    onClose();
  };

  /**
   * Форматування часу
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      darkMode ? 'bg-black/80' : 'bg-black/50'
    }`}>
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Заголовок */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Video className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Відео Аналіз Інвентарю</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isAnalyzing}
            className={`p-2 rounded-lg transition-colors ${
              isAnalyzing
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Контент */}
        <div className="p-6 space-y-6">
          {/* Інструкції */}
          {!selectedVideo && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50 border border-purple-200'
            }`}>
              <h3 className="font-semibold mb-2">🎥 Як зняти відео:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Покладіть медикаменти на стіл</li>
                <li>Тримайте телефон стабільно над упаковками</li>
                <li>Повільно обертайте блістер/пляшку (10-30 секунд)</li>
                <li>Переконайтесь що назва ліків видно</li>
                <li>Можна показувати пальцем на кожну таблетку</li>
              </ol>
              <p className="text-xs mt-2 text-gray-500">
                💡 Порада: Відео дає кращу точність ніж фото, бо система бачить упаковку з усіх боків!
              </p>
            </div>
          )}

          {/* Завантаження відео */}
          {!selectedVideo ? (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className={`w-full max-w-md h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${
                  isAnalyzing
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                    ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700/50'
                    : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Video className="w-16 h-16 text-gray-400" />
                <div className="text-center">
                  <p className="text-lg font-medium">Завантажити відео</p>
                  <p className="text-sm text-gray-500 mt-1">
                    або клацніть для вибору файлу
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    MP4, MOV, AVI • Максимум 50MB • 10-60 секунд
                  </p>
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                disabled={isAnalyzing}
                className="hidden"
              />
            </div>
          ) : (
            <>
              {/* Попередній перегляд відео */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Вибране відео:</h3>
                  <button
                    onClick={() => {
                      setSelectedVideo(null);
                      setVideoPreviewUrl(null);
                      setShowResults(false);
                      setScanResults([]);
                      setSupplyCalculations([]);
                      if (videoPreviewRef.current) {
                        videoPreviewRef.current.pause();
                      }
                    }}
                    disabled={isAnalyzing}
                    className={`text-sm px-3 py-1 rounded-lg ${
                      isAnalyzing
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Змінити відео
                  </button>
                </div>

                {/* Відео плеєр */}
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoPreviewRef}
                    src={videoPreviewUrl || undefined}
                    className="w-full max-h-96 object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    controls
                  />

                  {/* Кнопка Play/Pause поверх відео */}
                  {!isPlaying && (
                    <button
                      onClick={togglePlayPause}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                    >
                      <Play className="w-20 h-20 text-white opacity-80" />
                    </button>
                  )}
                </div>

                {/* Інфо про відео */}
                <div className={`p-3 rounded-lg text-sm ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex justify-between">
                    <span>Розмір:</span>
                    <span className="font-semibold">
                      {selectedVideo ? (selectedVideo.size / 1024 / 1024).toFixed(2) : 0} MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Прогрес аналізу */}
              {isAnalyzing && analysisProgress && (
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                    <div className="flex-1">
                      <p className="font-semibold">{analysisProgress.message}</p>
                      {analysisProgress.estimatedTimeRemaining && (
                        <p className="text-sm text-gray-500">
                          Залишилось ~{formatTime(analysisProgress.estimatedTimeRemaining)}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-purple-500">
                      {analysisProgress.progress}%
                    </span>
                  </div>

                  {/* Прогрес бар */}
                  <div className={`h-2 rounded-full overflow-hidden ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${analysisProgress.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Кнопка аналізу */}
              {!showResults && !isAnalyzing && (
                <button
                  onClick={handleAnalyze}
                  className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                >
                  <Video className="w-5 h-5" />
                  Аналізувати відео
                </button>
              )}
            </>
          )}

          {/* Результати */}
          {showResults && scanResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Результати аналізу:</h3>

              {scanResults.map((result, index) => {
                const supply = supplyCalculations[index];

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{result.medicationName}</h4>
                        <p className="text-sm text-gray-500">
                          Кадрів проаналізовано: {result.frames.length}
                        </p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>

                    {/* Підрахунок */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Медіана:</p>
                        <p className="text-2xl font-bold text-purple-500">{result.medianCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Середнє:</p>
                        <p className="text-2xl font-bold">{result.averageCount}</p>
                      </div>
                      {supply && (
                        <div>
                          <p className="text-sm text-gray-500">Днів:</p>
                          <p className="text-2xl font-bold">{supply.daysRemaining}</p>
                        </div>
                      )}
                    </div>

                    {/* Попередження */}
                    {supply && supply.alerts.map((alert, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded text-sm mb-2 ${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                      >
                        {alert}
                      </div>
                    ))}

                    {/* Дані по кадрах */}
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-semibold text-purple-500 hover:text-purple-400">
                        Показати деталі по кадрах
                      </summary>
                      <div className="mt-2 space-y-1">
                        {result.frames.map((frame, i) => (
                          <div
                            key={i}
                            className={`flex justify-between p-2 rounded text-xs ${
                              darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}
                          >
                            <span>Час: {frame.timeOffset}</span>
                            <span>Кількість: {frame.count}</span>
                            <span>Впевненість: {Math.round(frame.confidence * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </details>

                    {/* Впевненість */}
                    <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-500">Загальна впевненість:</span>
                        <span className="font-semibold">{Math.round(result.confidence * 100)}%</span>
                      </div>
                      <div className={`h-2 rounded-full ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <div
                          className="h-full rounded-full bg-purple-500"
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Кнопки дій */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  ✅ Підтвердити та зберегти
                </button>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setScanResults([]);
                    setSupplyCalculations([]);
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Повторити аналіз
                </button>
              </div>
            </div>
          )}

          {/* Немає результатів */}
          {showResults && scanResults.length === 0 && (
            <div className={`p-6 text-center rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
              <p className="font-semibold mb-2">Медикаменти не знайдено</p>
              <p className="text-sm text-gray-500 mb-4">
                Спробуйте:
                <br />• Показати упаковки ближче до камери
                <br />• Переконатись що назва ліків видно
                <br />• Зняти відео з кращим освітленням
              </p>
              <button
                onClick={() => {
                  setSelectedVideo(null);
                  setVideoPreviewUrl(null);
                  setShowResults(false);
                }}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-600 hover:bg-gray-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                Спробувати знову
              </button>
            </div>
          )}

          {/* Демо попередження */}
          {!isAPIConfigured && (
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-300'
            }`}>
              <p className="text-sm">
                ⚠️ <strong>Демо режим:</strong> Google Video Intelligence API не налаштований.
                Для реального аналізу додайте VITE_GOOGLE_VISION_API_KEY в .env файл.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
