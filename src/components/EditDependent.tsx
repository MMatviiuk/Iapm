import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, ArrowLeft, Check, UserPen } from 'lucide-react';
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

interface EditDependentProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  dependent: any;
  onSave?: (dependent: any) => void;
}

export default function EditDependent({ 
  darkMode, 
  setCurrentPage,
  dependent,
  onSave 
}: EditDependentProps) {
  
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | '',
    relationship: '',
    photoUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Load dependent data on mount
  useEffect(() => {
    if (dependent) {
      // Parse name if it's in "FirstName LastName" format
      const nameParts = dependent.name ? dependent.name.split(' ') : [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData({
        id: dependent.id || '',
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dependent.dateOfBirth || '',
        gender: dependent.gender?.toLowerCase() || '',
        relationship: dependent.relationship || '',
        photoUrl: dependent.photoUrl || '',
      });
    }
  }, [dependent]);

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
      // TODO: Call API to update dependent
      // const response = await api.updateDependent(formData.id, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedDependent = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
      };

      if (onSave) {
        onSave(updatedDependent);
      }

      toast.success(`${formData.firstName} ${formData.lastName} updated successfully`);
      setCurrentPage('dependent-details');
    } catch (error: any) {
      console.error('Failed to update dependent:', error);
      toast.error(error.message || 'Failed to update dependent');
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
            onClick={() => setCurrentPage('dependent-details')}
            variant="ghost"
            className="mb-4 -ml-2 h-12"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dependent Details
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
              <UserPen className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Edit Dependent
              </h1>
              <p className={`text-base sm:text-lg ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Update {formData.firstName || 'dependent'} information
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
                <Label className={`text-base mb-2 block ${
                  darkMode ? 'text-slate-200' : 'text-slate-900'
                }`}>
                  Profile Photo
                </Label>
                <PhotoUploader
                  currentPhotoUrl={formData.photoUrl}
                  onPhotoChange={(url) => setFormData({ ...formData, photoUrl: url })}
                  size="large"
                  darkMode={darkMode}
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FieldWithTooltip
                  label="First Name"
                  required
                  tooltip="Enter the dependent's first name"
                  darkMode={darkMode}
                >
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Margaret"
                    className={`h-14 text-lg border-2 ${
                      errors.firstName 
                        ? 'border-red-500 focus:border-red-500' 
                        : darkMode 
                        ? 'border-slate-700 bg-slate-800 text-white' 
                        : 'border-slate-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </FieldWithTooltip>

                <FieldWithTooltip
                  label="Last Name"
                  required
                  tooltip="Enter the dependent's last name"
                  darkMode={darkMode}
                >
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Williams"
                    className={`h-14 text-lg border-2 ${
                      errors.lastName 
                        ? 'border-red-500 focus:border-red-500' 
                        : darkMode 
                        ? 'border-slate-700 bg-slate-800 text-white' 
                        : 'border-slate-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </FieldWithTooltip>
              </div>

              {/* Date of Birth */}
              <FieldWithTooltip
                label="Date of Birth"
                required
                tooltip="Select the dependent's date of birth. Age will be calculated automatically."
                darkMode={darkMode}
              >
                <DateOfBirthPicker
                  value={formData.dateOfBirth}
                  onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                  darkMode={darkMode}
                  error={errors.dateOfBirth}
                />
              </FieldWithTooltip>

              {/* Gender */}
              <FieldWithTooltip
                label="Gender"
                required
                tooltip="Select the dependent's gender"
                darkMode={darkMode}
              >
                <Select
                  value={formData.gender}
                  onValueChange={(value: 'male' | 'female') => 
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger className={`h-14 text-lg border-2 ${
                    errors.gender 
                      ? 'border-red-500' 
                      : darkMode 
                      ? 'border-slate-700 bg-slate-800 text-white' 
                      : 'border-slate-300'
                  }`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male" className="text-lg py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">♂</span>
                        <span>Male</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="female" className="text-lg py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">♀</span>
                        <span>Female</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </FieldWithTooltip>

              {/* Relationship */}
              <FieldWithTooltip
                label="Relationship"
                required
                tooltip="Describe your relationship to this person (e.g., Mother, Father, Child)"
                darkMode={darkMode}
              >
                <Input
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="e.g. Mother, Father, Child"
                  className={`h-14 text-lg border-2 ${
                    errors.relationship 
                      ? 'border-red-500 focus:border-red-500' 
                      : darkMode 
                      ? 'border-slate-700 bg-slate-800 text-white' 
                      : 'border-slate-300'
                  }`}
                />
                {errors.relationship && (
                  <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>
                )}
              </FieldWithTooltip>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentPage('dependent-details')}
                  className={`h-14 flex-1 text-lg border-2 ${
                    darkMode 
                      ? 'border-slate-700 hover:bg-slate-800' 
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-14 flex-1 text-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
      </div>
    </TooltipProvider>
  );
}
