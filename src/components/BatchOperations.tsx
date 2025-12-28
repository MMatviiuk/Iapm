import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckSquare, Square, Trash2, Printer, Download, CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface BatchOperationsProps {
  medications: any[];
  darkMode: boolean;
  onDelete: (ids: number[]) => void;
  onPrint: (ids: number[]) => void;
  onMarkAllTaken?: (ids: number[]) => void;
  onExport?: (ids: number[]) => void;
}

export default function BatchOperations({
  medications,
  darkMode,
  onDelete,
  onPrint,
  onMarkAllTaken,
  onExport
}: BatchOperationsProps) {
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(medications.map(m => m.id));
    toast.info(`Selected ${medications.length} medications`);
  };

  const deselectAll = () => {
    setSelectedIds([]);
    toast.info('Selection cleared');
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast.error('No medications selected');
      return;
    }

    const count = selectedIds.length;
    if (confirm(`Are you sure you want to delete ${count} medication${count > 1 ? 's' : ''}?\n\nThis action cannot be undone.`)) {
      onDelete(selectedIds);
      setSelectedIds([]);
      setIsSelectionMode(false);
      toast.success(`${count} medication${count > 1 ? 's' : ''} deleted`);
      if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
    }
  };

  const handleBatchPrint = () => {
    if (selectedIds.length === 0) {
      toast.error('No medications selected');
      return;
    }

    onPrint(selectedIds);
    toast.success('Print preview loaded', {
      description: `${selectedIds.length} medication${selectedIds.length > 1 ? 's' : ''} selected`
    });
  };

  const handleBatchMarkTaken = () => {
    if (selectedIds.length === 0) {
      toast.error('No medications selected');
      return;
    }

    if (onMarkAllTaken) {
      onMarkAllTaken(selectedIds);
      setSelectedIds([]);
      setIsSelectionMode(false);
      toast.success(`${selectedIds.length} medication${selectedIds.length > 1 ? 's' : ''} marked as taken`);
      if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
    }
  };

  const handleBatchExport = () => {
    if (selectedIds.length === 0) {
      toast.error('No medications selected');
      return;
    }

    if (onExport) {
      onExport(selectedIds);
      toast.success('Medications exported', {
        description: `${selectedIds.length} medication${selectedIds.length > 1 ? 's' : ''} exported successfully`
      });
    }
  };

  if (!isSelectionMode) {
    return (
      <Button
        onClick={() => {
          setIsSelectionMode(true);
          toast.info('Selection mode enabled', {
            description: 'Tap medications to select them'
          });
        }}
        variant="outline"
        className={`h-12 px-4 gap-2 border-2 ${
          darkMode 
            ? 'border-slate-700 hover:bg-slate-800' 
            : 'border-slate-200 hover:bg-slate-50'
        }`}
      >
        <CheckSquare className="w-5 h-5" strokeWidth={2} />
        <span>Select</span>
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-16 left-0 right-0 z-30 px-3 py-3 shadow-lg border-b-2 ${
        darkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          {/* Selection info */}
          <div className="flex items-center gap-3">
            <Button
              onClick={deselectAll}
              variant="ghost"
              size="sm"
              className={`h-10 px-3 ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </Button>
            <span className={`font-medium ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {selectedIds.length} selected
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {selectedIds.length < medications.length && (
              <Button
                onClick={selectAll}
                variant="ghost"
                size="sm"
                className={`h-10 px-3 gap-2 shrink-0 ${
                  darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                }`}
              >
                <CheckSquare className="w-4 h-4" strokeWidth={2} />
                <span className="hidden sm:inline">All</span>
              </Button>
            )}

            {onMarkAllTaken && selectedIds.length > 0 && (
              <Button
                onClick={handleBatchMarkTaken}
                variant="ghost"
                size="sm"
                className={`h-10 px-3 gap-2 shrink-0 ${
                  darkMode 
                    ? 'hover:bg-green-950/30 text-green-400' 
                    : 'hover:bg-green-50 text-green-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                <span className="hidden sm:inline">Mark</span>
              </Button>
            )}

            {selectedIds.length > 0 && (
              <>
                <Button
                  onClick={handleBatchPrint}
                  variant="ghost"
                  size="sm"
                  className={`h-10 px-3 gap-2 shrink-0 ${
                    darkMode 
                      ? 'hover:bg-blue-950/30 text-blue-400' 
                      : 'hover:bg-blue-50 text-blue-700'
                  }`}
                >
                  <Printer className="w-4 h-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Print</span>
                </Button>

                {onExport && (
                  <Button
                    onClick={handleBatchExport}
                    variant="ghost"
                    size="sm"
                    className={`h-10 px-3 gap-2 shrink-0 ${
                      darkMode 
                        ? 'hover:bg-purple-950/30 text-purple-400' 
                        : 'hover:bg-purple-50 text-purple-700'
                    }`}
                  >
                    <Download className="w-4 h-4" strokeWidth={2} />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                )}

                <Button
                  onClick={handleBatchDelete}
                  variant="ghost"
                  size="sm"
                  className={`h-10 px-3 gap-2 shrink-0 ${
                    darkMode 
                      ? 'hover:bg-red-950/30 text-red-400' 
                      : 'hover:bg-red-50 text-red-700'
                  }`}
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </>
            )}

            <Button
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedIds([]);
                toast.info('Selection mode disabled');
              }}
              variant="outline"
              size="sm"
              className="h-10 px-3 shrink-0"
            >
              Done
            </Button>
          </div>
        </div>
      </div>

      {/* Selection checkboxes rendering helper */}
      <div className="hidden">
        {medications.map(med => (
          <div key={med.id} data-med-id={med.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(med.id)}
              onChange={() => toggleSelection(med.id)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
