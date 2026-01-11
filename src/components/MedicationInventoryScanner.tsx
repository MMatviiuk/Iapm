import { useState, useRef } from 'react';
import { Camera, Video, X, Loader2, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  analyzeMedicationInventory,
  analyzeDemoInventory,
  calculateMedicationSupply,
  checkCourseCompletion,
  isInventoryAPIConfigured,
  RecognizedMedication,
  MedicationSupply,
} from '../utils/inventoryRecognition';
import {
  analyzeVideoInventory,
  analyzeVideoDemo,
  isVideoAPIConfigured,
  type VideoMedicationResult,
} from '../utils/videoInventoryRecognition';

interface MedicationInventoryScannerProps {
  darkMode: boolean;
  currentMedications: Array<{
    id: string;
    name: string;
    dosage?: string;
    times: string[];
    frequency?: string;
    courseEndDate?: Date;
    prescribedDuration?: number;
    startDate?: Date;
  }>;
  onInventoryUpdate: (inventory: Array<{
    medicationId: string;
    medicationName: string;
    quantity: number;
    lastUpdated: Date;
  }>) => void;
  onClose: () => void;
}

export default function MedicationInventoryScanner({
  darkMode,
  currentMedications,
  onInventoryUpdate,
  onClose,
}: MedicationInventoryScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [scanMode, setScanMode] = useState<'photo' | 'video'>('photo');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<RecognizedMedication[]>([]);
  const [supplyCalculations, setSupplyCalculations] = useState<MedicationSupply[]>([]);
  const [showResults, setShowResults] = useState(false);

  const isPhotoAPIConfigured = isInventoryAPIConfigured();
  const isVideoConfigured = isVideoAPIConfigured();

  const resetResults = () => {
    setShowResults(false);
    setScanResults([]);
    setSupplyCalculations([]);
  };

  const handleModeChange = (mode: 'photo' | 'video') => {
    setScanMode(mode);
    setSelectedPhoto(null);
    setSelectedVideo(null);
    resetResults();
  };

  const normalizeVideoResults = (results: VideoMedicationResult[]): RecognizedMedication[] => {
    return results.map((result) => ({
      medicationName: result.medicationName,
      packageType: result.packageType,
      estimatedCount: result.medianCount || result.averageCount,
      confidence: result.confidence,
      boundingBox: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      ocrText: [],
      visualFeatures: {
        hasBlisterPack: result.packageType === 'blister',
        hasBottle: result.packageType === 'bottle',
        visiblePills: result.medianCount || result.averageCount,
        colors: [],
      },
    }));
  };

  /**
   * Обробка вибору файлу
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Перевірка типу файлу
    if (!file.type.startsWith('image/')) {
      toast.error('Невірний тип файлу', {
        description: 'Будь ласка, виберіть зображення (JPG, PNG, тощо)',
        duration: 3000,
      });
      return;
    }

    // Перевірка розміру (макс 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Файл занадто великий', {
        description: 'Розмір зображення не повинен перевищувати 10MB',
        duration: 3000,
      });
      return;
    }

    // Читаємо файл як Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedPhoto(base64String);
      setSelectedVideo(null);
      resetResults();

      toast.success('Фото завантажено', {
        description: 'Натисніть "Сканувати" для розпізнавання',
        duration: 2000,
      });
    };
    reader.readAsDataURL(file);
  };

  /**
   * Обробка вибору відео
   */
  const handleVideoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Невірний тип файлу', {
        description: 'Будь ласка, виберіть відео (MP4, MOV, тощо)',
        duration: 3000,
      });
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Файл занадто великий', {
        description: 'Розмір відео не повинен перевищувати 50MB',
        duration: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedVideo(base64String);
      setSelectedPhoto(null);
      resetResults();

      toast.success('Відео завантажено', {
        description: 'Натисніть "Сканувати" для розпізнавання',
        duration: 2000,
      });
    };
    reader.readAsDataURL(file);
  };

  /**
   * Запуск сканування
   */
  const handleScan = async () => {
    const isPhotoMode = scanMode === 'photo';

    if (isPhotoMode && !selectedPhoto) {
      toast.error('Оберіть фото');
      return;
    }

    if (!isPhotoMode && !selectedVideo) {
      toast.error('Оберіть відео');
      return;
    }

    setIsScanning(true);

    try {
      let results: RecognizedMedication[] = [];

      if (isPhotoMode) {
        if (isPhotoAPIConfigured) {
          results = await analyzeMedicationInventory(selectedPhoto as string, currentMedications);
        } else {
          toast.info('Демо режим', {
            description: 'Vision API не налаштований. Показую тестові результати.',
            duration: 3000,
          });
          results = await analyzeDemoInventory(currentMedications);
        }
      } else {
        if (isVideoConfigured) {
          const videoResults = await analyzeVideoInventory(
            selectedVideo as string,
            currentMedications
          );
          results = normalizeVideoResults(videoResults);
        } else {
          toast.info('Демо режим', {
            description: 'Video Intelligence API не налаштований. Показую тестові результати.',
            duration: 3000,
          });
          const videoResults = await analyzeVideoDemo(currentMedications);
          results = normalizeVideoResults(videoResults);
        }
      }

      setScanResults(results);

      const supplies: MedicationSupply[] = [];

      results.forEach((result) => {
        const medication = currentMedications.find(
          (m) => m.name.toLowerCase() === result.medicationName.toLowerCase()
        );

        if (medication) {
          const dailyDosage = medication.times.length;

          const supply = calculateMedicationSupply(
            result.estimatedCount,
            dailyDosage,
            medication.name
          );

          supplies.push(supply);
        }
      });

      setSupplyCalculations(supplies);
      setShowResults(true);

      toast.success('Сканування завершено', {
        description: `Розпізнано ${results.length} медикаментів`,
        duration: 2000,
      });

    } catch (error: any) {
      console.error('Помилка сканування:', error);
      toast.error('Помилка сканування', {
        description: error.message || 'Не вдалося розпізнати інвентар',
        duration: 4000,
      });
    } finally {
      setIsScanning(false);
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
        quantity: result.estimatedCount,
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
   * Іконка статусу залишку
   */
  const getStatusIcon = (status: MedicationSupply['status']) => {
    switch (status) {
      case 'sufficient':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'low':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'out':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  /**
   * Колір статусу
   */
  const getStatusColor = (status: MedicationSupply['status']) => {
    switch (status) {
      case 'sufficient':
        return darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-300';
      case 'low':
        return darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-300';
      case 'critical':
        return darkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-300';
      case 'out':
        return darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-300';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      darkMode ? 'bg-black/80' : 'bg-black/50'
    }`}>
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Заголовок */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Інвентар Медикаментів</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Контент */}
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleModeChange('photo')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                scanMode === 'photo'
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Фото
            </button>
            <button
              onClick={() => handleModeChange('video')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                scanMode === 'video'
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Відео
            </button>
          </div>

          {(scanMode === 'photo' ? !selectedPhoto : !selectedVideo) && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}>
              <h3 className="font-semibold mb-2">Як користуватись:</h3>
              {scanMode === 'photo' ? (
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Сфотографуйте медикаменти на тумбочці</li>
                  <li>Переконайтесь, що упаковки добре видно</li>
                  <li>Натисніть "Сканувати" для розпізнавання</li>
                  <li>Перевірте результати та підтвердіть</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Запишіть відео з медикаментами на тумбочці</li>
                  <li>Повільно обертайте упаковку перед камерою</li>
                  <li>Натисніть "Сканувати" для аналізу</li>
                  <li>Перевірте результати та підтвердіть</li>
                </ol>
              )}
            </div>
          )}

          {scanMode === 'photo' ? (
            !selectedPhoto ? (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full max-w-md h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${
                    darkMode
                      ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <Camera className="w-16 h-16 text-gray-400" />
                  <div className="text-center">
                    <p className="text-lg font-medium">Завантажити фото</p>
                    <p className="text-sm text-gray-500 mt-1">
                      або клацніть для вибору файлу
                    </p>
                  </div>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Вибране фото:</h3>
                    <button
                      onClick={() => {
                        setSelectedPhoto(null);
                        resetResults();
                      }}
                      className={`text-sm px-3 py-1 rounded-lg ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Змінити фото
                    </button>
                  </div>
                  <img
                    src={selectedPhoto}
                    alt="Інвентар"
                    className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                </div>

                {!showResults && (
                  <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      isScanning
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Сканую...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Сканувати інвентар
                      </>
                    )}
                  </button>
                )}
              </>
            )
          ) : (
            !selectedVideo ? (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className={`w-full max-w-md h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${
                    darkMode
                      ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <Video className="w-16 h-16 text-gray-400" />
                  <div className="text-center">
                    <p className="text-lg font-medium">Завантажити відео</p>
                    <p className="text-sm text-gray-500 mt-1">
                      бажано до 30 секунд
                    </p>
                  </div>
                </button>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Вибране відео:</h3>
                    <button
                      onClick={() => {
                        setSelectedVideo(null);
                        resetResults();
                      }}
                      className={`text-sm px-3 py-1 rounded-lg ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Змінити відео
                    </button>
                  </div>
                  <video
                    src={selectedVideo}
                    controls
                    className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                </div>

                {!showResults && (
                  <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      isScanning
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Аналізую відео...
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        Сканувати інвентар
                      </>
                    )}
                  </button>
                )}
              </>
            )
          )}

          {/* Результати сканування */}
          {showResults && scanResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Результати сканування:</h3>
              {scanMode === 'video' && (
                <p className="text-sm text-gray-500">
                  Для відео використано медіанну оцінку по кадрах, щоб зменшити похибку.
                </p>
              )}

              {scanResults.map((result, index) => {
                const supply = supplyCalculations[index];
                const medication = currentMedications.find(
                  (m) => m.name.toLowerCase() === result.medicationName.toLowerCase()
                );

                // Перевірка завершення курсу
                const courseCheck = medication
                  ? checkCourseCompletion(medication, result.estimatedCount)
                  : null;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      supply ? getStatusColor(supply.status) : (darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300')
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{result.medicationName}</h4>
                        <p className="text-sm text-gray-500">
                          Тип: {result.packageType === 'blister' ? 'Блістер' :
                                 result.packageType === 'bottle' ? 'Пляшка' :
                                 result.packageType === 'loose' ? 'Розсипані' :
                                 result.packageType === 'box' ? 'Коробка' : 'Невідомо'}
                        </p>
                      </div>
                      {supply && getStatusIcon(supply.status)}
                    </div>

                    {/* Кількість */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Залишок:</p>
                        <p className="text-2xl font-bold">{result.estimatedCount}</p>
                      </div>
                      {supply && (
                        <div>
                          <p className="text-sm text-gray-500">Днів залишилось:</p>
                          <p className="text-2xl font-bold">{supply.daysRemaining}</p>
                        </div>
                      )}
                    </div>

                    {/* Попередження */}
                    {supply && supply.alerts.map((alert, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded text-sm mb-2 ${
                          darkMode ? 'bg-gray-900/50' : 'bg-white/50'
                        }`}
                      >
                        {alert}
                      </div>
                    ))}

                    {/* Перевірка курсу */}
                    {courseCheck && courseCheck.shouldStopBuying && (
                      <div className={`p-3 rounded-lg mt-3 ${
                        darkMode ? 'bg-green-900/50 border border-green-700' : 'bg-green-100 border border-green-300'
                      }`}>
                        <p className="font-semibold text-green-700 dark:text-green-300">
                          {courseCheck.message}
                        </p>
                      </div>
                    )}

                    {/* Впевненість розпізнавання */}
                    <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Впевненість розпізнавання:</span>
                        <span className="font-semibold">{Math.round(result.confidence * 100)}%</span>
                      </div>
                      <div className={`mt-2 h-2 rounded-full ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div
                          className="h-full rounded-full bg-blue-500"
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
                  Підтвердити та зберегти
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
                  Повторити сканування
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
                Спробуйте зробити фото або відео ближче чи з кращим освітленням
              </p>
              <button
                onClick={() => {
                  setSelectedPhoto(null);
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
          {scanMode === 'photo' && !isPhotoAPIConfigured && (
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-300'
            }`}>
              <p className="text-sm">
                <strong>Демо режим:</strong> Google Vision API не налаштований.
                Для реального розпізнавання додайте VITE_GOOGLE_VISION_API_KEY в .env файл.
              </p>
            </div>
          )}
          {scanMode === 'video' && !isVideoConfigured && (
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-300'
            }`}>
              <p className="text-sm">
                <strong>Демо режим:</strong> Video Intelligence API не налаштований.
                Для реального розпізнавання додайте VITE_GOOGLE_VISION_API_KEY в .env файл.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
