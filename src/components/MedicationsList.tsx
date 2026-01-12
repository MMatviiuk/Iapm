import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Plus, Pill, Clock, SortAsc, X, Edit2, Trash2, Printer, CalendarClock, CheckCircle, CheckCheck, MoreVertical, Package, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import EmptyState from './EmptyState';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  updateMedicationStatuses,
  shouldShowInAllMedicationsList,
  getStatusBadgeColor,
  getStatusLabel,
  calculateMedicationStatus,
  type MedicationStatus
} from '../utils/medicationStatusManager';
import AdvancedSearchFilters, { FilterState } from './AdvancedSearchFilters';
import MedicationExport from './MedicationExport';
import MedicationQuickActions from './MedicationQuickActions';
import BatchOperations from './BatchOperations';
import MedicationInventoryScanner from './MedicationInventoryScanner';
import MedicationVideoScanner from './MedicationVideoScanner';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  times: string[];
  frequency?: string;
  mealTiming?: string;
  color?: string;
  photoUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: MedicationStatus;
  deletedAt?: string;
}

interface MedicationsListProps {
  medications: Medication[];
  onAddMedication: () => void;
  onSelectMedication: (med: Medication) => void;
  onEditMedication?: (id: number) => void;
  onDeleteMedication?: (id: number) => void;
  onPrintMedication?: (id: number) => void;
  darkMode: boolean;
}

