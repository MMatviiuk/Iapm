import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  Pill,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { getAvatarUrl } from '../utils/avatarUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface Dependent {
  id: number;
  name: string;
  relationship: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address?: string;
  photoUrl?: string;
  medicationCount?: number;
  adherenceRate?: number;
}

interface DependentDetailsProps {
  dependent: Dependent;
  onBack: () => void;
  onEdit: (dep: Dependent) => void;
  onDelete: (id: number) => void;
  onViewMedications: (dep: Dependent) => void;
  onAddMedication?: (dep: Dependent) => void; // CRITICAL FIX: Allow caregiver to add meds
  darkMode: boolean;
}

export default function DependentDetails({
  dependent,
  onBack,
  onEdit,
  onDelete,
  onViewMedications,
  onAddMedication,
  darkMode,
}: DependentDetailsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleDelete = () => {
    if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
    onDelete(dependent.id);
    setShowDeleteDialog(false);
    onBack();
    toast.success(`${dependent.name} removed from your dependents`);
  };

  const adherenceRate = dependent.adherenceRate || 0;
  const medicationCount = dependent.medicationCount || 0;

  return (
    <div
      className={`min-h-screen pb-24 lg:pb-8 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } px-2 sm:px-6 lg:px-8 py-3 sm:py-6`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              className="h-12 sm:h-14 w-12 sm:w-auto px-0 sm:px-6 touch-manipulation shrink-0 rounded-xl"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline sm:ml-2">Back</span>
            </Button>

            <div className="flex gap-2 sm:gap-2 shrink-0">
              <Button
                onClick={() => onEdit(dependent)}
                className="h-12 sm:h-14 w-12 sm:w-auto px-0 sm:px-6 bg-orange-500 hover:bg-orange-600 text-white touch-manipulation rounded-xl"
                title="Edit"
              >
                <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline sm:ml-2">Edit</span>
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="h-12 sm:h-14 w-12 sm:w-auto px-0 sm:px-4 touch-manipulation rounded-xl"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline sm:ml-2">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-orange-500">
                  {dependent.photoUrl ? (
                    <img
                      src={dependent.photoUrl}
                      alt={dependent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={getAvatarUrl({ name: dependent.name })}
                      alt={dependent.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {dependent.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 text-base px-3 py-1">
                    {dependent.relationship}
                  </Badge>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {calculateAge(dependent.dateOfBirth)} yrs
                  </Badge>
                  {dependent.gender && (
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {dependent.gender === 'male' || dependent.gender === 'Male' ? '♂ Male' : '♀ Female'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">
                    Born{' '}
                    {new Date(dependent.dateOfBirth).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Medication Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-xl font-bold flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Pill className="w-6 h-6 mr-2 text-orange-500" />
                Medications
              </h2>
              <div className="flex gap-3">
                {/* CRITICAL FIX: Add Medication Button for Caregivers */}
                {onAddMedication && (
                  <Button
                    onClick={() => onAddMedication(dependent)}
                    className="h-12 sm:h-14 px-4 sm:px-6 bg-green-600 hover:bg-green-700 text-white touch-manipulation"
                  >
                    <Pill className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    Add Medication
                  </Button>
                )}
                <Button
                  onClick={() => onViewMedications(dependent)}
                  className="h-12 sm:h-14 px-4 sm:px-6 bg-orange-500 hover:bg-orange-600 text-white touch-manipulation"
                >
                  View All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <p className="text-4xl font-bold text-orange-600">
                  {medicationCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Active Medications
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-4xl font-bold text-green-600">
                  {adherenceRate}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Adherence Rate
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Overall Progress
                </span>
                <span className="text-sm font-bold text-orange-600">
                  {adherenceRate}%
                </span>
              </div>
              <Progress value={adherenceRate} className="h-3" />
            </div>
          </Card>
        </motion.div>

        {/* Contact Information */}
        {(dependent.email || dependent.phone || dependent.address) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2
                className={`text-xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Contact Information
              </h2>
              <div className="space-y-4">
                {dependent.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a
                        href={`mailto:${dependent.email}`}
                        className={`text-lg hover:text-orange-600 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {dependent.email}
                      </a>
                    </div>
                  </div>
                )}
                {dependent.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <a
                        href={`tel:${dependent.phone}`}
                        className={`text-lg hover:text-orange-600 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {dependent.phone}
                      </a>
                    </div>
                  </div>
                )}
                {dependent.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p
                        className={`text-lg ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {dependent.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2
              className={`text-xl font-bold mb-4 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <TrendingUp className="w-6 h-6 mr-2 text-orange-500" />
              Recent Activity
            </h2>
            <p className="text-gray-500 text-center py-8">
              Activity tracking coming soon
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Remove Dependent?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              Are you sure you want to remove {dependent.name} from your
              dependents? This will not delete their medication data, but you will
              no longer have access to manage their medications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-12 text-lg bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
