import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Pill,
  Clock,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  times: string[];
  frequency?: string;
  duration?: string;
  mealTiming?: string;
  color?: string;
  notes?: string;
  sideEffects?: string;
  photoUrl?: string;
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
  refills?: number;
}

interface TakeHistory {
  date: string;
  time: string;
  taken: boolean;
}

interface MedicationDetailsProps {
  medication: Medication;
  onBack: () => void;
  onEdit: (med: Medication) => void;
  onDelete: (id: number) => void;
  darkMode: boolean;
}

export default function MedicationDetails({
  medication,
  onBack,
  onEdit,
  onDelete,
  darkMode,
}: MedicationDetailsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock history data - in real app, this would come from backend
  const mockHistory: TakeHistory[] = [
    { date: '2025-11-04', time: '08:00', taken: true },
    { date: '2025-11-04', time: '20:00', taken: true },
    { date: '2025-11-03', time: '08:00', taken: true },
    { date: '2025-11-03', time: '20:00', taken: false },
    { date: '2025-11-02', time: '08:00', taken: true },
    { date: '2025-11-02', time: '20:00', taken: true },
    { date: '2025-11-01', time: '08:00', taken: true },
    { date: '2025-11-01', time: '20:00', taken: true },
  ];

  const adherenceRate = Math.round(
    (mockHistory.filter((h) => h.taken).length / mockHistory.length) * 100
  );

  const handleDelete = () => {
    if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
    onDelete(medication.id);
    setShowDeleteDialog(false);
    onBack();
  };

  const handleEdit = () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    onEdit(medication);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`min-h-screen pb-24 lg:pb-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div
        className={`sticky top-0 z-10 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 sm:px-6 lg:px-8 py-4 sm:py-6`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              className="h-12 sm:h-14 px-4 sm:px-6 touch-manipulation"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Back
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                className="h-12 sm:h-14 px-4 sm:px-6 bg-[#2196F3] hover:bg-[#1976D2] text-white touch-manipulation"
              >
                <Edit className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="h-12 sm:h-14 px-4 sm:px-6 touch-manipulation"
              >
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Main Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start gap-4">
              {/* Medication Icon/Photo */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  medication.photoUrl ? 'p-0' : 'bg-[#2196F3]/10'
                }`}
              >
                {medication.photoUrl ? (
                  <img
                    src={medication.photoUrl}
                    alt={medication.name}
                    className="w-full h-full object-cover rounded-xl cursor-pointer"
                    onClick={() => setSelectedImage(medication.photoUrl)}
                  />
                ) : (
                  <Pill className="w-10 h-10 sm:w-12 sm:h-12 text-[#2196F3]" />
                )}
              </div>

              {/* Name and Dosage */}
              <div className="flex-1">
                <h1
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {medication.name}
                </h1>
                <p className="text-xl sm:text-2xl text-[#2196F3] font-semibold mb-3">
                  {medication.dosage}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-base px-3 py-1">
                    {adherenceRate}% Adherence
                  </Badge>
                  {medication.frequency && (
                    <Badge
                      variant="outline"
                      className="text-base px-3 py-1"
                    >
                      {medication.frequency}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2
              className={`text-xl font-bold mb-4 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <Clock className="w-6 h-6 mr-2 text-[#2196F3]" />
              Schedule
            </h2>
            <div className="space-y-3">
              {medication.times.map((time, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <p className="text-xl font-semibold text-[#2196F3]">{time}</p>
                  {medication.mealTiming && (
                    <p className="text-sm text-gray-500 mt-1">
                      {medication.mealTiming}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Duration & Dates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2
              className={`text-xl font-bold mb-4 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <Calendar className="w-6 h-6 mr-2 text-[#2196F3]" />
              Duration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Start Date</p>
                <p
                  className={`text-lg font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {formatDate(medication.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">End Date</p>
                <p
                  className={`text-lg font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {medication.duration === 'lifetime'
                    ? 'Ongoing'
                    : formatDate(medication.endDate)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Additional Info */}
        {(medication.notes || medication.sideEffects || medication.prescribedBy) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2
                className={`text-xl font-bold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                <AlertCircle className="w-6 h-6 mr-2 text-[#2196F3]" />
                Additional Information
              </h2>
              <div className="space-y-4">
                {medication.prescribedBy && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Prescribed By</p>
                    <p
                      className={`text-lg ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {medication.prescribedBy}
                    </p>
                  </div>
                )}
                {medication.notes && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p
                      className={`text-lg ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {medication.notes}
                    </p>
                  </div>
                )}
                {medication.sideEffects && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Side Effects</p>
                    <p
                      className={`text-lg ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {medication.sideEffects}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recent History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2
              className={`text-xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Recent History
            </h2>
            <div className="space-y-2">
              {mockHistory.slice(0, 7).map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {entry.taken ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <p
                        className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-500">{entry.time}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      entry.taken
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }
                  >
                    {entry.taken ? 'Taken' : 'Missed'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 h-12 text-lg"
              onClick={() => toast.info('Full history coming soon')}
            >
              View Full History
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Delete Medication?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              Are you sure you want to delete "{medication.name}"? This action cannot be
              undone and all history will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-12 text-lg bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Medication"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
