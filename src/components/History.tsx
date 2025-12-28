import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X, ClipboardList, Plus, Download, FileText, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';
import EmptyState from './EmptyState';
import { 
  updateMedicationStatuses, 
  shouldShowInHistory 
} from '../utils/medicationStatusManager';

interface HistoryProps {
  darkMode: boolean;
  setCurrentPage?: (page: string) => void;
  userRole?: string;
  medications?: any[];
}

export default function History({ darkMode, setCurrentPage, userRole, medications = [] }: HistoryProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filterMedication, setFilterMedication] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'taken' | 'missed'>('all');

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  // Export to CSV function
  const exportToCSV = () => {
    const history = generateMockHistory();
    
    // CSV Header
    let csv = 'Date,Medication,Time,Dosage,Status\n';
    
    // CSV Rows
    history.forEach(day => {
      day.medications.forEach(med => {
        const status = med.taken ? 'Taken' : 'Missed';
        csv += `"${day.date}","${med.name}","${med.time}","${med.dosage}","${status}"\n`;
      });
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `medication_history_${selectedMonth.toISOString().slice(0, 7)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('History exported to CSV', {
      description: `Downloaded medication history for ${monthName}`,
      duration: 3000,
    });
  };

  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const generateMockHistory = () => {
    const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    const history = [];
    
    // Update medication statuses and filter for history (ACTIVE + COMPLETED only)
    const medicationsWithStatus = updateMedicationStatuses(medications);
    let historyMedications = medicationsWithStatus.filter(shouldShowInHistory);
    
    // Apply medication filter
    if (filterMedication !== 'all') {
      historyMedications = historyMedications.filter(m => m.name === filterMedication);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
      if (date <= new Date()) {
        let medHistory = historyMedications.map(med => ({
          ...med,
          taken: Math.random() > 0.2
        }));
        
        // Apply status filter
        if (filterStatus !== 'all') {
          medHistory = medHistory.filter(m => filterStatus === 'taken' ? m.taken : !m.taken);
        }
        
        medHistory = medHistory.sort((a, b) => {
          // First sort by time
          const timeA = a.time || '00:00';
          const timeB = b.time || '00:00';
          if (timeA !== timeB) {
            return timeA.localeCompare(timeB);
          }
          // Then sort alphabetically by name
          return a.name.localeCompare(b.name);
        });
        
        history.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          medications: medHistory
        });
      }
    }
    
    return history.reverse();
  };

  const history = generateMockHistory();

  const stats = {
    totalDoses: history.reduce((sum, day) => sum + day.medications.length, 0),
    takenDoses: history.reduce((sum, day) => sum + day.medications.filter(m => m.taken).length, 0),
  };

  const adherenceRate = stats.totalDoses > 0 
    ? Math.round((stats.takenDoses / stats.totalDoses) * 100) 
    : 0;

  // Check if there are no medications at all
  const hasNoMedications = medications.length === 0;

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
      <div className={`shadow-sm sticky top-0 z-10 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className={`text-2xl sm:text-3xl lg:text-5xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Intake History
          </h1>
          
          {!hasNoMedications && (
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="h-12 sm:h-14 px-4 sm:px-6 gap-2 border-2"
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          )}
        </div>
      </div>

      {hasNoMedications ? (
        // Empty State
        <div className="px-3 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl mx-auto">
          <EmptyState
            icon={ClipboardList}
            title="No Medication History Yet"
            description="Start tracking your medications to see your adherence history, patterns, and statistics over time."
            actionLabel="Add Your First Medication"
            onAction={setCurrentPage ? () => setCurrentPage('add') : undefined}
            helpText="What is adherence tracking?"
            onHelp={() => {
              // Future: Show help modal or tooltip explaining adherence
              console.log('Help clicked - adherence tracking explanation');
            }}
            darkMode={darkMode}
          />
        </div>
      ) : (
        <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 max-w-4xl mx-auto space-y-3 sm:space-y-4">
        <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Monthly Statistics
          </h2>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            <div className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-2xl sm:text-3xl lg:text-4xl mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {adherenceRate}%
              </div>
              <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Adherence
              </div>
            </div>
            
            <div className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-2xl sm:text-3xl lg:text-4xl mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.takenDoses}
              </div>
              <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Taken
              </div>
            </div>
            
            <div className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-2xl sm:text-3xl lg:text-4xl mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalDoses - stats.takenDoses}
              </div>
              <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Missed
              </div>
            </div>
          </div>

          <div className={`mt-3 sm:mt-4 lg:mt-5 h-2 sm:h-3 lg:h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-[#2196F3] transition-all duration-500"
              style={{ width: `${adherenceRate}%` }}
            />
          </div>
        </div>

        <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
            <button
              onClick={() => changeMonth('prev')}
              className={`p-3 rounded-lg transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center ${
                darkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'
              }`}
              aria-label="Previous month"
            >
              <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
            
            <h3 className={`text-lg sm:text-xl lg:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {monthName}
            </h3>
            
            <button
              onClick={() => changeMonth('next')}
              disabled={selectedMonth.getMonth() === new Date().getMonth()}
              className={`p-3 rounded-lg transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center ${
                selectedMonth.getMonth() === new Date().getMonth()
                  ? 'opacity-50 cursor-not-allowed'
                  : darkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'
              }`}
              aria-label="Next month"
            >
              <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status:
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setFilterStatus('all')}
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  className="h-10 px-3 text-sm"
                >
                  All
                </Button>
                <Button
                  onClick={() => setFilterStatus('taken')}
                  variant={filterStatus === 'taken' ? 'default' : 'outline'}
                  className="h-10 px-3 text-sm bg-green-600 hover:bg-green-700"
                >
                  Taken
                </Button>
                <Button
                  onClick={() => setFilterStatus('missed')}
                  variant={filterStatus === 'missed' ? 'default' : 'outline'}
                  className="h-10 px-3 text-sm bg-red-600 hover:bg-red-700"
                >
                  Missed
                </Button>
              </div>
            </div>

            {medications.length > 1 && (
              <div className="flex items-center gap-2">
                <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Medication:
                </label>
                <select
                  value={filterMedication}
                  onChange={(e) => setFilterMedication(e.target.value)}
                  className={`h-10 px-3 text-sm rounded-md border-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All Medications</option>
                  {medications.map(med => (
                    <option key={med.id} value={med.name}>
                      {med.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3 max-h-96 sm:max-h-[500px] overflow-y-auto">
            <AnimatePresence>
              {history.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                >
                  <div className={`text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {day.date}
                  </div>
                  <div className="space-y-2 sm:space-y-2.5">
                    {day.medications.map((med, medIndex) => (
                      <div
                        key={medIndex}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                            med.taken 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`}>
                            {med.taken ? (
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                            ) : (
                              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                            )}
                          </div>
                          <span className={`font-bold text-base sm:text-lg lg:text-xl truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {med.name}
                          </span>
                        </div>
                        <span className={`text-sm sm:text-base lg:text-lg flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {med.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}