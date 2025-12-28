import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Users, 
  Bell, 
  Shield,
  Eye,
  Calendar,
  Check,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  UserPlus,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { PillShieldLogo } from './PillShieldLogo';

interface OnboardingCaregiverEnhancedProps {
  onComplete: () => void;
  darkMode?: boolean;
}

const TOTAL_STEPS = 4;

export default function OnboardingCaregiverEnhanced({ 
  onComplete,
  darkMode = false 
}: OnboardingCaregiverEnhancedProps) {
  
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      
      if ('vibrate' in navigator) {
        navigator.vibrate(30);
      }
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 ${
      darkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-orange-50 via-white to-slate-50'
    }`}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <PillShieldLogo size={80} color="#FB923C" />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
            </div>
          </div>
          <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Caregiver Mode
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Support your loved ones with medication management
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
            >
              Skip Tour
            </button>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Content Card */}
        <div className={`rounded-3xl border-2 p-8 lg:p-12 shadow-2xl ${
          darkMode 
            ? 'bg-slate-900 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950/30 mb-6">
                  <Heart className="w-10 h-10 text-orange-600 dark:text-orange-400" fill="currentColor" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Care for Those Who Matter Most
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Manage medications for multiple family members from one central dashboard.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Multiple Dependents
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Manage medications for parents, spouse, children, and more
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Real-Time Monitoring
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      See when medications are taken or missed instantly
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Mark as Taken
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Update medication status for your dependents
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Organize Schedules
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Create and manage complex medication routines
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Add Dependents */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-950/30 mb-6">
                  <UserPlus className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Adding Dependents is Easy
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Follow these simple steps to start managing medications for your loved ones.
                </p>

                <div className="max-w-2xl mx-auto space-y-4">
                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                      1
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Click "Add Dependent"
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Start from your Dependents dashboard
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                      2
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Enter Their Information
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Name, date of birth, relationship, and optional photo
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                      3
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Add Their Medications
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Create schedules and set up reminders
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Stay Informed */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 mb-6">
                  <Activity className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Track Adherence and Progress
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  View comprehensive analytics for all your dependents.
                </p>

                <div className="max-w-2xl mx-auto space-y-4">
                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Adherence Statistics
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        See overall and individual medication compliance rates
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Missed Dose Alerts
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Get notified when someone misses their medication
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Weekly Summaries
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Review medication history and patterns over time
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Ready to Start */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950/30 mb-6">
                  <Check className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Ready to Start Caring!
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  You have everything you need to support your loved ones' health.
                </p>

                <div className={`max-w-xl mx-auto p-8 rounded-3xl border-2 mb-8 ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
                }`}>
                  <Shield className="w-16 h-16 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Privacy and Security
                  </h3>
                  <p className={`text-base ${
                    darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    All dependent data is encrypted and secure. Only you have access to their medication information. We comply with GDPR and HIPAA regulations.
                  </p>
                </div>

                <div className={`max-w-xl mx-auto text-left space-y-3 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base">Add your first dependent from the dashboard</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base">Set up medications and schedules for each person</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base">Check the Analytics page for adherence insights</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="h-14 px-6 border-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            {[...Array(TOTAL_STEPS)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index + 1 === currentStep
                    ? 'bg-orange-600 w-6'
                    : index + 1 < currentStep
                    ? 'bg-orange-600'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={handleNext}
            className="h-14 px-6 bg-orange-600 hover:bg-orange-700 group"
          >
            {currentStep === TOTAL_STEPS ? 'Get Started' : 'Next'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
