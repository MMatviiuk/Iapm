import { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit2, Camera, Save, Upload, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import api from '../services/api';

interface ProfileProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  currentUser: any; // ✅ ADD: Receive current user from App.tsx
  setDarkMode: (value: boolean) => void;
}

export default function Profile({ darkMode, setCurrentPage, currentUser, setDarkMode }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    avatar: '',
    role: 'patient',
    medicationCount: 0,
    memberSince: '',
  });

  // Load user profile on mount
  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]); // ✅ FIX: Watch currentUser changes

  const loadProfile = async () => {
    if (!currentUser) {
      console.warn('⚠️ Profile: currentUser is undefined');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // ✅ FIX: Use currentUser from props instead of API call!
      const user = currentUser;
      
      // Load additional profile data from localStorage or API
      const storedProfile = localStorage.getItem('userProfile');
      const profileExtras = storedProfile ? JSON.parse(storedProfile) : {};
      
      // CRITICAL FIX: Load medications from API to get correct count
      let medicationCount = 0;
      try {
        const medications = await api.getMedications();
        // Count only ACTIVE medications (not scheduled, not completed, not deleted)
        medicationCount = medications.filter((med: any) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const startDate = med.startDate ? new Date(med.startDate) : null;
          const endDate = med.endDate ? new Date(med.endDate) : null;
          
          if (startDate) startDate.setHours(0, 0, 0, 0);
          if (endDate) endDate.setHours(0, 0, 0, 0);
          
          // Active = started AND not ended AND not deleted
          const hasStarted = !startDate || startDate <= today;
          const hasNotEnded = !endDate || endDate >= today;
          const notDeleted = !med.deletedAt;
          
          return hasStarted && hasNotEnded && notDeleted;
        }).length;
      } catch (error) {
        console.error('Failed to load medications count:', error);
        // Fallback to stored count
        medicationCount = profileExtras.medicationCount || 0;
      }
      
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: profileExtras.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: profileExtras.address || '',
        // CRITICAL FIX: Use user.photoUrl (NOT hardcoded fallback!)
        avatar: user.photoUrl || profileExtras.avatar || '',
        role: user.role || 'patient',
        medicationCount: medicationCount,
        memberSince: profileExtras.memberSince || 'January 2025',
      });
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile', {
        description: 'Please try again',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      // Update profile via API
      await api.updateProfile({
        name: profileData.name,
        email: profileData.email,
        dateOfBirth: profileData.dateOfBirth,
      });

      // Save extended profile data to localStorage
      localStorage.setItem('userProfile', JSON.stringify({
        phone: profileData.phone,
        address: profileData.address,
        avatar: profileData.avatar,
        medicationCount: profileData.medicationCount,
        memberSince: profileData.memberSince,
      }));

      setIsEditing(false);
      
      toast.success('Profile updated successfully', {
        description: 'Your changes have been saved',
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save changes', {
        description: error.message || 'Please try again',
        duration: 3000,
      });
    }
  };

  const handleAvatarClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select an image file (JPG, PNG, etc.)',
        duration: 3000,
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'Please select an image smaller than 5MB',
        duration: 3000,
      });
      return;
    }

    try {
      setUploadingPhoto(true);
      
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      // Upload photo to API
      const response = await api.uploadPhoto(file);
      
      if (response.success) {
        // Update profile data with new avatar URL
        const updatedProfile = {
          ...profileData,
          avatar: response.url,
        };
        setProfileData(updatedProfile);

        // Save to localStorage immediately
        localStorage.setItem('userProfile', JSON.stringify({
          phone: updatedProfile.phone,
          address: updatedProfile.address,
          avatar: response.url,
          medicationCount: updatedProfile.medicationCount,
          memberSince: updatedProfile.memberSince,
        }));

        toast.success('Photo uploaded successfully', {
          description: 'Your profile photo has been updated',
          duration: 2000,
        });
      }
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast.error('Upload failed', {
        description: error.message || 'Failed to upload photo. Please try again.',
        duration: 3000,
      });
    } finally {
      setUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
        <div className={`shadow-sm sticky top-0 z-10 px-4 sm:px-6 py-4 sm:py-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-xl sm:text-2xl font-semibold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              My Profile
            </h1>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
          <div className={`rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col items-center mb-8">
              <div className={`w-32 h-32 md:w-36 md:h-36 rounded-full animate-pulse mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className={`h-8 w-48 rounded animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className={`h-5 w-24 rounded animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className={`h-14 w-full rounded-lg animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
      <div className={`shadow-sm sticky top-0 z-10 px-4 sm:px-6 py-4 sm:py-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className={`text-xl sm:text-2xl font-semibold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              My Profile
            </h1>
            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                  if ('vibrate' in navigator) navigator.vibrate(30);
                }
              }}
              className={`px-6 sm:px-7 py-3 sm:py-4 rounded-lg transition-all font-semibold text-lg sm:text-xl touch-manipulation min-h-[56px] leading-tight ${
                isEditing
                  ? 'bg-[#2196F3] text-white hover:bg-[#1976D2]'
                  : darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              <span className="flex items-center gap-2.5">
                {isEditing ? (
                  <>
                    <Save size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
                    Edit
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="relative">
              <div className={`w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3 sm:mb-4 border-4 border-blue-200 dark:border-blue-800 ${uploadingPhoto ? 'opacity-50' : ''}`}>
                <ImageWithFallback
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
                {uploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
                  </div>
                )}
              </div>
              {isEditing && (
                <>
                  <button
                    onClick={handleAvatarClick}
                    disabled={uploadingPhoto}
                    className="absolute bottom-3 sm:bottom-4 right-0 p-2.5 sm:p-3 bg-[#2196F3] text-white rounded-full shadow-lg hover:bg-[#1976D2] transition-colors touch-manipulation min-w-[48px] min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Change avatar"
                  >
                    {uploadingPhoto ? (
                      <Loader2 size={20} className="sm:w-6 sm:h-6 animate-spin" />
                    ) : (
                      <Camera size={20} className="sm:w-6 sm:h-6" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Upload profile photo"
                  />
                </>
              )}
            </div>
            <h2 className={`text-xl sm:text-2xl md:text-3xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {profileData.name}
            </h2>
            {isEditing && (
              <button
                onClick={handleAvatarClick}
                disabled={uploadingPhoto}
                className={`mt-4 px-6 py-3 rounded-lg transition-all font-semibold text-base sm:text-lg flex items-center gap-2 touch-manipulation min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-200'
                }`}
              >
                {uploadingPhoto ? (
                  <>
                    <Loader2 size={24} className="animate-spin" strokeWidth={2.5} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={24} strokeWidth={2.5} />
                    Upload New Photo
                  </>
                )}
              </button>
            )}
          </div>

          {isEditing && (
            <div className={`mb-6 p-4 sm:p-5 rounded-xl border-2 ${
              darkMode
                ? 'bg-blue-950/20 border-blue-800'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-3">
                <Camera className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} strokeWidth={2.5} />
                <div className="flex-1">
                  <p className={`text-sm sm:text-base font-semibold mb-1 ${
                    darkMode ? 'text-blue-200' : 'text-blue-900'
                  }`}>
                    Photo Guidelines
                  </p>
                  <ul className={`text-xs sm:text-sm space-y-1 ${
                    darkMode ? 'text-blue-300' : 'text-blue-800'
                  }`}>
                    <li>• Use a clear, recent photo of yourself</li>
                    <li>• Accepted formats: JPG, PNG, GIF</li>
                    <li>• Maximum file size: 5MB</li>
                    <li>• Square photos work best</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className={`flex items-center gap-2 sm:gap-3 mb-2 text-base sm:text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <User size={20} className="sm:w-6 sm:h-6" />
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg border-2 text-base sm:text-lg transition-all min-h-[52px] sm:min-h-[56px] ${
                  isEditing
                    ? darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2196F3]'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#2196F3]'
                    : darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#2196F3]`}
              />
            </div>

            <div>
              <label className={`flex items-center gap-2 sm:gap-3 mb-2 text-base sm:text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Mail size={20} className="sm:w-6 sm:h-6" />
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg border-2 text-base sm:text-lg transition-all min-h-[52px] sm:min-h-[56px] ${
                  isEditing
                    ? darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2196F3]'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#2196F3]'
                    : darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#2196F3]`}
              />
            </div>

            <div>
              <label className={`flex items-center gap-2 sm:gap-3 mb-2 text-base sm:text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Phone size={20} className="sm:w-6 sm:h-6" />
                Phone
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg border-2 text-base sm:text-lg transition-all min-h-[52px] sm:min-h-[56px] ${
                  isEditing
                    ? darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2196F3]'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#2196F3]'
                    : darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#2196F3]`}
              />
            </div>

            <div>
              <label className={`flex items-center gap-2 sm:gap-3 mb-2 text-base sm:text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Calendar size={20} className="sm:w-6 sm:h-6" />
                Date of Birth
              </label>
              <input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg border-2 text-base sm:text-lg transition-all min-h-[52px] sm:min-h-[56px] ${
                  isEditing
                    ? darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2196F3]'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#2196F3]'
                    : darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#2196F3]`}
              />
            </div>

            <div>
              <label className={`flex items-center gap-2 sm:gap-3 mb-2 text-base sm:text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <MapPin size={20} className="sm:w-6 sm:h-6" />
                Address
              </label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg border-2 text-base sm:text-lg transition-all min-h-[52px] sm:min-h-[56px] ${
                  isEditing
                    ? darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2196F3]'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#2196F3]'
                    : darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#2196F3]`}
              />
            </div>
          </div>

          <div className={`mt-6 sm:mt-8 pt-6 sm:pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Account Information
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Account Type
                </span>
                <span className={`text-sm sm:text-base font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profileData.role === 'patient' ? 'Patient' : profileData.role}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Member Since
                </span>
                <span className={`text-sm sm:text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profileData.memberSince}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Medications
                </span>
                <span className={`text-sm sm:text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profileData.medicationCount} Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}