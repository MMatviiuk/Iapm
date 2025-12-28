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
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | '',
    relationship: '',
    photoUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // TODO: Call API to add dependent
      // const response = await api.addDependent(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDependent = {
        id: `dep_${Date.now()}`,
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
      };

      if (onAdd) {
        onAdd(newDependent);
      }

      toast.success(`${formData.firstName} ${formData.lastName} added as dependent`);
      setCurrentPage('caregiver');
    } catch (error: any) {
      console.error('Failed to add dependent:', error);
      toast.error(error.message || 'Failed to add dependent');
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
        
        {/* Header */}
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
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
              <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Add Dependent
              </h1>
              <p className={`text-base sm:text-lg ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Add a family member you'll be caring for
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
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
              
              {/* Photo Upload */}
              <div>
                <FieldWithTooltip
                  label="Profile Photo (Optional)"
                  tooltip="<strong>Upload a photo</strong> of your dependent.<br/><br/><strong>Benefits:</strong><br/>• Helps you quickly identify them<br/>• Useful for medical visits<br/>• Personal touch to their profile<br/><br/>✅ <strong>Optional:</strong> Skip if you don't have a photo"
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

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <FieldWithTooltip
                    label="First Name"
                    tooltip="<strong>Enter their first name</strong> (given name).<br/><br/><strong>Examples:</strong><br/>• Margaret<br/>• John<br/>• Mary<br/>• Robert"
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
                    placeholder="Enter first name"
                    className={`h-14 text-base ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <FieldWithTooltip
                    label="Last Name"
                    tooltip="<strong>Enter their last name</strong> (family name).<br/><br/><strong>Examples:</strong><br/>• Williams<br/>• Smith<br/>• Johnson<br/>• Brown"
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
                    placeholder="Enter last name"
                    className={`h-14 text-base ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <FieldWithTooltip
                  label="Date of Birth"
                  tooltip="<strong>Select their date of birth.</strong><br/><br/><strong>Why we need this:</strong><br/>• Age-specific medication recommendations<br/>• Accurate health tracking<br/>• Birthday reminders<br/><br/>💡 Use the dropdowns to select day, month, and year."
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

              {/* Gender */}
              <div>
                <FieldWithTooltip
                  label="Gender"
                  tooltip="<strong>Select their gender.</strong><br/><br/><strong>Why we need this:</strong><br/>• Some medications differ by gender<br/>• Profile photo suggestions<br/>• Personalized health insights<br/><br/>Choose ♂ Male or ♀ Female."
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
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male" className="text-base py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">♂</span>
                        <span>Male</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="female" className="text-base py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">♀</span>
                        <span>Female</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>

              {/* Relationship */}
              <div>
                <FieldWithTooltip
                  label="Relationship"
                  tooltip="<strong>Your relationship</strong> to this person.<br/><br/><strong>Options:</strong><br/>• Parent<br/>• Grandparent<br/>• Spouse<br/>• Sibling<br/>• Child<br/>• Friend<br/>• Other<br/><br/>💡 This helps us understand your caregiving role."
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
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent" className="text-base py-3">Parent</SelectItem>
                    <SelectItem value="grandparent" className="text-base py-3">Grandparent</SelectItem>
                    <SelectItem value="spouse" className="text-base py-3">Spouse</SelectItem>
                    <SelectItem value="sibling" className="text-base py-3">Sibling</SelectItem>
                    <SelectItem value="child" className="text-base py-3">Child</SelectItem>
                    <SelectItem value="friend" className="text-base py-3">Friend</SelectItem>
                    <SelectItem value="other" className="text-base py-3">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.relationship && (
                  <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>
                )}
              </div>

              {/* Info Card */}
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
                      Dependent Access
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-orange-400' : 'text-orange-700'
                    }`}>
                      You'll be able to manage medications and track adherence for this person. They can also use their own account to view their schedule.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentPage('caregiver')}
                  disabled={loading}
                  className="h-14 px-6 text-base flex-1 border-2"
                >
                  Cancel
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
                      Adding...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Add Dependent
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-center text-sm mt-6 ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
          * Required fields
        </motion.p>
      </div>
      </div>
    </TooltipProvider>
  );
}
