import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Users, 
  FileText, 
  TrendingUp,
  Shield,
  Bell,
  Check,
  ArrowRight,
  ArrowLeft,
  Mail,
  BarChart3,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { PillShieldLogo } from './PillShieldLogo';

interface OnboardingDoctorEnhancedProps {
  onComplete: () => void;
  darkMode?: boolean;
}

const TOTAL_STEPS = 4;

export default function OnboardingDoctorEnhanced({ 
  onComplete,
  darkMode = false 
}: OnboardingDoctorEnhancedProps) {
  
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
      darkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-purple-50 via-white to-slate-50'
    }`}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <PillShieldLogo size={80} color="#9333EA" />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Healthcare Professional Mode
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Comprehensive patient medication management platform
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
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
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
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-950/30 mb-6">
                  <Stethoscope className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Professional Patient Care Management
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Monitor and manage medication adherence across your entire patient base.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Manage All Patients
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      View complete medication schedules for every patient
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Prescription Management
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Track prescriptions and refill schedules
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Adherence Analytics
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Monitor compliance rates and identify at-risk patients
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Real-Time Monitoring
                    </h3>
                    <p className={`text-base ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Track patient medication intake in real-time
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Patient Invitations */}
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
                  <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Invite Patients via Email
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Securely connect with your patients through our invitation system.
                </p>

                <div className="max-w-2xl mx-auto space-y-4">
                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                      1
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Send Email Invitation
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Enter patient email and they'll receive a secure invite
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                      2
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Patient Creates Account
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        They sign up and accept your invitation
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
                        Access Patient Data
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        View their medications and adherence in real-time
                      </p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border ${
                    darkMode ? 'bg-blue-950/30 border-blue-800' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <p className={`text-sm ${
                      darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      <strong>Note:</strong> Patients must consent to share their data. All connections are HIPAA compliant and encrypted.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Analytics Dashboard */}
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
                  <BarChart3 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Powerful Clinical Analytics
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Make data-driven decisions with comprehensive insights.
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
                        Cohort Adherence Rates
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Track overall patient compliance across your practice
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        At-Risk Patient Alerts
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Identify patients with low adherence for intervention
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Medication Reports
                      </h3>
                      <p className={`text-base ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Generate detailed prescription and adherence reports
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
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-950/30 mb-6">
                  <Check className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Ready to Enhance Patient Care!
                </h2>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Your professional medication management platform is ready to use.
                </p>

                <div className={`max-w-xl mx-auto p-8 rounded-3xl border-2 mb-8 ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
                }`}>
                  <Shield className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    HIPAA Compliant Platform
                  </h3>
                  <p className={`text-base ${
                    darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    All patient data is fully encrypted and HIPAA compliant. Access is logged and auditable. Patient consent is required for all data sharing.
                  </p>
                </div>

                <div className={`max-w-xl mx-auto text-left space-y-3 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base">Invite your first patient from the Patients page</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base">Access the Medication Database for medication reference</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base">Monitor analytics for population health insights</span>
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
                    ? 'bg-purple-600 w-6'
                    : index + 1 < currentStep
                    ? 'bg-purple-600'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={handleNext}
            className="h-14 px-6 bg-purple-600 hover:bg-purple-700 group"
          >
            {currentStep === TOTAL_STEPS ? 'Get Started' : 'Next'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
