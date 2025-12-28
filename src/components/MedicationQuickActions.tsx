import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Trash2, Printer, Info, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface MedicationQuickActionsProps {
  medicationId: number;
  medicationName: string;
  darkMode: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onPrint: (id: number) => void;
  onViewDetails: (id: number) => void;
  onDuplicate?: (id: number) => void;
  onMarkTaken?: (id: number) => void;
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
}

export default function MedicationQuickActions({
  medicationId,
  medicationName,
  darkMode,
  onEdit,
  onDelete,
  onPrint,
  onViewDetails,
  onDuplicate,
  onMarkTaken,
  isOpen,
  onClose,
  position = 'right'
}: MedicationQuickActionsProps) {

  const handleAction = (action: () => void, actionName: string) => {
    action();
    onClose();
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20"
          />

          {/* Quick Actions Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`fixed z-50 ${
              position === 'right' ? 'right-4' : 'left-4'
            } top-1/2 -translate-y-1/2 w-72 sm:w-80 rounded-2xl shadow-2xl overflow-hidden ${
              darkMode 
                ? 'bg-slate-800 border-2 border-slate-700' 
                : 'bg-white border-2 border-slate-200'
            }`}
          >
            {/* Header */}
            <div className={`px-5 py-4 border-b-2 ${
              darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <h3 className={`font-bold truncate ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {medicationName}
              </h3>
              <p className={`text-sm mt-0.5 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Quick Actions
              </p>
            </div>

            {/* Actions */}
            <div className="p-2">
              {onMarkTaken && (
                <Button
                  onClick={() => handleAction(() => onMarkTaken(medicationId), 'Mark as Taken')}
                  variant="ghost"
                  className={`w-full h-14 justify-start gap-3 px-4 rounded-xl touch-manipulation ${
                    darkMode 
                      ? 'hover:bg-green-950/30 text-green-400' 
                      : 'hover:bg-green-50 text-green-700'
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
                  <span className="text-base">Mark as Taken</span>
                </Button>
              )}

              <Button
                onClick={() => handleAction(() => onEdit(medicationId), 'Edit')}
                variant="ghost"
                className={`w-full h-14 justify-start gap-3 px-4 rounded-xl touch-manipulation ${
                  darkMode 
                    ? 'hover:bg-blue-950/30 text-blue-400' 
                    : 'hover:bg-blue-50 text-blue-700'
                }`}
              >
                <Edit2 className="w-6 h-6" strokeWidth={2} />
                <span className="text-base">Edit Medication</span>
              </Button>

              <Button
                onClick={() => handleAction(() => onViewDetails(medicationId), 'View Details')}
                variant="ghost"
                className={`w-full h-14 justify-start gap-3 px-4 rounded-xl touch-manipulation ${
                  darkMode 
                    ? 'hover:bg-purple-950/30 text-purple-400' 
                    : 'hover:bg-purple-50 text-purple-700'
                }`}
              >
                <Info className="w-6 h-6" strokeWidth={2} />
                <span className="text-base">View Details</span>
              </Button>

              {onDuplicate && (
                <Button
                  onClick={() => handleAction(() => onDuplicate(medicationId), 'Duplicate')}
                  variant="ghost"
                  className={`w-full h-14 justify-start gap-3 px-4 rounded-xl touch-manipulation ${
                    darkMode 
                      ? 'hover:bg-indigo-950/30 text-indigo-400' 
                      : 'hover:bg-indigo-50 text-indigo-700'
                  }`}
                >
                  <Copy className="w-6 h-6" strokeWidth={2} />
                  <span className="text-base">Duplicate</span>
                </Button>
              )}

              <Button
                onClick={() => handleAction(() => onPrint(medicationId), 'Print')}
                variant="ghost"
                className={`w-full h-14 justify-start gap-3 px-4 rounded-xl touch-manipulation ${
                  darkMode 
                    ? 'hover:bg-cyan-950/30 text-cyan-400' 
                    : 'hover:bg-cyan-50 text-cyan-700'
                }`}
              >
                <Printer className="w-6 h-6" strokeWidth={2} />
                <span className="text-base">Print Schedule</span>
              </Button>

              <div className={`h-px my-2 ${
                darkMode ? 'bg-slate-700' : 'bg-slate-200'
              }`} />

              <Button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${medicationName}?\n\nThis action cannot be undone.`)) {
                    handleAction(() => onDelete(medicationId), 'Delete');
                  }
                }}
                variant="ghost"
                className={`w-full h-14 justify-start gap-3 px-4 rounded-xl touch-manipulation ${
                  darkMode 
                    ? 'hover:bg-red-950/30 text-red-400' 
                    : 'hover:bg-red-50 text-red-700'
                }`}
              >
                <Trash2 className="w-6 h-6" strokeWidth={2} />
                <span className="text-base">Delete Medication</span>
              </Button>
            </div>

            {/* Close button */}
            <div className={`px-3 py-3 border-t-2 ${
              darkMode ? 'border-slate-700 bg-slate-900/30' : 'border-slate-200 bg-slate-50'
            }`}>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full h-12 rounded-xl"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
