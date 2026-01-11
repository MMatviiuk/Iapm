import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, ArrowLeft, Check, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TooltipProvider } from './ui/tooltip';
import { FieldWithTooltip } from './FieldWithTooltip';
import { toast } from 'sonner';
import DateOfBirthPicker from './DateOfBirthPicker';
import PhotoUploader from './PhotoUploader';
import api from '../services/api';

interface AddDependentProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  onAdd?: (dependent: any) => void;
}

export default function AddDependent({ 
  darkMode, 
  setCurrentPage,
  onAdd 
}: AddDependentProps) {
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | '',
    relationship: '',
    photoUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Перевірка форми
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Імʼя обовʼязкове";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Прізвище обовʼязкове';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email обовʼязковий';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Дата народження обовʼязкова';
    }
    if (!formData.gender) {
      newErrors.gender = 'Стать обовʼязкова';
    }
    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Стосунок обовʼязковий';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Надсилання форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Заповніть усі обовʼязкові поля');
      return;
    }

    setLoading(true);

    try {
      const response = await api.addDependent({
        patientEmail: formData.email,
        relationship: formData.relationship,
      });
      
      const newDependent = {
        id: response?.id || `dep_${Date.now()}`,
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
      };

      if (onAdd) {
        onAdd(newDependent);
      }

      toast.success(`${formData.firstName} ${formData.lastName} додано як підопічного`);
      setCurrentPage('caregiver');
    } catch (error: any) {
      console.error('Failed to add dependent:', error);
      toast.error(error.message || 'Не вдалося додати підопічного');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen ${
        darkMode ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Button
            onClick={() => setCurrentPage('caregiver')}
            variant="ghost"
            className="mb-4 -ml-2 h-12"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад до панелі
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
              <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Додати підопічного
              </h1>
              <p className={`text-base sm:text-lg ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Додайте людину, про яку будете дбати
              </p>
            </div>
          </div>
        </motion.div>

        {/* Форма */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`p-6 sm:p-8 border-2 ${
            darkMode 
              ? 'bg-slate-900 border-slate-800' 
              : 'bg-white border-slate-200'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Фото */}
              <div>
                <FieldWithTooltip
                  label="Фото профілю (необовʼязково)"
                  tooltip="<strong>Завантажте фото</strong> підопічного.<br/><br/><strong>Переваги:</strong><br/>• Швидка ідентифікація<br/>• Зручно для візитів до лікаря<br/>• Більш персональний профіль<br/><br/><strong>Необовʼязково:</strong> можна пропустити"
                  required={false}
                  darkMode={darkMode}
                  className="mb-3 block"
                />
                <PhotoUploader
                  onPhotoChange={(photoUrl) => setFormData(prev => ({ ...prev, photoUrl }))}
                  currentPhotoUrl={formData.photoUrl}
                  size="large"
                  darkMode={darkMode}
                />
              </div>

              {/* Імʼя та прізвище */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <FieldWithTooltip
                    label="Імʼя"
                    tooltip="<strong>Вкажіть імʼя</strong>.<br/><br/><strong>Приклади:</strong><br/>• Марія<br/>• Олександр<br/>• Ірина<br/>• Андрій"
                    required={true}
                    htmlFor="firstName"
                    darkMode={darkMode}
                    className="mb-2 block"
                  />
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, firstName: e.target.value }));
                      setErrors(prev => ({ ...prev, firstName: '' }));
                    }}
                    placeholder="Введіть імʼя"
                    className={`h-14 text-base ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <FieldWithTooltip
                    label="Прізвище"
                    tooltip="<strong>Вкажіть прізвище</strong>.<br/><br/><strong>Приклади:</strong><br/>• Іваненко<br/>• Петренко<br/>• Ковальчук"
                    required={true}
                    htmlFor="lastName"
                    darkMode={darkMode}
                    className="mb-2 block"
                  />
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, lastName: e.target.value }));
                      setErrors(prev => ({ ...prev, lastName: '' }));
                    }}
                    placeholder="Введіть прізвище"
                    className={`h-14 text-base ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <FieldWithTooltip
                  label="Email пацієнта"
                  tooltip="<strong>Вкажіть email пацієнта</strong>, який вже зареєстрований у додатку."
                  required={true}
                  htmlFor="email"
                  darkMode={darkMode}
                  className="mb-2 block"
                />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="name@example.com"
                  className={`h-14 text-base ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Дата народження */}
              <div>
                <FieldWithTooltip
                  label="Дата народження"
                  tooltip="<strong>Оберіть дату народження.</strong><br/><br/><strong>Навіщо це потрібно:</strong><br/>• Точніші рекомендації<br/>• Коректна аналітика здоровʼя<br/>• Нагадування про день народження"
                  required={true}
                  darkMode={darkMode}
                  className="mb-2 block"
                />
                <DateOfBirthPicker
                  value={formData.dateOfBirth}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, dateOfBirth: date }));
                    setErrors(prev => ({ ...prev, dateOfBirth: '' }));
                  }}
                  darkMode={darkMode}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* Стать */}
              <div>
                <FieldWithTooltip
                  label="Стать"
                  tooltip="<strong>Оберіть стать.</strong><br/><br/><strong>Навіщо це потрібно:</strong><br/>• Деякі ліки залежать від статі<br/>• Персоналізована аналітика"
                  required={true}
                  htmlFor="gender"
                  darkMode={darkMode}
                  className="mb-2 block"
                />
                <Select
                  value={formData.gender}
                  onValueChange={(value: 'male' | 'female') => {
                    setFormData(prev => ({ ...prev, gender: value }));
                    setErrors(prev => ({ ...prev, gender: '' }));
                  }}
                >
                  <SelectTrigger className={`h-14 text-base ${errors.gender ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Оберіть стать" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male" className="text-base py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">♂</span>
                        <span>Чоловіча</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="female" className="text-base py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">♀</span>
                        <span>Жіноча</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>

              {/* Стосунок */}
              <div>
                <FieldWithTooltip
                  label="Стосунок"
                  tooltip="<strong>Ваш стосунок</strong> до цієї людини."
                  required={true}
                  htmlFor="relationship"
                  darkMode={darkMode}
                  className="mb-2 block"
                />
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, relationship: value }));
                    setErrors(prev => ({ ...prev, relationship: '' }));
                  }}
                >
                  <SelectTrigger className={`h-14 text-base ${errors.relationship ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Оберіть стосунок" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent" className="text-base py-3">Батько/мати</SelectItem>
                    <SelectItem value="grandparent" className="text-base py-3">Дідусь/бабуся</SelectItem>
                    <SelectItem value="spouse" className="text-base py-3">Чоловік/дружина</SelectItem>
                    <SelectItem value="sibling" className="text-base py-3">Брат/сестра</SelectItem>
                    <SelectItem value="child" className="text-base py-3">Дитина</SelectItem>
                    <SelectItem value="friend" className="text-base py-3">Друг/подруга</SelectItem>
                    <SelectItem value="other" className="text-base py-3">Інше</SelectItem>
                  </SelectContent>
                </Select>
                {errors.relationship && (
                  <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>
                )}
              </div>

              {/* Інформація */}
              <Card className={`p-4 border-2 ${
                darkMode 
                  ? 'bg-orange-950/20 border-orange-800' 
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex gap-3">
                  <Users className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    darkMode ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                  <div>
                    <p className={`text-base font-semibold mb-1 ${
                      darkMode ? 'text-orange-300' : 'text-orange-900'
                    }`}>
                      Доступ підопічного
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-orange-400' : 'text-orange-700'
                    }`}>
                      Ви зможете керувати ліками та відстежувати дотримання для цієї людини. Пацієнт також може користуватися власним акаунтом.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Кнопки */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentPage('caregiver')}
                  disabled={loading}
                  className="h-14 px-6 text-base flex-1 border-2"
                >
                  Скасувати
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-6 text-base flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Додаємо...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Додати підопічного
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Довідка */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-center text-sm mt-6 ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
          * Обовʼязкові поля
        </motion.p>
      </div>
      </div>
    </TooltipProvider>
  );
}
