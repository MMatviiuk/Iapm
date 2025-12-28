/**
 * Photo utilities for generating user profile photos
 * Uses Unsplash for realistic photos based on age, gender, and name
 */

interface PhotoParams {
  firstName: string;
  lastName?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  role?: 'patient' | 'caregiver' | 'doctor';
}

/**
 * Generate a realistic photo URL for a user
 * Uses consistent photo based on name/email seed
 */
export function generateUserPhoto({ firstName, lastName, age, gender, role }: PhotoParams): string {
  // Create a seed from name for consistency
  const seed = `${firstName}-${lastName || ''}-${age || ''}${gender || ''}`.toLowerCase().replace(/\s/g, '-');
  
  // For consistent photos, we use the seed as a query parameter
  // This ensures the same person always gets the same photo
  const width = 400;
  const height = 400;
  
  // Determine search query based on demographics
  let query = 'portrait';
  
  if (role === 'doctor') {
    query = 'doctor professional portrait';
  } else {
    // Determine age group
    if (age) {
      if (age >= 65) {
        query = gender === 'Male' ? 'elderly man portrait' : 'elderly woman portrait';
      } else if (age >= 45) {
        query = gender === 'Male' ? 'middle aged man portrait' : 'middle aged woman portrait';
      } else {
        query = gender === 'Male' ? 'man portrait' : 'woman portrait';
      }
    } else {
      query = gender === 'Male' ? 'man portrait' : gender === 'Female' ? 'woman portrait' : 'person portrait';
    }
  }
  
  // Use Unsplash Source API with seed
  // Format: https://source.unsplash.com/WIDTHxHEIGHT/?QUERY&sig=SEED
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}&sig=${seed}`;
}

/**
 * Get initials from name for fallback
 */
export function getInitials(firstName: string, lastName?: string): string {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
  return firstInitial + lastInitial;
}

/**
 * Get full name from user data
 */
export function getFullName(firstName: string, lastName?: string): string {
  return `${firstName}${lastName ? ' ' + lastName : ''}`.trim();
}

/**
 * Get role color (softer orange for caregiver)
 */
export function getRoleColor(role: string): { border: string; bg: string; text: string } {
  switch (role) {
    case 'patient':
    case 'myself':
      return {
        border: '#2196F3',
        bg: '#E3F2FD',
        text: '#1976D2'
      };
    case 'caregiver':
      return {
        border: '#FB923C', // Softer orange (was #F97316)
        bg: '#FFF7ED',
        text: '#EA580C'
      };
    case 'doctor':
      return {
        border: '#9333EA',
        bg: '#F3E8FF',
        text: '#7C3AED'
      };
    default:
      return {
        border: '#9CA3AF',
        bg: '#F3F4F6',
        text: '#6B7280'
      };
  }
}

/**
 * Process photo: resize and compress for optimal upload
 * @param file - The image file to process
 * @param maxWidth - Maximum width (default: 800px)
 * @param maxHeight - Maximum height (default: 800px)
 * @param quality - JPEG quality 0-1 (default: 0.85)
 * @returns Processed blob
 */
export async function processPhoto(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw image with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          file.type.startsWith('image/png') ? 'image/png' : 'image/jpeg',
          quality
        );
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Create a preview URL from a blob
 * Remember to revoke this URL when done to free memory
 * @param blob - The image blob
 * @returns Object URL for preview
 */
export function createPhotoPreview(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Revoke a preview URL to free memory
 * @param url - The preview URL to revoke
 */
export function revokePhotoPreview(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
