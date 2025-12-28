import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  Clock, 
  History, 
  Calendar,
  Bell,
  Award,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Heart,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { PillShieldLogo } from './PillShieldLogo';

interface OnboardingEnhancedProps {
  onComplete: () => void;
  darkMode?: boolean;
}

const TOTAL_STEPS = 5;

export default function OnboardingEnhanced({ 
  onComplete,
  darkMode = false 
}: OnboardingEnhancedProps) {
  
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      
      // Haptic feedback
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
      darkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-white to-slate-50'
    }`}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <PillShieldLogo size={80} color="#2196F3" />
          </div>
          <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Welcome to Prescription Clarity
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Your personal medication management assistant
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
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-950/30 mb-6">
                  <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Everything You Need in One Place
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Manage all your medications, stay on track, and monitor your health journey with confidence.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center mx-auto mb-4">
                      <Pill className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Organize Medications
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Keep all your prescriptions in one secure place
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Stay on Track
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Get timely reminders for every medication
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                      <History className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Track Your Progress
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      View complete medication history and adherence
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center mx-auto mb-4">
                      <Award className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Earn Achievements
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Stay motivated with our reward system
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Schedule */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 mb-6">
                  <Calendar className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Smart Scheduling
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Create medication schedules that fit perfectly into your daily routine.
                </p>

                <div className="max-w-2xl mx-auto space-y-4">
                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Flexible Timing
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Choose specific times or link to meals (before, with, or after)
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Multiple Frequencies
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Daily, twice daily, weekly, or custom schedules
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Duration Tracking
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Set duration in days, weeks, months, or lifetime
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Notifications */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950/30 mb-6">
                  <Bell className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Stay on Track with Reminders
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Customizable notifications help you stay on track.
                </p>

                <div className="max-w-md mx-auto">
                  <div className={`p-8 rounded-3xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200'
                  }`}>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                          <span className={`text-base font-medium ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            Medication Reminders
                          </span>
                        </div>
                        <div className="w-12 h-6 rounded-full bg-blue-600 flex items-center justify-end px-1">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          <span className={`text-base font-medium ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            Advance Notices
                          </span>
                        </div>
                        <div className="w-12 h-6 rounded-full bg-blue-600 flex items-center justify-end px-1">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                          <span className={`text-base font-medium ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            Daily Summary
                          </span>
                        </div>
                        <div className="w-12 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center px-1">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>

                    <p className={`text-sm mt-6 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      You can customize notification settings anytime in Settings
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Achievements */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-950/30 mb-6">
                  <Award className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Earn Achievements
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Stay motivated by earning medals for your adherence milestones.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
                  }`}>
                    <div className="text-6xl mb-3">🥉</div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Bronze
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      7 days perfect adherence
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300'
                  }`}>
                    <div className="text-6xl mb-3">🥈</div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Silver
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      30 days perfect adherence
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300'
                  }`}>
                    <div className="text-6xl mb-3">🥇</div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Gold
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      90 days perfect adherence
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Ready to Start */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 mb-6">
                  <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  You're All Set!
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Everything is ready for you to start managing your medications with confidence.
                </p>

                <div className={`max-w-xl mx-auto p-8 rounded-3xl border-2 mb-8 ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                }`}>
                  <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Your Health Data is Secure
                  </h3>
                  <p className={`text-base ${
                    darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    We follow GDPR and HIPAA standards to keep your medication information safe and private. Your data is encrypted and never shared without your permission.
                  </p>
                </div>

                <div className={`max-w-xl mx-auto text-left space-y-3 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base">Add your first medication from the Dashboard</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base">Customize notification preferences in Settings</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base">View your progress in the Achievements section</span>
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
                    ? 'bg-blue-600 w-6'
                    : index + 1 < currentStep
                    ? 'bg-blue-600'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={handleNext}
            className="h-14 px-6 bg-blue-600 hover:bg-blue-700 group"
          >
            {currentStep === TOTAL_STEPS ? 'Get Started' : 'Next'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
