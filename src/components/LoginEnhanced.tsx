import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Shield, Info, User, Users, Stethoscope, AlertCircle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { FieldWithTooltip } from './FieldWithTooltip';
import { PillShieldLogo } from './PillShieldLogo';

interface LoginEnhancedProps {
  onLogin: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  setCurrentPage: (page: string) => void;
  darkMode: boolean;
  setDarkMode?: (value: boolean) => void;
}

export default function LoginEnhanced({ 
  onLogin, 
  setCurrentPage, 
  darkMode 
}: LoginEnhancedProps) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  // Ref for login form to scroll to
  const loginFormRef = useRef<HTMLDivElement>(null);
  
  // Helper function to scroll to login form
  const scrollToLoginForm = () => {
    if (loginFormRef.current) {
      loginFormRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Load saved email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setErrors({email: 'Email is required'});
      return;
    } else if (!isValidEmail(email)) {
      setErrors({email: 'Please enter a valid email address'});
      return;
    } else {
      setErrors(prev => ({...prev, email: undefined}));
    }

    // Validate password
    if (!password) {
      setErrors({password: 'Password is required'});
      return;
    } else {
      setErrors(prev => ({...prev, password: undefined}));
    }

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    try {
      setLoading(true);
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      await onLogin(email, password, rememberMe);
    } catch (error: any) {
      console.error('Login error:', error);
      // Error already shown by parent
    } finally {
      setLoading(false);
    }
  };

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
      sessionStorage.setItem('oauth_action', 'login');
      
      let authUrl = '';
      
      // Check if OAuth is configured
      const envVars = (typeof import.meta !== 'undefined' && import.meta.env) || {};
      
      if (provider === 'google') {
        // Google OAuth 2.0
        const clientId = envVars.VITE_GOOGLE_CLIENT_ID || 'DEMO_GOOGLE_CLIENT_ID';
        
        // Show setup message if not configured
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
        // Apple Sign In
        const clientId = envVars.VITE_APPLE_CLIENT_ID || 'DEMO_APPLE_CLIENT_ID';
        
        // Show setup message if not configured
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
        // Facebook OAuth
        const clientId = envVars.VITE_FACEBOOK_APP_ID || 'DEMO_FACEBOOK_APP_ID';
        
        // Show setup message if not configured
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
      
      console.log(`🔐 Initiating ${provider} OAuth login...`);
      console.log('Redirect URI:', redirectUri);
      console.log('State:', state);
      
      // Redirect to OAuth provider
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Social login error:', error);
      toast.error('Social login failed', {
        description: 'Please try email/password or contact support',
        duration: 5000,
      });
      setLoading(false);
    }
  };


  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 ${
        darkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-white to-slate-50'
      }`}>
      <div className="w-full max-w-lg">
        {/* Logo and Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <PillShieldLogo size={80} color="#2196F3" />
          </div>
          <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Welcome Back
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Sign in to manage your medications
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          ref={loginFormRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-8 lg:p-10 rounded-3xl border-2 shadow-2xl ${
            darkMode 
              ? 'bg-slate-900 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
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
                className={`h-14 text-base ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                autoFocus
                autoComplete="email"
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-14 text-base pr-12 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0 m-0 border-0 outline-none bg-transparent shadow-none flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 touch-manipulation transition-colors"
                  style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setCurrentPage('forgot-password')}
                  className="p-0 m-0 border-0 outline-none bg-transparent shadow-none text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                  style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={loading}
              />
              <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer select-none text-base">
                <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                  Remember me for 30 days
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      className={`p-0 m-0 border-0 outline-none bg-transparent shadow-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors ${
                        darkMode 
                          ? 'text-slate-500 hover:text-slate-300 focus:text-slate-300' 
                          : 'text-slate-400 hover:text-slate-600 focus:text-slate-600'
                      }`}
                      style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                      aria-label="Help for Remember me"
                    >
                      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 cursor-help" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs text-sm" sideOffset={5}>
                    <div dangerouslySetInnerHTML={{ __html: "<strong>Stay logged in</strong> on this device for 30 days.<br/><br/><strong>Benefits:</strong><br/>• No need to enter password each time<br/>• Convenient for personal devices<br/>• Automatically expires after 30 days<br/><br/>⚠️ <strong>Security:</strong> Only use on your own device, not shared computers." }} />
                  </TooltipContent>
                </Tooltip>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className={`absolute inset-0 flex items-center ${
              darkMode ? 'opacity-30' : ''
            }`}>
              <div className={`w-full border-t ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}></div>
            </div>
            <div className="relative flex justify-center">
              <span className={`px-4 text-sm ${
                darkMode ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'
              }`}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons - HORIZONTAL LAYOUT (elderly-optimized) */}
          <div className="grid grid-cols-3 gap-3">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="h-14 sm:h-16 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm sm:text-base flex flex-row items-center justify-center gap-2"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Google</span>
            </Button>

            {/* Apple */}
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

            {/* Facebook */}
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

          {/* Security Badge */}
          <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 ${
            darkMode ? 'bg-green-950/30 border border-green-800' : 'bg-green-50 border border-green-200'
          }`}>
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className={`text-sm leading-relaxed ${
              darkMode ? 'text-green-300' : 'text-green-700'
            }`}>
              Your credentials are encrypted and secure. We never share your data.
            </p>
          </div>
        </motion.div>

        {/* Demo Accounts - ELDERLY-FRIENDLY, PROMINENT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`mt-6 p-5 sm:p-6 rounded-2xl border-2 ${
            darkMode 
              ? 'bg-blue-950/30 border-blue-800' 
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            <Info className={`w-6 h-6 flex-shrink-0 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div>
              <h3 className={`font-bold text-lg mb-1 ${
                darkMode ? 'text-blue-300' : 'text-blue-900'
              }`}>
                Try Demo Accounts
              </h3>
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-blue-200' : 'text-blue-700'
              }`}>
                Test the app with pre-loaded data. Click to quick-fill:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Patient Demo */}
            <button
              type="button"
              onClick={() => {
                setEmail('patient@demo.com');
                setPassword('demo123');
                
                // Scroll to login form
                setTimeout(() => scrollToLoginForm(), 100);
                
                toast.info('Demo Patient filled - Fictional data', {
                  description: 'Credentials auto-filled. Scroll up to Sign In button.',
                  duration: 4000,
                });
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all touch-manipulation ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-700'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
              disabled={loading}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Patient
                </span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                patient@demo.com
              </p>
            </button>

            {/* Caregiver Demo */}
            <button
              type="button"
              onClick={() => {
                setEmail('caregiver@demo.com');
                setPassword('demo123');
                
                // Scroll to login form
                setTimeout(() => scrollToLoginForm(), 100);
                
                toast.info('Demo Caregiver filled - Fictional data', {
                  description: 'Credentials auto-filled. Scroll up to Sign In button.',
                  duration: 4000,
                });
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all touch-manipulation ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 hover:border-orange-500 hover:bg-slate-700'
                  : 'bg-white border-slate-200 hover:border-orange-400 hover:bg-orange-50'
              }`}
              disabled={loading}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Caregiver
                </span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                caregiver@demo.com
              </p>
            </button>

            {/* Doctor Demo */}
            <button
              type="button"
              onClick={() => {
                setEmail('doctor@demo.com');
                setPassword('demo123');
                
                // Scroll to login form
                setTimeout(() => scrollToLoginForm(), 100);
                
                toast.info('Demo Doctor filled - Fictional data', {
                  description: 'Credentials auto-filled. Scroll up to Sign In button.',
                  duration: 4000,
                });
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all touch-manipulation ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 hover:border-purple-500 hover:bg-slate-700'
                  : 'bg-white border-slate-200 hover:border-purple-400 hover:bg-purple-50'
              }`}
              disabled={loading}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Doctor
                </span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                doctor@demo.com
              </p>
            </button>
          </div>
          
          {/* Demo Data Disclaimer */}
          <div className={`mt-4 p-3 rounded-xl flex items-start gap-2 ${
            darkMode ? 'bg-amber-950/30 border border-amber-800' : 'bg-amber-50 border border-amber-200'
          }`}>
            <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              darkMode ? 'text-amber-400' : 'text-amber-600'
            }`} />
            <p className={`text-xs leading-relaxed ${
              darkMode ? 'text-amber-200' : 'text-amber-700'
            }`}>
              <strong>Demo Mode:</strong> All data is fictional and for demonstration only. No real patient information. GDPR/HIPAA compliant - no real user data displayed.
            </p>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentPage('signup')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        </motion.div>
      </div>
      </div>
    </TooltipProvider>
  );
}