export default function MedicationsList({
  medications,
  onAddMedication,
  onSelectMedication,
  onEditMedication,
  onDeleteMedication,
  onPrintMedication,
  darkMode,
}: MedicationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'time'>('name');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [quickActionsId, setQuickActionsId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [batchMode, setBatchMode] = useState(false);
  const [showInventoryScanner, setShowInventoryScanner] = useState(false);
  const [showVideoScanner, setShowVideoScanner] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    form: 'all',
    mealTiming: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Get unique frequencies for filter
  const frequencies = Array.from(
    new Set(medications.map((m) => m.frequency).filter(Boolean))
  );

  // Step 1: Update all medication statuses
  const medicationsWithStatus = updateMedicationStatuses(medications);
  
  // Step 2: Filter out DELETED medications (use shouldShowInAllMedicationsList)
  const visibleMedications = medicationsWithStatus.filter(shouldShowInAllMedicationsList);
  
  // Step 3: Filter medications by advanced filters
  const filteredMedications = visibleMedications.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (med.dosage && med.dosage.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filters.status === 'all' || med.status === filters.status;
    
    const matchesForm = filters.form === 'all' || 
                       (med as any).form?.toLowerCase() === filters.form;
    
    const matchesMealTiming = filters.mealTiming === 'all' || 
                             med.mealTiming === filters.mealTiming;
    
    return matchesSearch && matchesStatus && matchesForm && matchesMealTiming;
  });

  // Sort medications based on advanced filters
  const sortedMedications = [...filteredMedications].sort((a, b) => {
    let comparison = 0;
    
    if (filters.sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (filters.sortBy === 'time') {
      const aTime = (a.times && a.times[0]) || '';
      const bTime = (b.times && b.times[0]) || '';
      comparison = aTime.localeCompare(bTime);
    } else if (filters.sortBy === 'dateAdded') {
      comparison = (a.id || 0) - (b.id || 0);
    }
    
    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterFrequency('all');
    setFilterStatus('all');
    setSortBy('name');
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (filterFrequency !== 'all' ? 1 : 0) +
    (filterStatus !== 'all' ? 1 : 0) +
    (sortBy !== 'name' ? 1 : 0);

  return (
    <div
      className={`min-h-screen pb-24 lg:pb-8 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Мобільний заголовок */}
      <div
        className={`sticky top-0 z-10 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } px-3 sm:px-6 lg:px-8 py-3 sm:py-4`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-3">
            <h1
              className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Усі ліки
            </h1>
            <Button
              onClick={onAddMedication}
              size="sm"
              className="h-10 sm:h-12 px-3 sm:px-4 bg-[#2196F3] hover:bg-[#1976D2] text-white touch-manipulation"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline ml-2">Додати</span>
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowVideoScanner(true)}
                size="sm"
                className="h-10 sm:h-12 px-2 sm:px-3 bg-indigo-600 hover:bg-indigo-700 text-white touch-manipulation"
                title="Відео інвентаризація"
              >
                <Video className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
              <Button
                onClick={() => setShowInventoryScanner(true)}
                size="sm"
                className="h-10 sm:h-12 px-2 sm:px-3 bg-purple-600 hover:bg-purple-700 text-white touch-manipulation"
                title="Фото інвентаризація"
              >
                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline ml-2">Інвентар</span>
              </Button>
              <Button
                onClick={onAddMedication}
                size="sm"
                className="h-10 sm:h-12 px-3 sm:px-4 bg-[#2196F3] hover:bg-[#1976D2] text-white touch-manipulation"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline ml-2">Add</span>
              </Button>
            </div>
          </div>

          {/* Пошук */}
          <div className="relative mb-3">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
              type="text"
              placeholder="Пошук ліків..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 h-11 sm:h-12 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
              }`}
            />
          </div>

          {/* Фільтри */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-3 px-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className={`h-9 px-3 flex-shrink-0 ${
                activeFiltersCount > 0 ? 'border-[#2196F3] text-[#2196F3]' : ''
              }`}
            >
              <Filter className="w-4 h-4 mr-1.5" />
              Фільтри
              {activeFiltersCount > 0 && (
                <Badge className="ml-1.5 bg-[#2196F3] text-white h-5 min-w-[20px] px-1.5">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Фільтр за статусом */}
            {['all', 'ACTIVE', 'SCHEDULED', 'COMPLETED'].map((status) => (
              <Button
                key={status}
                onClick={() => setFilters({ ...filters, status })}
                variant={filters.status === status ? 'default' : 'outline'}
                size="sm"
                className={`h-9 px-3 flex-shrink-0 ${
                  filters.status === status
                    ? 'bg-[#2196F3] text-white'
                    : darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {status === 'all'
                  ? 'Усі'
                  : status === 'ACTIVE'
                    ? 'Активні'
                    : status === 'SCHEDULED'
                      ? 'Заплановані'
                      : 'Завершені'}
              </Button>
            ))}

            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-auto flex-shrink-0`}>
              {sortedMedications.length} ліків
            </div>
          </div>
        </div>
      </div>

      {/* Список ліків */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {sortedMedications.length === 0 ? (
          searchQuery || filterFrequency !== 'all' ? (
            // Порожній стан після фільтрації
            <Card
              className={`p-8 sm:p-12 text-center ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <Pill className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" />
              <h3
                className={`text-lg sm:text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Ліків не знайдено
              </h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                Спробуйте змінити пошук або фільтри
              </p>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="h-11 sm:h-14 px-4 sm:px-6"
              >
                <X className="w-5 h-5 mr-2" />
                Очистити фільтри
              </Button>
            </Card>
          ) : (
            // Порожній стан (немає ліків)
            <EmptyState
              icon={Pill}
              title="Ліків ще немає"
              description="Додайте перші ліки, щоб почати відстеження."
              actionLabel="Додати ліки"
              onAction={onAddMedication}
              darkMode={darkMode}
            />
          )
        ) : (
          <div className="space-y-3">
            {sortedMedications.map((med, index) => {
              const status = calculateMedicationStatus(med);
              const colors = getStatusBadgeColor(status);
              const StatusIcon = status === 'SCHEDULED' ? CalendarClock : status === 'COMPLETED' ? CheckCheck : CheckCircle;
              
              return (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'
                    }`}
                    onClick={() => onSelectMedication(med)}
                  >
                    {/* Верхній ряд */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Іконка */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          med.photoUrl ? 'p-0' : 'bg-[#2196F3]/10'
                        }`}
                      >
                        {med.photoUrl ? (
                          <img
                            src={med.photoUrl}
                            alt={med.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <Pill className="w-6 h-6 text-[#2196F3]" />
                        )}
                      </div>

                      {/* Назва і дозування */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-base sm:text-lg font-bold truncate ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {med.name}
                        </h3>
                        <p className="text-sm sm:text-base text-[#2196F3] font-semibold">
                          {med.dosage}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <Badge
                        className={`${colors.bg} ${colors.text} border ${colors.border} flex items-center gap-1 flex-shrink-0 h-7`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span className="text-xs">{getStatusLabel(status)}</span>
                      </Badge>
                    </div>

                    {/* Times Row - Compact Horizontal */}
                    {med.times && med.times.length > 0 && (
                      <div className="flex items-center gap-3 mb-3 overflow-x-auto pb-1">
                        {med.times.slice(0, 4).map((time, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded-lg ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                          >
                            <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            <span className={`font-medium text-sm ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>{time}</span>
                          </div>
                        ))}
                        {med.times.length > 4 && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            +{med.times.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bottom Row - Meal Timing & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      {/* Meal Timing */}
                      {med.mealTiming && (
                        <span className={`text-xs sm:text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {med.mealTiming === 'before' && '🔴 Before meal'}
                          {med.mealTiming === 'with' && '🟡 With meal'}
                          {med.mealTiming === 'after' && '🟢 After meal'}
                          {med.mealTiming === 'anytime' && '⚪ Anytime'}
                        </span>
                      )}

                      {/* Actions Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickActionsId(med.id);
                          if ('vibrate' in navigator) navigator.vibrate(30);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all touch-manipulation ml-auto ${
                          darkMode
                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                        }`}
                        style={{ minHeight: '40px' }}
                        aria-label="Дії"
                      >
                        <MoreVertical className="w-5 h-5" />
                        <span className="text-sm font-medium">Дії</span>
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions Modal */}
      {quickActionsId !== null && (
        <MedicationQuickActions
          medicationId={quickActionsId}
          medication={sortedMedications.find(m => m.id === quickActionsId)}
          darkMode={darkMode}
          onClose={() => setQuickActionsId(null)}
          onMarkTaken={() => {
            toast.info('Mark as taken is only available in Today\'s schedule', {
              duration: 2000
            });
            setQuickActionsId(null);
          }}
          onEdit={() => {
            if (onEditMedication) {
              onEditMedication(quickActionsId);
            }
            setQuickActionsId(null);
          }}
          onDelete={() => {
            if (onDeleteMedication) {
              onDeleteMedication(quickActionsId);
            }
            setQuickActionsId(null);
          }}
          onDuplicate={(id) => {
            toast.info('Duplicate medication feature coming soon', {
              duration: 2000
            });
            setQuickActionsId(null);
          }}
          onPrint={(id) => {
            if (onPrintMedication) {
              onPrintMedication(id);
            }
            setQuickActionsId(null);
          }}
          onViewDetails={(id) => {
            const med = sortedMedications.find(m => m.id === id);
            if (med) {
              onSelectMedication(med);
            }
            setQuickActionsId(null);
          }}
        />
      )}

      {/* Batch Operations Modal */}
      {batchMode && (
        <BatchOperations
          selectedMedications={sortedMedications.filter(m => selectedIds.includes(m.id))}
          darkMode={darkMode}
          onClose={() => {
            setBatchMode(false);
            setSelectedIds([]);
          }}
          onMarkAllTaken={() => {
            toast.info('Mark as taken is only available in Today\'s schedule', {
              duration: 2000
            });
          }}
          onDeleteSelected={() => {
            if (onDeleteMedication) {
              selectedIds.forEach(id => onDeleteMedication(id));
              toast.success(`${selectedIds.length} medications deleted`, {
                duration: 2000
              });
            }
            setBatchMode(false);
            setSelectedIds([]);
          }}
          onExportSelected={() => {
            toast.info('Export feature coming soon', {
              duration: 2000
            });
          }}
          onPrintSelected={() => {
            toast.info('Batch print feature coming soon', {
              duration: 2000
            });
          }}
        />
      )}

      {/* Інвентар Медикаментів Сканер (Фото) */}
      {showInventoryScanner && (
        <MedicationInventoryScanner
          darkMode={darkMode}
          currentMedications={medications.map(med => ({
            id: med.id.toString(),
            name: med.name,
            dosage: med.dosage,
            times: med.times,
            frequency: med.frequency,
            startDate: med.startDate ? new Date(med.startDate) : undefined,
            endDate: med.endDate ? new Date(med.endDate) : undefined,
          }))}
          onInventoryUpdate={(inventory) => {
            console.log('📦 Оновлено інвентар:', inventory);
            localStorage.setItem('medicationInventory', JSON.stringify(inventory));

            inventory.forEach(item => {
              if (item.quantity <= 10) {
                toast.warning(`Низький залишок: ${item.medicationName}`, {
                  description: `Залишилось лише ${item.quantity} од. Час поповнити запас!`,
                  duration: 5000,
                });
              }
            });
          }}
          onClose={() => setShowInventoryScanner(false)}
        />
      )}

      {/* Інвентар Медикаментів Сканер (Відео) */}
      {showVideoScanner && (
        <MedicationVideoScanner
          darkMode={darkMode}
          currentMedications={medications.map(med => ({
            id: med.id.toString(),
            name: med.name,
            dosage: med.dosage,
            times: med.times,
            frequency: med.frequency,
          }))}
          onInventoryUpdate={(inventory) => {
            console.log('🎥 Оновлено інвентар (відео):', inventory);
            localStorage.setItem('medicationInventory', JSON.stringify(inventory));

            inventory.forEach(item => {
              if (item.quantity <= 10) {
                toast.warning(`Низький залишок: ${item.medicationName}`, {
                  description: `Залишилось лише ${item.quantity} од.`,
                  duration: 5000,
                });
              }
            });
          }}
          onClose={() => setShowVideoScanner(false)}
        />
      )}
    </div>
  );
}
