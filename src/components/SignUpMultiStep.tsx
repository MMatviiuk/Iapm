import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  Lock,
  Calendar,
  Users,
  Stethoscope,
  Heart
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PillShieldLogo } from './PillShieldLogo';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import DateOfBirthPicker from './DateOfBirthPicker';

interface SignUpMultiStepProps {
  onSignUp: (userData: {
    email: string;
    password: string;
    name: string;
    role: 'patient' | 'caregiver' | 'doctor';
    dateOfBirth?: string;
    gender?: 'male' | 'female';
  }) => Promise<void>;
  setCurrentPage: (page: string) => void;
  darkMode: boolean;
}

export default function SignUpMultiStep({ 
  onSignUp, 
  setCurrentPage, 
  darkMode 
}: SignUpMultiStepProps) {
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [role, setRole] = useState<'patient' | 'caregiver' | 'doctor'>('patient');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const totalSteps = 4;

  // Validation functions
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordStrong = (password: string) => {
    return password.length >= 8;
  };

  // Step validation
  const canProceedFromStep1 = () => {
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const canProceedFromStep2 = () => {
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!dateOfBirth) {
      toast.error('Please select your date of birth');
      return false;
    }
    return true;
  };

  const canProceedFromStep3 = () => {
    if (!role) {
      toast.error('Please select your role');
      return false;
    }
    return true;
  };

  const canProceedFromStep4 = () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and privacy policy');
      return false;
    }
    return true;
  };

  // Navigation
  const handleNext = () => {
    let canProceed = false;
    
    switch (currentStep) {
      case 1:
        canProceed = canProceedFromStep1();
        break;
      case 2:
        canProceed = canProceedFromStep2();
        break;
      case 3:
        canProceed = canProceedFromStep3();
        break;
      case 4:
        canProceed = canProceedFromStep4();
        break;
      default:
        canProceed = true;
    }

    if (canProceed) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(30);
        }
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Social login handler
  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    
    try {
      setLoading(true);
      
      // OAuth flow configuration
      // Support multiple redirect URI formats for compatibility
      const redirectUri = `${window.location.origin}${window.location.pathname}?page=oauth-callback`;
      const state = Math.random().toString(36).substring(7);
      
      // Store state and provider for callback verification (CSRF protection)
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_provider', provider);
      sessionStorage.setItem('oauth_action', 'signup');
      
      let authUrl = '';
      
      // Check if OAuth is configured
      const envVars = (typeof import.meta !== 'undefined' && import.meta.env) || {};
      
      if (provider === 'google') {
        const clientId = envVars.VITE_GOOGLE_CLIENT_ID || 'DEMO_GOOGLE_CLIENT_ID';
        
        if (clientId === 'DEMO_GOOGLE_CLIENT_ID') {
          toast.error('Google OAuth not configured', {
            description: 'Please configure OAuth credentials in .env file. See OAUTH_SETUP_GUIDE.md',
            duration: 8000,
          });
          setLoading(false);
          return;
        }
        
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `response_type=code&` +
          `scope=openid%20email%20profile&` +
          `state=${state}&` +
          `access_type=offline&` +
          `prompt=consent`;
      } else if (provider === 'apple') {
        const clientId = envVars.VITE_APPLE_CLIENT_ID || 'DEMO_APPLE_CLIENT_ID';
        
        if (clientId === 'DEMO_APPLE_CLIENT_ID') {
          toast.error('Apple OAuth not configured', {
            description: 'Please configure OAuth credentials in .env file. See OAUTH_SETUP_GUIDE.md',
            duration: 8000,
          });
          setLoading(false);
          return;
        }
        
        authUrl = `https://appleid.apple.com/auth/authorize?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `response_type=code&` +
          `state=${state}&` +
          `scope=name%20email&` +
          `response_mode=form_post`;
      } else if (provider === 'facebook') {
        const clientId = envVars.VITE_FACEBOOK_APP_ID || 'DEMO_FACEBOOK_APP_ID';
        
        if (clientId === 'DEMO_FACEBOOK_APP_ID') {
          toast.error('Facebook OAuth not configured', {
            description: 'Please configure OAuth credentials in .env file. See OAUTH_SETUP_GUIDE.md',
            duration: 8000,
          });
          setLoading(false);
          return;
        }
        
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${state}&` +
          `scope=email,public_profile&` +
          `response_type=code`;
      }
      
      console.log(`🔐 Initiating ${provider} OAuth signup...`);
      
      // Redirect to OAuth provider
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Social signup error:', error);
      toast.error('Social signup failed', {
        description: 'Please try email/password or contact support',
        duration: 5000,
      });
      setLoading(false);
    }
  };

  // Form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      await onSignUp({
        email,
        password,
        name: fullName,
        role,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
      });
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      // Error already handled by parent
    } finally {
      setLoading(false);
    }
  };

  // Role options
  const roleOptions = [
    {
      value: 'patient' as const,
      icon: Heart,
      title: 'Patient',
      subtitle: 'Managing my own medications',
      color: 'blue',
    },
    {
      value: 'caregiver' as const,
      icon: Users,
      title: 'Caregiver',
      subtitle: 'Managing family members',
      color: 'orange',
    },
    {
      value: 'doctor' as const,
      icon: Stethoscope,
      title: 'Healthcare Professional',
      subtitle: 'Managing patient cohorts',
      color: 'purple',
    },
  ];

  const getRoleColor = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'hover:border-blue-600',
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-500',
        text: 'text-orange-600 dark:text-orange-400',
        hover: 'hover:border-orange-600',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-500',
        text: 'text-purple-600 dark:text-purple-400',
        hover: 'hover:border-purple-600',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 ${
      darkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-white to-slate-50'
    }`}>
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <PillShieldLogo size={64} color="#2196F3" />
          </div>
          <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Create Your Account
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Join thousands managing their medications with confidence
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    step < currentStep
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : step === currentStep
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                      : 'border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  {step < currentStep ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="font-bold">{step}</span>
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep
                        ? 'bg-blue-600'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={currentStep >= 1 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500'}>
              Account
            </span>
            <span className={currentStep >= 2 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500'}>
              Profile
            </span>
            <span className={currentStep >= 3 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500'}>
              Role
            </span>
            <span className={currentStep >= 4 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500'}>
              Confirm
            </span>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          className={`p-8 lg:p-10 rounded-3xl border-2 shadow-2xl ${
            darkMode 
              ? 'bg-slate-900 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Account Credentials */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Account Information
                  </h2>
                  <p className={`text-base ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Create your secure login credentials
                  </p>
                </div>

                {/* Social Sign Up Buttons - HORIZONTAL LAYOUT */}
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 sm:h-16 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm sm:text-base flex flex-row items-center justify-center gap-2"
                    onClick={() => handleSocialLogin('google')}
                    disabled={loading}
                  >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium">Google</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 sm:h-16 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm sm:text-base flex flex-row items-center justify-center gap-2"
                    onClick={() => handleSocialLogin('apple')}
                    disabled={loading}
                  >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <span className="font-medium">Apple</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 sm:h-16 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm sm:text-base flex flex-row items-center justify-center gap-2"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={loading}
                  >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="font-medium">Facebook</span>
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className={`absolute inset-0 flex items-center ${darkMode ? 'opacity-30' : ''}`}>
                    <div className={`w-full border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className={`px-4 text-sm ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'}`}>
                      Or sign up with email
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 text-base"
                      autoFocus
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 text-base pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0 m-0 border-0 outline-none bg-transparent shadow-none flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 touch-manipulation transition-colors"
                        style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {password && <PasswordStrengthIndicator password={password} />}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-14 text-base pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0 m-0 border-0 outline-none bg-transparent shadow-none flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 touch-manipulation transition-colors"
                        style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        Passwords do not match
                      </p>
                    )}
                    {confirmPassword && password === confirmPassword && (
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Passwords match
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Personal Information
                  </h2>
                  <p className={`text-base ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Tell us a bit about yourself
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Smith"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-14 text-base"
                      autoFocus
                      required
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5" />
                      Date of Birth
                    </Label>
                    <DateOfBirthPicker
                      value={dateOfBirth}
                      onChange={(date) => setDateOfBirth(date)}
                      darkMode={darkMode}
                    />
                  </div>

                  <div>
                    <Label className="mb-3 block">Gender</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`h-16 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                          gender === 'male'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl">♂</span>
                        <span className="font-semibold text-base">Male</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`h-16 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                          gender === 'female'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl">♀</span>
                        <span className="font-semibold text-base">Female</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Role Selection */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Choose Your Role
                  </h2>
                  <p className={`text-base ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    How will you be using Prescription Clarity?
                  </p>
                </div>

                <div className="space-y-4">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    const colors = getRoleColor(option.color);
                    const isSelected = role === option.value;
                    
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                          isSelected
                            ? `${colors.border} ${colors.bg}`
                            : `border-slate-200 dark:border-slate-700 ${colors.hover}`
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            isSelected ? colors.bg : 'bg-slate-100 dark:bg-slate-800'
                          }`}>
                            <Icon className={`w-7 h-7 ${
                              isSelected ? colors.text : 'text-slate-600 dark:text-slate-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`text-xl font-bold ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {option.title}
                              </h3>
                              {isSelected && (
                                <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center`}>
                                  <Check className={`w-4 h-4 ${colors.text}`} />
                                </div>
                              )}
                            </div>
                            <p className={`text-base ${
                              darkMode ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {option.subtitle}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Review & Confirm
                  </h2>
                  <p className={`text-base ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Please review your information
                  </p>
                </div>

                {/* Summary */}
                <div className={`p-6 rounded-2xl border ${
                  darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="space-y-4">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        Email
                      </p>
                      <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {email}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        Full Name
                      </p>
                      <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {fullName}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        Date of Birth
                      </p>
                      <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {new Date(dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        Role
                      </p>
                      <p className={`text-lg font-medium capitalize ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-6 h-6 mt-0.5 rounded border-2 border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={`text-base leading-relaxed ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setCurrentPage('terms')}
                        className="p-0 border-0 bg-transparent text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={() => setCurrentPage('privacy')}
                        className="p-0 border-0 bg-transparent text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>

                  <div className={`p-4 rounded-xl ${
                    darkMode ? 'bg-blue-950/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <p className={`text-sm leading-relaxed ${
                      darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Your data is encrypted and GDPR & HIPAA compliant. We never share your information without consent.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="h-14 px-6 flex-1 border-2"
                disabled={loading}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            <Button
              type="button"
              onClick={handleNext}
              className="h-14 px-6 flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                'Creating Account...'
              ) : currentStep === totalSteps ? (
                'Create Account'
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}