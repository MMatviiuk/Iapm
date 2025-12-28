import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Lock, 
  Check,
  Loader2,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PillShieldLogo } from './PillShieldLogo';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface ResetPasswordProps {
  token?: string; // From URL params
  setCurrentPage: (page: string) => void;
  darkMode: boolean;
}

export default function ResetPassword({ 
  token,
  setCurrentPage, 
  darkMode 
}: ResetPasswordProps) {
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
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
      // await api.resetPassword(token, newPassword);
      
      setResetSuccess(true);
      
      toast.success('Password reset successfully!', {
        description: 'You can now sign in with your new password',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        setCurrentPage('login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Failed to reset password', {
        description: error?.message || 'The reset link may have expired',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const isStrongPassword = getPasswordStrength(newPassword) >= 4;

  if (resetSuccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 ${
        darkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-white to-slate-50'
      }`}>
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-10 rounded-3xl border-2 shadow-2xl text-center ${
              darkMode 
                ? 'bg-slate-900 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <h2 className={`text-3xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Password Reset Complete!
            </h2>
            
            <p className={`text-lg mb-6 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Your password has been successfully reset. Redirecting you to sign in...
            </p>

            <Button
              onClick={() => setCurrentPage('login')}
              className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Go to Sign In
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

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
            Create New Password
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Choose a strong password to secure your account
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
          <form onSubmit={handleSubmit} className="space-y-6 px-1">
            {/* New Password */}
            <div>
              <Label htmlFor="newPassword" className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-14 text-base pr-12"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  disabled={loading}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {newPassword && <PasswordStrengthIndicator password={newPassword} />}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-14 text-base pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && (
                <>
                  {newPassword !== confirmPassword ? (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      Passwords do not match
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Passwords match
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Password Requirements */}
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'
            }`}>
              <p className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Password must contain:
              </p>
              <ul className="space-y-1 text-sm">
                <li className={`flex items-center gap-2 ${
                  newPassword.length >= 8 
                    ? 'text-green-600 dark:text-green-400' 
                    : darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {newPassword.length >= 8 ? <Check className="w-4 h-4" /> : <span className="w-4 h-4"></span>}
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-2 ${
                  /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)
                    ? 'text-green-600 dark:text-green-400' 
                    : darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? <Check className="w-4 h-4" /> : <span className="w-4 h-4"></span>}
                  Upper and lowercase letters
                </li>
                <li className={`flex items-center gap-2 ${
                  /[0-9]/.test(newPassword)
                    ? 'text-green-600 dark:text-green-400' 
                    : darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {/[0-9]/.test(newPassword) ? <Check className="w-4 h-4" /> : <span className="w-4 h-4"></span>}
                  At least one number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all group"
              disabled={loading || !isStrongPassword || newPassword !== confirmPassword}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            {/* Security Badge */}
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              darkMode ? 'bg-green-950/30 border border-green-800' : 'bg-green-50 border border-green-200'
            }`}>
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                Your password is encrypted and secure. We never store passwords in plain text.
              </p>
            </div>
          </form>
        </motion.div>

        {/* Back to Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Remember your password?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
