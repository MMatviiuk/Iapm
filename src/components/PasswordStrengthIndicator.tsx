import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  darkMode?: boolean;
}

export default function PasswordStrengthIndicator({ password, darkMode = false }: PasswordStrengthIndicatorProps) {
  const requirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
    { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Contains lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Contains special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const metRequirements = requirements.filter(req => req.test(password));
  const strength = metRequirements.length;
  
  const getStrengthLabel = () => {
    if (strength === 0) return { label: 'Very Weak', color: 'text-red-600 dark:text-red-400' };
    if (strength <= 2) return { label: 'Weak', color: 'text-orange-600 dark:text-orange-400' };
    if (strength <= 3) return { label: 'Fair', color: 'text-amber-600 dark:text-amber-400' };
    if (strength === 4) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400' };
    return { label: 'Strong', color: 'text-green-600 dark:text-green-400' };
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="space-y-4">
      {/* Strength Bar */}
      {password.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-base font-medium ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Password Strength:
            </span>
            <span className={`text-base font-bold ${strengthInfo.color}`}>
              {strengthInfo.label}
            </span>
          </div>
          <div className="flex gap-2 h-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  index < strength
                    ? strength <= 2
                      ? 'bg-red-500'
                      : strength === 3
                      ? 'bg-amber-500'
                      : strength === 4
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                    : darkMode
                    ? 'bg-slate-700'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Requirements List */}
      {password.length > 0 && (
        <div className="space-y-2">
          <p className={`text-sm font-medium ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Password must contain:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {requirements.map((req, index) => {
              const isMet = req.test(password);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  {isMet ? (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                  )}
                  <span className={`text-base ${
                    isMet
                      ? 'text-green-700 dark:text-green-400 line-through'
                      : darkMode
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
