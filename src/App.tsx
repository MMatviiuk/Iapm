import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { getErrorMessage, formatErrorForToast, requiresReauth } from './utils/errorMessages';
import { getSuccessMessage, formatSuccessForToast, shouldShowUndo, getCelebrationLevel } from './utils/successMessages';
import ErrorBoundary from './components/ErrorBoundary';
import { log, setupGlobalErrorHandler } from './utils/logger';
import { updateMedicationStatuses } from './utils/medicationStatusManager';

// Pages - Public (Critical - No lazy loading)
import LandingPageRedesigned from './components/LandingPageRedesigned';
import LoginEnhanced from './components/LoginEnhanced';
import SignUpMultiStep from './components/SignUpMultiStep';
import ForgotPassword from './components/ForgotPassword';
import { OAuthCallback } from './components/OAuthCallback';
import DemoLogin from './components/DemoLogin';

// Pages - Public (Lazy loaded)
const EmailVerification = lazy(() => import('./components/EmailVerification'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const OnboardingEnhanced = lazy(() => import('./components/OnboardingEnhanced'));
const OnboardingCaregiverEnhanced = lazy(() => import('./components/OnboardingCaregiverEnhanced'));
const OnboardingDoctorEnhanced = lazy(() => import('./components/OnboardingDoctorEnhanced'));

// Pages - Authenticated (Critical - No lazy loading)
import DashboardDensityImproved from './components/DashboardDensityImproved';
import MainSchedule from './components/MainSchedule';
import AddPrescriptionEnhanced from './components/AddPrescriptionEnhanced';
import EditPrescriptionEnhanced from './components/EditPrescriptionEnhanced';
import CaregiverDashboardEnhanced from './components/CaregiverDashboardEnhanced';
import DoctorDashboardEnhanced from './components/DoctorDashboardEnhanced';
import TodayScheduleWeb from './components/TodayScheduleWeb';
import CaregiverDashboardWeb from './components/CaregiverDashboardWeb';
import DoctorDashboardWeb from './components/DoctorDashboardWeb';

// Pages - Authenticated (Lazy loaded)
const History = lazy(() => import('./components/History'));
const Rewards = lazy(() => import('./components/Rewards'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const PrintSchedule = lazy(() => import('./components/PrintSchedule'));
const Privacy = lazy(() => import('./components/Privacy'));
const Terms = lazy(() => import('./components/Terms'));
const Profile = lazy(() => import('./components/Profile'));
const MedicationReference = lazy(() => import('./components/MedicationReference').then(m => ({ default: m.MedicationReference })));
const CaregiverAnalytics = lazy(() => import('./components/CaregiverAnalytics'));
const DoctorAnalytics = lazy(() => import('./components/DoctorAnalytics'));
const WeekView = lazy(() => import('./components/WeekView'));
const MedicationDetails = lazy(() => import('./components/MedicationDetails'));
const MedicationsList = lazy(() => import('./components/MedicationsList'));
const NotificationsManager = lazy(() => import('./components/NotificationsManager'));
const DependentDetails = lazy(() => import('./components/DependentDetails'));
const PatientDetails = lazy(() => import('./components/PatientDetails'));
const AddDependent = lazy(() => import('./components/AddDependent'));
const EditDependent = lazy(() => import('./components/EditDependent'));
const AddPatient = lazy(() => import('./components/AddPatient'));
const ShareProfile = lazy(() => import('./components/ShareProfile'));
const SharedProfileView = lazy(() => import('./components/SharedProfileView'));
const HistoryDemo = lazy(() => import('./components/HistoryDemo'));
const DatabaseTest = lazy(() => import('./components/DatabaseTest'));

// Layout
import AppLayout from './components/Layout/AppLayout';
import AppLayoutCompact from './components/Layout/AppLayoutCompact';
import AppLayoutNormal from './components/Layout/AppLayoutNormal';
import DashboardWebPro from './components/DashboardWebPro';

// API Service
import api from './services/api';

// Loading Component for Lazy Loading
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 dark:text-slate-400 text-lg">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  // Check if user has authToken
  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  };

  // Load dark mode preference from localStorage
  const getInitialDarkMode = () => {
    const stored = localStorage.getItem('darkMode');
    return stored === 'true';
  };

  // State Management
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
  const [currentPage, setCurrentPage] = useState('landing');
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [userRole, setUserRole] = useState<'myself' | 'caregiver' | 'doctor'>('myself');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<number | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDependent, setSelectedDependent] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Today's Focus - for elderly users who prefer simplified interface
  const [todayFocus, setTodayFocus] = useState(() => {
    const saved = localStorage.getItem('todayFocus');
    return saved === 'true';
  });

  // Helper: Get default page for patient role based on Today's Focus setting
  const getDefaultPatientPage = () => {
    return todayFocus ? 'today' : 'dashboard';
  };

  // Save todayFocus to localStorage when changed
  useEffect(() => {
    localStorage.setItem('todayFocus', String(todayFocus));
  }, [todayFocus]);

  // Load auto-scroll preference from localStorage
  const getInitialAutoScroll = () => {
    const stored = localStorage.getItem('autoScroll');
    return stored === null ? true : stored === 'true';
  };
  const [autoScroll, setAutoScroll] = useState(getInitialAutoScroll);

  // Global error handler (runs once on mount)
  useEffect(() => {
    setupGlobalErrorHandler();
    log.info('Prescription Clarity initialized', {
      version: '2.0.0',
      environment: typeof import.meta !== 'undefined' && import.meta.env?.MODE || 'production',
    });
  }, []);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Auto-scroll effect
  useEffect(() => {
    localStorage.setItem('autoScroll', String(autoScroll));
  }, [autoScroll]);

  // OAuth callback detection - check URL for OAuth redirect
  useEffect(() => {
    // Check for hash-based routing (#oauth-callback)
    if (window.location.hash === '#oauth-callback' || window.location.hash.startsWith('#oauth-callback')) {
      console.log('🔐 OAuth callback detected via hash');
      setCurrentPage('oauth-callback');
      return;
    }

    // Check for query param based routing (?page=oauth-callback)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('page') === 'oauth-callback' || urlParams.get('code')) {
      console.log('🔐 OAuth callback detected via URL params');
      setCurrentPage('oauth-callback');
      return;
    }

    // Check for path-based routing (/oauth-callback)
    if (window.location.pathname.includes('oauth-callback') || window.location.pathname.includes('auth/callback')) {
      console.log('🔐 OAuth callback detected via path');
      setCurrentPage('oauth-callback');
      return;
    }
  }, []); // Run once on mount

  // Fetch current user and medications on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
      fetchMedications();
    }
  }, [isAuthenticated]);

  // AUTO-UPDATE medication statuses every hour (CRITICAL for SCHEDULED → ACTIVE transitions)
  useEffect(() => {
    if (!isAuthenticated || medications.length === 0) return;
    
    // Update statuses immediately on medications change
    const medicationsWithUpdatedStatuses = updateMedicationStatuses(medications);
    
    // Only update state if statuses actually changed
    const statusesChanged = medications.some((med, index) => 
      med.status !== medicationsWithUpdatedStatuses[index]?.status
    );
    
    if (statusesChanged) {
      console.log('🔄 Medication statuses updated automatically');
      setMedications(medicationsWithUpdatedStatuses);
      
      // Notify user if any medication became ACTIVE
      const newlyActive = medicationsWithUpdatedStatuses.filter((med, index) => 
        medications[index]?.status === 'SCHEDULED' && med.status === 'ACTIVE'
      );
      
      if (newlyActive.length > 0) {
        newlyActive.forEach(med => {
          toast.success('💊 Medication Now Active!', {
            description: `${med.name} is now active and ready to track`,
            duration: 5000,
          });
        });
      }
    }
    
    // Set up timer to check statuses every hour
    const timer = setInterval(() => {
      console.log('⏰ Checking medication statuses...');
      const updated = updateMedicationStatuses(medications);
      
      const hasChanges = medications.some((med, index) => 
        med.status !== updated[index]?.status
      );
      
      if (hasChanges) {
        console.log('🔄 Statuses changed, updating...');
        setMedications(updated);
        
        // Notify about SCHEDULED → ACTIVE transitions
        const justActivated = updated.filter((med, index) => 
          medications[index]?.status === 'SCHEDULED' && med.status === 'ACTIVE'
        );
        
        justActivated.forEach(med => {
          toast.success('💊 Medication Now Active!', {
            description: `${med.name} is ready to start tracking`,
            duration: 5000,
          });
        });
        
        // Notify about ACTIVE → COMPLETED transitions
        const justCompleted = updated.filter((med, index) => 
          medications[index]?.status === 'ACTIVE' && med.status === 'COMPLETED'
        );
        
        justCompleted.forEach(med => {
          toast.info('✅ Medication Course Completed', {
            description: `${med.name} course has ended`,
            duration: 5000,
          });
        });
      }
    }, 3600000); // 1 hour = 3600000ms
    
    return () => clearInterval(timer);
  }, [medications, isAuthenticated]);

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      setUserRole(user.role === 'patient' ? 'myself' : user.role);
      setOnboardingComplete(user.onboardingComplete || false);
      
      // Redirect to appropriate dashboard based on role
      if (user.role === 'caregiver') {
        setCurrentPage('caregiver');
      } else if (user.role === 'doctor') {
        setCurrentPage('doctor');
      } else {
        setCurrentPage(getDefaultPatientPage());
      }
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      const errorInfo = getErrorMessage(error, 'load-profile');
      
      // Check if re-auth is needed
      if (requiresReauth(error)) {
        toast.error('🔐 Session Expired: Please log in again', {
          description: 'Your session has expired for security reasons.',
          duration: 5000,
        });
        handleLogout();
      } else {
        toast.error(formatErrorForToast(error, 'load-profile'), {
          description: errorInfo.message,
          duration: 5000,
        });
      }
    }
  };

  // Fetch medications
  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await api.getMedications();
      
      // FALLBACK: Load demo patient (Thomas O'Connor - MALE patient) if API returns empty
      if (!data || data.length === 0) {
        console.log('📦 Loading Thomas O\'Connor demo data...');
        const { loadDatabase } = await import('./data/database');
        const db = await loadDatabase();
        
        // Find Thomas O'Connor (patient_002) - MALE PATIENT
        const thomas = db.patients.find(p => p.id === 'patient_002');
        
        if (thomas && thomas.medications) {
          const demoMedications = thomas.medications.map((med: any, index: number) => ({
            id: index + 1,
            name: med.name,
            dosage: med.dosage,
            quantity: 1,
            form: 'Tablet',
            times: med.times || ['08:00'],
            time: (med.times && med.times[0]) || '08:00', // ✅ FIX: Add single time field
            timesPerDay: med.times?.length || 1,
            mealTiming: med.mealTiming || 'anytime',
            daysOfWeek: med.daysOfWeek 
              ? { 
                  mon: med.daysOfWeek.includes('Monday'),
                  tue: med.daysOfWeek.includes('Tuesday'),
                  wed: med.daysOfWeek.includes('Wednesday'),
                  thu: med.daysOfWeek.includes('Thursday'),
                  fri: med.daysOfWeek.includes('Friday'),
                  sat: med.daysOfWeek.includes('Saturday'),
                  sun: med.daysOfWeek.includes('Sunday')
                }
              : { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true },
            duration: med.duration || '30 Days',
            instructions: med.condition ? `For ${med.condition}` : '',
            taken: false,
            photo: null,
            startDate: med.startDate,
            endDate: med.endDate,
            status: 'active'
          }));
          
          setMedications(demoMedications);
          console.log('✅ Thomas O\'Connor medications loaded:', demoMedications.length);
          
          // Update currentUser with Thomas's data
          setCurrentUser({
            ...currentUser,
            name: `${thomas.firstName} ${thomas.lastName}`,
            email: thomas.email,
            gender: thomas.gender.toLowerCase(),
            photoUrl: thomas.photoUrl,
            dateOfBirth: thomas.dateOfBirth
          });
          
          toast.info('Demo patient loaded', {
            description: `${thomas.firstName} ${thomas.lastName} - ${demoMedications.length} medications`,
            duration: 3000,
          });
        } else {
          setMedications([]);
        }
      } else {
        setMedications(data);
      }
    } catch (error: any) {
      console.error('Failed to fetch medications:', error);
      const errorInfo = getErrorMessage(error, 'load-medications');
      toast.error(formatErrorForToast(error, 'load-medications'), {
        description: errorInfo.message,
        duration: 5000,
        action: {
          label: errorInfo.action || 'Retry',
          onClick: () => fetchMedications(),
        },
      });
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (email: string, password: string, rememberMe: boolean = false) => {
    console.log('App.tsx handleLogin called:', { email, rememberMe });
    try {
      setLoading(true);
      console.log('Calling api.login...');
      const data = await api.login(email, password, rememberMe);
      console.log('Login API response:', data);
      
      // Store token with expiry (Remember Me = 30 days, otherwise 1 day)
      if (data.expiresAt) {
        localStorage.setItem('authTokenExpiry', data.expiresAt.toString());
        console.log('✅ Token expiry saved:', new Date(data.expiresAt).toLocaleString());
      }
      
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      setUserRole(data.user.role === 'patient' ? 'myself' : data.user.role);
      setOnboardingComplete(data.user.onboardingComplete || false);
      
      toast.success(`Welcome back, ${data.user.name}!`);
      
      // Redirect to appropriate dashboard
      if (data.user.onboardingComplete) {
        if (data.user.role === 'caregiver') {
          console.log('✅ CAREGIVER LOGIN - Redirecting to caregiver dashboard');
          setCurrentPage('caregiver');
        } else if (data.user.role === 'doctor') {
          console.log('✅ DOCTOR LOGIN - Redirecting to doctor dashboard');
          setCurrentPage('doctor');
        } else {
          console.log('✅ PATIENT LOGIN - Redirecting to patient dashboard');
          setCurrentPage(getDefaultPatientPage());
        }
      } else {
        console.log('⚠️ ONBOARDING NOT COMPLETE - Redirecting to onboarding');
        setCurrentPage('onboarding');
      }
      
      console.log('Login complete, redirecting to:', currentPage);
    } catch (error: any) {
      console.error('Login error in App.tsx:', error);
      const errorInfo = getErrorMessage(error, 'login');
      toast.error(formatErrorForToast(error, 'login'), {
        description: errorInfo.message,
        duration: 5000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'patient' | 'caregiver' | 'doctor';
    dateOfBirth?: string;
    gender?: 'male' | 'female';
  }) => {
    console.log('App.tsx handleRegister called:', userData);
    try {
      setLoading(true);
      console.log('Calling api.register...');
      const data = await api.register(userData);
      console.log('Registration API response:', data);
      
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      setUserRole(data.user.role === 'patient' ? 'myself' : data.user.role);
      
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      
      // Redirect to onboarding
      setCurrentPage('onboarding');
      console.log('Registration complete, redirecting to onboarding');
    } catch (error: any) {
      console.error('Registration error in App.tsx:', error);
      const errorInfo = getErrorMessage(error, 'register');
      toast.error(formatErrorForToast(error, 'register'), {
        description: errorInfo.message,
        duration: 5000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle onboarding complete
  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    
    // Redirect to appropriate dashboard based on role
    if (userRole === 'caregiver') {
      setCurrentPage('caregiver');
    } else if (userRole === 'doctor') {
      setCurrentPage('doctor');
    } else {
      setCurrentPage(getDefaultPatientPage());
    }
  };

  // Handle quick demo login
  const handleQuickDemo = () => {
    // Show demo login page instead of auto-login
    setCurrentPage('demo-login');
  };
  
  // Handle demo role selection
  const handleDemoLogin = async (email: string, password: string, role: 'patient' | 'caregiver' | 'doctor') => {
    try {
      setLoading(true);
      await handleLogin(email, password);
      
      const roleLabels = {
        patient: 'Margaret Williams (Patient)',
        caregiver: 'Catherine Bennett (Caregiver)',
        doctor: 'Dr. James Anderson (Doctor)'
      };
      
      toast.success('👋 Welcome to the Demo!', {
        description: `Exploring as ${roleLabels[role]} - Feel free to try all features!`,
        duration: 4000,
      });
    } catch (error: any) {
      console.error('Demo login error:', error);
      const errorInfo = getErrorMessage(error, 'load-demo');
      toast.error('📋 Could Not Load Demo', {
        description: 'Unable to load demo data. Please refresh the page and try again.',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Try to call API logout but don't wait forever
      const logoutPromise = api.logout();
      await Promise.race([
        logoutPromise,
        new Promise((resolve) => setTimeout(resolve, 2000)) // 2 second timeout
      ]);
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      // ALWAYS clear local state regardless of API response
      setIsAuthenticated(false);
      setCurrentUser(null);
      setOnboardingComplete(false);
      setCurrentPage('landing');
      setUserRole('myself');
      setMedications([]);
      const successInfo = getSuccessMessage('signed out');
      toast.success(formatSuccessForToast('signed out'), {
        description: successInfo.message,
        duration: 3000,
      });
    }
  };

  // Handle role switch
  const handleRoleSwitch = (newRole: 'myself' | 'caregiver' | 'doctor') => {
    setUserRole(newRole);
    // Redirect to appropriate dashboard
    if (newRole === 'caregiver') {
      setCurrentPage('caregiver');
    } else if (newRole === 'doctor') {
      setCurrentPage('doctor');
    } else {
      setCurrentPage(getDefaultPatientPage());
    }
    const roleLabel = newRole === 'myself' ? 'patient' : newRole;
    const successInfo = getSuccessMessage('switched to', { role: roleLabel });
    toast.success(formatSuccessForToast('switched to', { role: roleLabel }), {
      description: successInfo.message,
      duration: 2000,
    });
  };

  // Medication CRUD operations
  const addMedication = async (newMed: any) => {
    try {
      const created = await api.createMedication(newMed);
      setMedications([...medications, created]);
      
      const successInfo = getSuccessMessage('medication added', { 
        name: created.name,
        dosage: created.dosage 
      });
      toast.success(formatSuccessForToast('medication added', { name: created.name }), {
        description: successInfo.message,
        duration: 3000,
      });
      
      return created;
    } catch (error: any) {
      console.error('Failed to add medication:', error);
      const errorInfo = getErrorMessage(error, 'add-medication');
      toast.error(formatErrorForToast(error, 'add-medication'), {
        description: errorInfo.message,
        duration: 5000,
      });
      throw error;
    }
  };

  const updateMedication = async (id: number, updatedData: any) => {
    try {
      const updated = await api.updateMedication(id.toString(), updatedData);
      setMedications(medications.map(med => 
        med.id === id ? { ...med, ...updated } : med
      ));
      
      const successInfo = getSuccessMessage('medication updated', { 
        name: updated.name 
      });
      toast.success(formatSuccessForToast('medication updated', { name: updated.name }), {
        description: successInfo.message,
        duration: 3000,
      });
      
      return updated;
    } catch (error: any) {
      console.error('Failed to update medication:', error);
      const errorInfo = getErrorMessage(error, 'edit-medication');
      toast.error(formatErrorForToast(error, 'edit-medication'), {
        description: errorInfo.message,
        duration: 5000,
      });
      throw error;
    }
  };

  const deleteMedication = async (id: number) => {
    try {
      const medication = medications.find(med => med.id === id);
      const previousMedications = [...medications];
      
      await api.deleteMedication(id.toString());
      setMedications(medications.filter(med => med.id !== id));
      
      const successInfo = getSuccessMessage('medication deleted', { 
        name: medication?.name 
      });
      
      // Show success with UNDO option
      toast.success(formatSuccessForToast('medication deleted', { name: medication?.name }), {
        description: successInfo.message,
        duration: 5000,
        action: successInfo.showUndo ? {
          label: successInfo.undoLabel || 'Undo',
          onClick: async () => {
            try {
              // Restore medication
              const restored = await api.createMedication(medication);
              setMedications(previousMedications);
              toast.success('💊 Medication Restored!', {
                description: `${medication?.name} has been restored`,
                duration: 2000,
              });
            } catch (error) {
              toast.error('Failed to restore medication');
            }
          },
        } : undefined,
      });
    } catch (error: any) {
      console.error('Failed to delete medication:', error);
      const errorInfo = getErrorMessage(error, 'delete-medication');
      toast.error(formatErrorForToast(error, 'delete-medication'), {
        description: errorInfo.message,
        duration: 5000,
      });
      throw error;
    }
  };

  const handleDeleteMedication = async (medication: any) => {
    try {
      await deleteMedication(medication.id);
      setSelectedMedication(null);
      setCurrentPage('medications-list');
    } catch (error) {
      // Error already handled in deleteMedication
    }
  };

  const handleMarkTaken = async (id: number) => {
    try {
      // Update medication as taken
      const medication = medications.find(med => med.id === id);
      if (!medication) return;

      const previousState = { ...medication };
      const updated = await updateMedication(id, { ...medication, taken: true });
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      const successInfo = getSuccessMessage('medication taken', { 
        name: medication.name 
      });
      
      // Show success with UNDO option
      toast.success(formatSuccessForToast('medication taken', { name: medication.name }), {
        description: successInfo.message,
        duration: 4000,
        action: successInfo.showUndo ? {
          label: successInfo.undoLabel || 'Undo',
          onClick: async () => {
            try {
              // Restore to not taken
              await updateMedication(id, { ...previousState, taken: false });
              toast.success('✅ Undone!', {
                description: `${medication.name} marked as not taken`,
                duration: 2000,
              });
            } catch (error) {
              toast.error('Failed to undo');
            }
          },
        } : undefined,
      });
      
      return updated;
    } catch (error: any) {
      console.error('Failed to mark medication as taken:', error);
      const errorInfo = getErrorMessage(error, 'mark-taken');
      toast.error('❌ Could Not Mark as Taken', {
        description: errorInfo.message,
        duration: 5000,
        action: {
          label: 'Try Again',
          onClick: () => handleMarkTaken(id),
        },
      });
      throw error;
    }
  };

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    if (currentPage === 'signup') {
      return (
        <>
          <SignUpMultiStep
            onSignUp={handleRegister} 
            setCurrentPage={setCurrentPage} 
            darkMode={darkMode} 
          />
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            closeButton
            theme={darkMode ? 'dark' : 'light'}
          />
        </>
      );
    }
    
    if (currentPage === 'login') {
      return (
        <>
          <LoginEnhanced
            onLogin={handleLogin} 
            setCurrentPage={setCurrentPage} 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
          />
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            closeButton
            theme={darkMode ? 'dark' : 'light'}
          />
        </>
      );
    }

    if (currentPage === 'forgot-password') {
      return (
        <>
          <ForgotPassword
            setCurrentPage={setCurrentPage}
            darkMode={darkMode}
          />
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            closeButton
            theme={darkMode ? 'dark' : 'light'}
          />
        </>
      );
    }

    if (currentPage === 'email-verification') {
      return (
        <>
          <EmailVerification
            email={currentUser?.email || ''}
            onVerified={() => setCurrentPage('dashboard')}
            onBack={() => setCurrentPage('login')}
            darkMode={darkMode}
          />
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            closeButton
            theme={darkMode ? 'dark' : 'light'}
          />
        </>
      );
    }

    if (currentPage === 'reset-password') {
      return (
        <>
          <ResetPassword
            setCurrentPage={setCurrentPage}
            darkMode={darkMode}
          />
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            closeButton
            theme={darkMode ? 'dark' : 'light'}
          />
        </>
      );
    }

    if (currentPage === 'oauth-callback') {
      return (
        <>
          <OAuthCallback
            setCurrentPage={setCurrentPage}
            setIsAuthenticated={setIsAuthenticated}
          />
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            closeButton
            theme={darkMode ? 'dark' : 'light'}
          />
        </>
      );
    }
    
    if (currentPage === 'demo-login') {
      return (
        <>
          <DemoLogin
            onDemoLogin={handleDemoLogin}
            onBack={() => setCurrentPage('landing')}
            darkMode={darkMode}
          />
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            closeButton
            theme={darkMode ? 'dark' : 'light'}
          />
        </>
      );
    }

    // Landing page
    return (
      <>
        <LandingPageRedesigned
          onGetStarted={() => setCurrentPage('signup')}
          onQuickDemo={handleQuickDemo} 
          onSignIn={() => setCurrentPage('login')} 
          darkMode={darkMode}
        />
        <Toaster 
          position="top-center"
          expand={true}
          richColors
          closeButton
          theme={darkMode ? 'dark' : 'light'}
        />
      </>
    );
  }

  // Show onboarding if not complete
  if (currentPage === 'onboarding' && !onboardingComplete) {
    // Show role-specific onboarding
    let OnboardingComponent;
    
    if (userRole === 'caregiver') {
      OnboardingComponent = OnboardingCaregiverEnhanced;
    } else if (userRole === 'doctor') {
      OnboardingComponent = OnboardingDoctorEnhanced;
    } else {
      OnboardingComponent = OnboardingEnhanced;
    }
    
    return (
      <>
        <OnboardingComponent 
          onComplete={handleOnboardingComplete}
          darkMode={darkMode}
        />
        <Toaster 
          position="top-center"
          expand={true}
          richColors
          closeButton
          theme={darkMode ? 'dark' : 'light'}
        />
      </>
    );
  }

  // Render authenticated pages
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        // Use DashboardWebPro - Professional web SaaS layout
        // Grid-based design with proper spacing and card layouts
        // Corporate-level UX optimized for desktop
        return (
          <DashboardWebPro 
            darkMode={darkMode} 
            setCurrentPage={setCurrentPage} 
            medications={medications} 
            currentUser={currentUser}
            onMarkTaken={(id) => {
              const medication = medications.find(m => m.id === id);
              if (medication) {
                const updatedMeds = medications.map(m => 
                  m.id === id ? { ...m, taken: true } : m
                );
                setMedications(updatedMeds);
                toast.success('Marked as taken!', {
                  description: `${medication.name} completed`,
                  duration: 2000,
                });
              }
            }}
          />
        );
      case 'main':
      case 'today':
        return (
          <MainSchedule 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setCurrentPage={setCurrentPage} 
            medications={medications}
            setMedications={setMedications}
            setSelectedMedicationId={setSelectedMedicationId}
            autoScroll={autoScroll}
            currentUser={currentUser}
          />
        );
      case 'add':
        // Always use detailed form (AddPrescriptionEnhanced) for complete interface
        return (
          <AddPrescriptionEnhanced 
            darkMode={darkMode}
            setCurrentPage={setCurrentPage}
            addMedication={addMedication}
          />
        );
      case 'edit':
      case 'edit-medication':
        // Check localStorage for editMedicationData first (from caregiver/doctor dashboards)
        const editDataFromStorage = localStorage.getItem('editMedicationData');
        let medicationToEdit;
        
        if (editDataFromStorage) {
          // Editing from caregiver/doctor context
          medicationToEdit = JSON.parse(editDataFromStorage);
        } else {
          // Editing from patient's own medications
          medicationToEdit = medications.find(m => m.id === selectedMedicationId);
        }
        
        return medicationToEdit ? (
          <EditPrescriptionEnhanced 
            darkMode={darkMode}
            setCurrentPage={setCurrentPage}
            medication={medicationToEdit}
            updateMedication={(updatedMed) => {
              // Handle update based on context
              if (medicationToEdit.context === 'caregiver' || medicationToEdit.context === 'doctor') {
                // Show success message and redirect back
                const contextName = medicationToEdit.dependentName || medicationToEdit.patientName;
                toast.success(`Updated ${updatedMed.name}`, {
                  description: `Medication updated for ${contextName}`,
                  duration: 3000
                });
                localStorage.removeItem('editMedicationData');
                setCurrentPage(medicationToEdit.context === 'caregiver' ? 'caregiver-dashboard' : 'doctor-dashboard');
              } else {
                // Update patient's own medication
                updateMedication(medicationToEdit.id, updatedMed);
                localStorage.removeItem('editMedicationData');
              }
            }}
            deleteMedication={(medId) => {
              // Handle delete based on context
              if (medicationToEdit.context === 'caregiver' || medicationToEdit.context === 'doctor') {
                const contextName = medicationToEdit.dependentName || medicationToEdit.patientName;
                toast.success(`Deleted ${medicationToEdit.name}`, {
                  description: `Medication removed for ${contextName}`,
                  duration: 3000
                });
                localStorage.removeItem('editMedicationData');
                setCurrentPage(medicationToEdit.context === 'caregiver' ? 'caregiver-dashboard' : 'doctor-dashboard');
              } else {
                deleteMedication(medId);
                localStorage.removeItem('editMedicationData');
              }
            }}
          />
        ) : null;
      case 'history':
        return (
          <History 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            setCurrentPage={setCurrentPage} 
            userRole={userRole === 'myself' ? 'patient' : userRole} 
            medications={medications} 
          />
        );
      case 'medications':
        return (
          <MainSchedule 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setCurrentPage={setCurrentPage} 
            medications={medications}
            setMedications={setMedications}
            setSelectedMedicationId={setSelectedMedicationId}
            autoScroll={autoScroll}
            currentUser={currentUser}
          />
        );
      case 'rewards':
        return (
          <Rewards 
            darkMode={darkMode} 
            setCurrentPage={setCurrentPage}
            medications={medications}
          />
        );
      case 'settings':
        return (
          <SettingsPage 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            setCurrentPage={setCurrentPage} 
            onLogout={handleLogout}
            userRole={userRole}
            onRoleChange={handleRoleSwitch}
            autoScroll={autoScroll}
            setAutoScroll={setAutoScroll}
            todayFocus={todayFocus}
            setTodayFocus={setTodayFocus}
          />
        );
      case 'print':
        return (
          <PrintSchedule 
            darkMode={darkMode} 
            setCurrentPage={setCurrentPage} 
            medications={medications}
            currentUser={currentUser}
          />
        );
      case 'caregiver':
        return (
          <CaregiverDashboardWeb 
            darkMode={darkMode} 
            setCurrentPage={setCurrentPage} 
          />
        );
      case 'caregiver-analytics':
        return (
          <CaregiverAnalytics 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            setCurrentPage={setCurrentPage}
          />
        );
      case 'add-dependent':
        return (
          <AddDependent
            darkMode={darkMode}
            setCurrentPage={setCurrentPage}
            onAdd={(dependent) => {
              // Success message is already shown in AddDependent component
              // No need for duplicate toast here
            }}
          />
        );
      case 'edit-dependent':
        return selectedDependent ? (
          <EditDependent
            darkMode={darkMode}
            setCurrentPage={setCurrentPage}
            dependent={selectedDependent}
            onSave={(updatedDependent) => {
              // TODO: API call to update dependent
              setSelectedDependent(updatedDependent);
              toast.success(`${updatedDependent.firstName} ${updatedDependent.lastName} updated successfully!`);
            }}
          />
        ) : (
          <CaregiverDashboardEnhanced darkMode={darkMode} setCurrentPage={setCurrentPage} />
        );
      // case 'dependent-details': - REMOVED DUPLICATE (was at line 870, kept version at line 1154)
      case 'add-medication-for-dependent':
        // CRITICAL FIX: Caregiver can now add medications for dependents
        return (
          <AddPrescriptionEnhanced
            darkMode={darkMode}
            setCurrentPage={(page) => {
              if (page === 'main') {
                setCurrentPage('dependent-details');
              } else {
                setCurrentPage(page);
              }
            }}
            addMedication={(newMed) => {
              // TODO: API call to create medication for dependent
              toast.success(`Medication added for ${selectedDependent?.name || 'dependent'}!`, {
                description: `${newMed.name} ${newMed.dosage} added to medication list`
              });
              setCurrentPage('dependent-details');
            }}
          />
        );
      case 'doctor':
        return (
          <DoctorDashboardWeb 
            darkMode={darkMode} 
            setCurrentPage={setCurrentPage} 
          />
        );
      case 'doctor-analytics':
        return (
          <DoctorAnalytics 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            setCurrentPage={setCurrentPage}
          />
        );
      case 'add-patient':
        return (
          <AddPatient
            darkMode={darkMode}
            setCurrentPage={setCurrentPage}
            onInvite={(invitation) => {
              // TODO: API call to send invitation
              toast.success(`Invitation sent to ${invitation.email}!`);
            }}
          />
        );
      case 'add-prescription-for-patient':
        // CRITICAL FIX: Doctor can prescribe medications for patients
        return (
          <AddPrescriptionEnhanced
            darkMode={darkMode}
            setCurrentPage={(page) => {
              if (page === 'main') {
                setCurrentPage('patient-details');
              } else {
                setCurrentPage(page);
              }
            }}
            addMedication={(newMed) => {
              // TODO: API call to create medication for patient
              toast.success(`Medication prescribed for ${selectedPatient?.name || 'patient'}!`, {
                description: `${newMed.name} ${newMed.dosage} added to treatment plan`
              });
              setCurrentPage('patient-details');
            }}
          />
        );
      case 'privacy':
        return (
          <Privacy 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            setCurrentPage={setCurrentPage} 
          />
        );
      case 'terms':
        return (
          <Terms 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            setCurrentPage={setCurrentPage} 
          />
        );
      case 'profile':
        // Profile page is only for Patient role
        // For Caregiver/Doctor, show Settings page instead
        if (userRole !== 'myself') {
          return (
            <SettingsPage
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setCurrentPage={setCurrentPage}
              onLogout={handleLogout}
              userRole={userRole}
              onRoleChange={handleRoleSwitch}
              autoScroll={autoScroll}
              setAutoScroll={setAutoScroll}
              todayFocus={todayFocus}
              setTodayFocus={setTodayFocus}
            />
          );
        }
        return (
          <Profile 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            setCurrentPage={setCurrentPage}
            currentUser={currentUser}
          />
        );
      case 'medication-reference':
        return (
          <MedicationReference 
            medications={medications} 
            darkMode={darkMode} 
            onBack={() => setCurrentPage('settings')} 
          />
        );
      case 'week-view':
        return (
          <WeekView
            medications={medications}
            onMarkTaken={(medId, date, time) => {
              // Handle mark taken
              toast.success('Marked as taken');
            }}
            darkMode={darkMode}
            setCurrentPage={setCurrentPage}
            currentUser={currentUser}
          />
        );
      case 'medications-list':
        return (
          <MedicationsList
            medications={medications}
            onAddMedication={() => setCurrentPage('add')}
            onSelectMedication={(med) => {
              setSelectedMedication(med);
              setCurrentPage('medication-details');
            }}
            onEditMedication={(id) => {
              setSelectedMedicationId(id);
              setCurrentPage('edit');
            }}
            onDeleteMedication={(id) => {
              deleteMedication(id);
            }}
            onPrintMedication={(id) => {
              const med = medications.find(m => m.id === id);
              if (med) {
                // Create a printable view for single medication
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Medication: ${med.name}</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 40px; }
                          h1 { color: #2196F3; margin-bottom: 30px; }
                          .info { margin: 15px 0; font-size: 18px; }
                          .label { font-weight: bold; color: #333; }
                          .value { color: #666; }
                          @media print {
                            body { padding: 20px; }
                          }
                        </style>
                      </head>
                      <body>
                        <h1>${med.name}</h1>
                        <div class="info"><span class="label">Dosage:</span> <span class="value">${med.dosage}</span></div>
                        <div class="info"><span class="label">Form:</span> <span class="value">${med.form || 'Not specified'}</span></div>
                        <div class="info"><span class="label">Times:</span> <span class="value">${med.times.join(', ')}</span></div>
                        <div class="info"><span class="label">Frequency:</span> <span class="value">${med.frequency || 'Not specified'}</span></div>
                        ${med.mealTiming ? `<div class="info"><span class="label">Meal Timing:</span> <span class="value">${med.mealTiming}</span></div>` : ''}
                        ${med.specialInstructions ? `<div class="info"><span class="label">Instructions:</span> <span class="value">${med.specialInstructions}</span></div>` : ''}
                        ${med.duration ? `<div class="info"><span class="label">Duration:</span> <span class="value">${med.duration}</span></div>` : ''}
                        <script>window.print(); window.close();</script>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                }
              }
            }}
            darkMode={darkMode}
          />
        );
      case 'medication-details':
        return selectedMedication ? (
          <MedicationDetails
            medication={selectedMedication}
            onBack={() => {
              setSelectedMedication(null);
              setCurrentPage('medications-list');
            }}
            onEdit={(med) => {
              setSelectedMedicationId(med.id);
              setCurrentPage('edit');
            }}
            onDelete={handleDeleteMedication}
            darkMode={darkMode}
          />
        ) : (
          <Dashboard darkMode={darkMode} setCurrentPage={setCurrentPage} medications={medications} />
        );
      case 'notifications':
        return (
          <NotificationsManager
            onBack={() => setCurrentPage('dashboard')}
            darkMode={darkMode}
          />
        );
      case 'share-profile':
        return (
          <ShareProfile
            darkMode={darkMode}
          />
        );
      case 'history-demo':
        return <HistoryDemo darkMode={darkMode} />;
      case 'database-test':
        return <DatabaseTest />;
      case 'dependent-details':
        return selectedDependent ? (
          <DependentDetails
            dependent={selectedDependent}
            onBack={() => {
              setSelectedDependent(null);
              setCurrentPage('caregiver');
            }}
            onEdit={(dep) => {
              setSelectedDependent(dep);
              setCurrentPage('edit-dependent');
            }}
            onDelete={(id) => {
              toast.success('Dependent removed');
              setSelectedDependent(null);
              setCurrentPage('caregiver');
            }}
            onViewMedications={(dep) => {
              toast.info('View dependent medications coming soon');
            }}
            onAddMedication={(dep) => {
              // CRITICAL FIX: Caregiver can now add medications for dependents
              setSelectedDependent(dep);
              setCurrentPage('add-medication-for-dependent');
              toast.success(`Adding medication for ${dep.name}`);
            }}
            darkMode={darkMode}
          />
        ) : (
          <CaregiverDashboardEnhanced darkMode={darkMode} setCurrentPage={setCurrentPage} />
        );
      case 'patient-details':
        return selectedPatient ? (
          <PatientDetails
            patient={selectedPatient}
            onBack={() => {
              setSelectedPatient(null);
              setCurrentPage('doctor');
            }}
            onViewMedications={(patient) => {
              toast.info('View patient medications coming soon');
            }}
            onPrescribeMedication={(patient) => {
              // CRITICAL FIX: Doctor can now prescribe medications for patients
              setSelectedPatient(patient);
              setCurrentPage('add-prescription-for-patient');
              toast.success(`Prescribing medication for ${patient.name}`);
            }}
            darkMode={darkMode}
          />
        ) : (
          <DoctorDashboard darkMode={darkMode} setDarkMode={setDarkMode} setCurrentPage={setCurrentPage} />
        );
      default:
        return <DashboardWebPro darkMode={darkMode} setCurrentPage={setCurrentPage} medications={medications} currentUser={currentUser} onMarkTaken={handleMarkTaken} />;
    }
  };

  // Desktop layout with sidebar
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.error('App Error:', error, errorInfo);
        }
        // TODO: Send to error tracking service in production
      }}
    >
      <div className={darkMode ? 'dark' : ''}>
        <AppLayoutNormal
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          userRole={userRole}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onRoleChange={handleRoleSwitch}
          onLogout={handleLogout}
          currentUser={currentUser}
        >
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
        </Suspense>
      </AppLayoutNormal>

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        expand={true}
        richColors
        closeButton
        theme={darkMode ? 'dark' : 'light'}
      />

      {/* Debug Panel - Development only */}
      {typeof import.meta !== 'undefined' && import.meta.env?.DEV && (
        <>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-30 hover:opacity-90 transition-opacity shadow-lg"
            title="Debug Panel"
          >
            {showDebug ? '✕' : 'Debug'}
          </button>
          
          {showDebug && (
            <div className="fixed bottom-16 left-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 w-64 border-2 border-blue-500 max-h-[70vh] overflow-y-auto">
              <h3 className="font-bold mb-3 text-gray-900 dark:text-white">Debug Panel</h3>
              
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">User:</p>
                  <p className="font-medium">{currentUser?.name || 'Loading...'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
                </div>

                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Role:</p>
                  <p className="font-medium capitalize">{userRole}</p>
                </div>

                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Page:</p>
                  <p className="font-medium">{currentPage}</p>
                </div>

                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Medications:</p>
                  <p className="font-medium">{medications.length} total</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick Navigation:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button 
                    onClick={() => { setCurrentPage('dashboard'); setShowDebug(false); }} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1.5 rounded text-xs transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => { setCurrentPage('main'); setShowDebug(false); }} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1.5 rounded text-xs transition-colors"
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => { setCurrentPage('caregiver'); setShowDebug(false); }} 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 rounded text-xs transition-colors"
                  >
                    Caregiver
                  </button>
                  <button 
                    onClick={() => { setCurrentPage('doctor'); setShowDebug(false); }} 
                    className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1.5 rounded text-xs transition-colors"
                  >
                    Doctor
                  </button>
                  <button 
                    onClick={() => { setCurrentPage('database-test'); setShowDebug(false); }} 
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1.5 rounded text-xs transition-colors col-span-2"
                  >
                    🧪 Test Database
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button 
                  onClick={() => { handleLogout(); setShowDebug(false); }} 
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </ErrorBoundary>
  );
}