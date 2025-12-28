import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mail, 
  Check,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PillShieldLogo } from './PillShieldLogo';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
  darkMode: boolean;
}

export default function EmailVerification({ 
  email,
  onVerified,
  onBack,
  darkMode 
}: EmailVerificationProps) {
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer === 0) return;
    
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Only allow 6-digit codes
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Please paste a valid 6-digit code');
      return;
    }

    const newCode = pastedData.split('');
    setCode(newCode);
    inputRefs.current[5]?.focus();
    
    // Auto-verify
    handleVerify(pastedData);
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would call:
      // await api.verifyEmail(email, codeToVerify);
      
      toast.success('Email verified successfully!');
      
      // Wait a bit before calling onVerified
      setTimeout(() => {
        onVerified();
      }, 500);
      
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error('Invalid verification code', {
        description: 'Please check your code and try again',
      });
      
      // Clear the code
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would call:
      // await api.resendVerificationEmail(email);
      
      setResendTimer(60);
      toast.success('Verification code resent!', {
        description: 'Check your email inbox',
      });
      
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error('Failed to resend code');
    } finally {
      setLoading(false);
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
            Verify Your Email
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We sent a 6-digit code to
          </p>
          <p className={`text-lg font-medium mt-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {email}
          </p>
        </motion.div>

        {/* Verification Card */}
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
          <div className="space-y-6">
            {/* Code Input */}
            <div>
              <label className={`block text-center mb-4 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Enter Verification Code
              </label>
              <div 
                className="flex gap-3 justify-center"
                onPaste={handlePaste}
              >
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-14 h-16 text-center text-2xl font-bold ${
                      digit ? 'border-blue-500' : ''
                    }`}
                    disabled={loading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <Button
              type="button"
              onClick={() => handleVerify()}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all group"
              disabled={loading || code.some(d => !d)}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <Check className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className={`text-base mb-3 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="outline"
                className="h-12 px-6 border-2"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? (
                  `Resend in ${resendTimer}s`
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            {/* Info Box */}
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-blue-950/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                <strong>Can't find the email?</strong> Check your spam folder. 
                The code expires in 10 minutes.
              </p>
            </div>

            {/* Back Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="ghost"
                className="w-full h-12"
                onClick={onBack}
                disabled={loading}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </div>
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
