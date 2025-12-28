import { useRef, useState } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { processPhoto, createPhotoPreview } from '../utils/photoUtils';

interface PhotoUploaderProps {
  darkMode: boolean;
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function PhotoUploader({
  darkMode,
  currentPhoto,
  onPhotoChange,
  label = 'Profile Photo',
  disabled = false,
  size = 'medium'
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null);

  const sizeClasses = {
    small: 'w-16 h-16 sm:w-20 sm:h-20',
    medium: 'w-24 h-24 sm:w-28 sm:h-28',
    large: 'w-32 h-32 sm:w-36 sm:h-36'
  };

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  const handlePhotoClick = () => {
    if (disabled || uploading) return;
    
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
      setUploading(true);
      
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      // Process photo (resize, compress)
      const processedBlob = await processPhoto(file);
      
      // Create preview URL
      const preview = createPhotoPreview(processedBlob);
      setPreviewUrl(preview);

      // For now, store as base64 in localStorage
      // In production, this would upload to backend
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onPhotoChange(base64String);
        
        toast.success('Photo uploaded successfully', {
          description: 'Your photo has been updated',
          duration: 2000,
        });
      };
      reader.readAsDataURL(processedBlob);

    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast.error('Upload failed', {
        description: error.message || 'Failed to upload photo. Please try again.',
        duration: 3000,
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <label className={`text-base sm:text-lg font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-900'
        }`}>
          {label}
        </label>
      )}
      
      {/* Photo Container */}
      <div className="relative">
        <div
          onClick={handlePhotoClick}
          className={`${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer transition-all duration-200 ${
            disabled || uploading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-90 hover:scale-105 active:scale-95'
          } ${
            darkMode
              ? 'bg-gray-700 border-2 border-gray-600'
              : 'bg-gray-100 border-2 border-gray-300'
          }`}
        >
          {uploading ? (
            <div className={`w-full h-full flex items-center justify-center ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <Loader2 className={`${iconSizes[size]} animate-spin ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Camera className={`${iconSizes[size]} ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          )}
        </div>

        {/* Upload Icon Badge */}
        {!uploading && (
          <button
            type="button"
            onClick={handlePhotoClick}
            disabled={disabled}
            className={`absolute bottom-0 right-0 ${
              size === 'small' ? 'w-8 h-8' : size === 'medium' ? 'w-10 h-10' : 'w-12 h-12'
            } rounded-full flex items-center justify-center shadow-lg transition-all ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-110 active:scale-95'
            } ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <Upload className={`${
              size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-5 h-5' : 'w-6 h-6'
            } text-white`} />
          </button>
        )}
      </div>

      {/* Helper Text */}
      <p className={`text-xs sm:text-sm text-center max-w-xs ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Click to upload a photo
        <br />
        <span className="text-xs">Maximum size: 5MB</span>
      </p>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  );
}
