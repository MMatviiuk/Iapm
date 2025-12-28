import { AlertCircle, User, Users, Stethoscope } from 'lucide-react';
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

interface RoleSwitchConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentRole: 'myself' | 'caregiver' | 'doctor';
  newRole: 'myself' | 'caregiver' | 'doctor';
  darkMode?: boolean;
}

const roleConfig = {
  myself: {
    title: 'Patient',
    description: 'Managing my own medications',
    icon: User,
    color: 'blue'
  },
  caregiver: {
    title: 'Caregiver',
    description: 'Caring for family or friends',
    icon: Users,
    color: 'orange'
  },
  doctor: {
    title: 'Healthcare Professional',
    description: 'Managing patient prescriptions',
    icon: Stethoscope,
    color: 'purple'
  }
};

export default function RoleSwitchConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  currentRole,
  newRole,
  darkMode = false
}: RoleSwitchConfirmDialogProps) {
  const current = roleConfig[currentRole];
  const next = roleConfig[newRole];
  const NextIcon = next.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={`max-w-md ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-orange-950/50' : 'bg-orange-50'
            }`}>
              <AlertCircle className={`w-6 h-6 ${
                darkMode ? 'text-orange-400' : 'text-orange-600'
              }`} />
            </div>
            <AlertDialogTitle className={`text-xl ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Switch Account View?
            </AlertDialogTitle>
          </div>
          
          <AlertDialogDescription className={`text-base leading-relaxed ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            You are about to switch from {current.title} view to {next.title} view.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Content moved outside AlertDialogDescription to avoid nesting errors */}
        <div className="space-y-4 px-6">
          {/* New Role Preview */}
          <div className={`p-4 rounded-xl border-2 ${
            darkMode 
              ? `bg-${next.color}-950/20 border-${next.color}-800` 
              : `bg-${next.color}-50 border-${next.color}-200`
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                next.color === 'blue' ? 'bg-blue-600' :
                next.color === 'orange' ? 'bg-orange-600' :
                'bg-purple-600'
              }`}>
                <NextIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`font-bold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {next.title}
                </div>
                <div className={`text-sm ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {next.description}
                </div>
              </div>
            </div>
          </div>

          {/* Warning for elderly users */}
          <div className={`p-3 rounded-lg border ${
            darkMode 
              ? 'bg-yellow-950/30 border-yellow-800' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className={`text-sm leading-relaxed ${
              darkMode ? 'text-yellow-300' : 'text-yellow-800'
            }`}>
              <strong>⚠️ Note:</strong> This will change what you see in the app. 
              You can switch back anytime in Settings.
            </div>
          </div>
        </div>

        <AlertDialogFooter className="gap-3 sm:gap-3">
          <AlertDialogCancel 
            onClick={onClose}
            className="h-12 sm:h-14 text-base touch-manipulation"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`h-12 sm:h-14 text-base touch-manipulation ${
              next.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
              next.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
              'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            Switch to {next.title}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
