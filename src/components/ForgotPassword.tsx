import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mail, 
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PillShieldLogo } from './PillShieldLogo';

interface ForgotPasswordProps {
  setCurrentPage: (page: string) => void;
  darkMode: boolean;
}

export default function ForgotPassword({ 
  setCurrentPage, 
  darkMode 
}: ForgotPasswordProps) {
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState<string>('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would call:
      // await api.sendPasswordResetEmail(email);
      
      setEmailSent(true);
      setResendTimer(60);
      
      toast.success('Reset link sent!', {
        description: 'Check your inbox for password reset instructions',
        duration: 5000,
      });

      // Start countdown
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Failed to send reset email', {
        description: 'Please try again or contact support',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
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
            {emailSent ? 'Check Your Email' : 'Reset Password'}
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {emailSent 
              ? 'We sent you a password reset link'
              : 'Enter your email to reset your password'
            }
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-8 lg:p-10 rounded-3xl border-2 shadow-2xl ${
            darkMode 
              ? 'bg-slate-900 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}
        >
          {!emailSent ? (
            // Email Input Form
            <form onSubmit={handleSubmit} className="space-y-6 px-1">
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
                  className={`h-14 text-base ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  autoFocus
                  autoComplete="email"
                  disabled={loading}
                />
                <p className={`text-sm mt-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  We'll send you a link to reset your password
                </p>
                {error && (
                  <p className="text-sm text-red-500 mt-2">
                    <AlertCircle className="w-4 h-4 mr-1 inline" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all group"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            // Success State
            <div className="space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-3">
                <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  We've sent a password reset link to:
                </p>
                <p className={`text-xl font-medium ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {email}
                </p>
                <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
              </div>

              {/* Instructions */}
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-blue-950/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-sm leading-relaxed ${
                  darkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  <strong>Didn't receive the email?</strong> Check your spam folder or try resending below.
                </p>
              </div>

              {/* Resend Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 text-lg border-2"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? (
                  `Resend in ${resendTimer}s`
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Resend Email
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="ghost"
              className="w-full h-14 text-lg"
              onClick={() => setCurrentPage('login')}
              disabled={loading}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Need help?{' '}
            <button
              onClick={() => toast.info('Support', {
                description: 'Email us at support@prescriptionclarity.com',
                duration: 5000,
              })}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Contact Support
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}