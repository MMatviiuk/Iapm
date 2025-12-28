import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, ArrowLeft, Mail, Send, CheckCircle2, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { TooltipProvider } from './ui/tooltip';
import { FieldWithTooltip } from './FieldWithTooltip';
import { toast } from 'sonner';

interface AddPatientProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  onInvite?: (invitation: any) => void;
}

export default function AddPatient({ 
  darkMode, 
  setCurrentPage,
  onInvite 
}: AddPatientProps) {
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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
      // TODO: Call API to send invitation
      // const response = await api.invitePatient(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const invitation = {
        id: `inv_${Date.now()}`,
        ...formData,
        sentAt: new Date().toISOString(),
      };

      if (onInvite) {
        onInvite(invitation);
      }

      setInviteSent(true);
      toast.success(`Invitation sent to ${formData.email}`);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setCurrentPage('doctor');
      }, 2000);
    } catch (error: any) {
      console.error('Failed to send invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (inviteSent) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>
          
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Invitation Sent!
          </h2>
          
          <p className={`text-base sm:text-lg mb-6 ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {formData.firstName} {formData.lastName} will receive an email at {formData.email} with instructions to join your practice.
          </p>

          <Button
            onClick={() => setCurrentPage('doctor')}
            className="h-14 px-8 text-base bg-purple-600 hover:bg-purple-700"
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

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
            onClick={() => setCurrentPage('doctor')}
            variant="ghost"
            className="mb-4 -ml-2 h-12"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
              <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Invite Patient
              </h1>
              <p className={`text-base sm:text-lg ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Send an invitation to add a patient to your practice
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
              
              {/* Email */}
              <div>
                <FieldWithTooltip
                  label="Patient Email"
                  tooltip="<strong>Enter the patient's email address.</strong><br/><br/><strong>What happens:</strong><br/>• They receive an invitation email<br/>• Can create a new account or link existing<br/>• Must consent to share data with you<br/><br/>💡 Make sure the email is correct - they need to access it."
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
                  placeholder="patient@example.com"
                  className={`h-14 text-base ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                <p className={`text-sm mt-2 ${
                  darkMode ? 'text-slate-500' : 'text-slate-500'
                }`}>
                  An invitation will be sent to this email address
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <FieldWithTooltip
                    label="First Name"
                    tooltip="<strong>Patient's first name</strong> (given name).<br/><br/>This will appear in your patient list and helps you identify them quickly.<br/><br/><strong>Examples:</strong><br/>• John<br/>• Mary<br/>• Robert"
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
                    tooltip="<strong>Patient's last name</strong> (family name).<br/><br/>This will appear in your patient list along with first name.<br/><br/><strong>Examples:</strong><br/>• Smith<br/>• Johnson<br/>• Williams"
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

              {/* Message */}
              <div>
                <FieldWithTooltip
                  label="Personal Message (Optional)"
                  tooltip="<strong>Add a personal note</strong> to your invitation email.<br/><br/><strong>Examples:</strong><br/>• 'Looking forward to working with you!'<br/>• 'Welcome to our practice'<br/>• 'This will help us track your medications better'<br/><br/>✅ <strong>Optional:</strong> The invitation will be sent without this if blank."
                  required={false}
                  htmlFor="message"
                  darkMode={darkMode}
                  className="mb-2 block"
                />
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Add a personal message to your invitation..."
                  rows={4}
                  className="text-base resize-none"
                />
                <p className={`text-sm mt-2 ${
                  darkMode ? 'text-slate-500' : 'text-slate-500'
                }`}>
                  This message will be included in the invitation email
                </p>
              </div>

              {/* Info Card */}
              <Card className={`p-4 border-2 ${
                darkMode 
                  ? 'bg-purple-950/20 border-purple-800' 
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <div className="flex gap-3">
                  <Mail className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                  <div>
                    <p className={`text-base font-semibold mb-1 ${
                      darkMode ? 'text-purple-300' : 'text-purple-900'
                    }`}>
                      What happens next?
                    </p>
                    <ul className={`text-sm space-y-1 ${
                      darkMode ? 'text-purple-400' : 'text-purple-700'
                    }`}>
                      <li>• The patient will receive an email invitation</li>
                      <li>• They can create an account or link an existing one</li>
                      <li>• You'll be able to view their medications and track adherence</li>
                      <li>• They retain full control of their health data</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* HIPAA Notice */}
              <Card className={`p-4 border-2 ${
                darkMode 
                  ? 'bg-blue-950/20 border-blue-800' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex gap-3">
                  <Stethoscope className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className={`text-base font-semibold mb-1 ${
                      darkMode ? 'text-blue-300' : 'text-blue-900'
                    }`}>
                      HIPAA Compliance
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-blue-400' : 'text-blue-700'
                    }`}>
                      All patient data is encrypted and HIPAA compliant. Patients must consent to share their information with you before you can access their records.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentPage('doctor')}
                  disabled={loading}
                  className="h-14 px-6 text-base flex-1 border-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-6 text-base flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Invitation
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
