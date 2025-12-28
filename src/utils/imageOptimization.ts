/**
 * IMAGE OPTIMIZATION UTILITIES
 * Helper functions for image optimization and lazy loading
 * 
 * Features:
 * - Base64 blur placeholders
 * - Image compression
 * - Format conversion (WebP, AVIF)
 * - Responsive image generation
 * - Lazy loading helpers
 */

// ==================== BASE64 BLUR PLACEHOLDER ====================

/**
 * Generate tiny base64 blur placeholder for progressive loading
 */
export async function generateBlurPlaceholder(
  imageUrl: string,
  width: number = 10,
  height: number = 10
): Promise<string> {
  try {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Draw scaled-down image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        try {
          const base64 = canvas.toDataURL('image/jpeg', 0.1);
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = reject;
      img.src = imageUrl;
    });
  } catch (error) {
    console.error('[ImageOptimization] Failed to generate blur placeholder:', error);
    return '';
  }
}

// ==================== IMAGE COMPRESSION ====================

/**
 * Compress image to target file size
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 5,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      // Calculate dimensions
      let { width, height } = img;
      const maxDimension = 1920;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Check size
            const sizeMB = blob.size / 1024 / 1024;

            if (sizeMB <= maxSizeMB) {
              resolve(blob);
            } else {
              // Try with lower quality
              const newQuality = Math.max(0.1, quality - 0.1);
              if (newQuality < quality) {
                compressImage(file, maxSizeMB, newQuality).then(resolve).catch(reject);
              } else {
                resolve(blob);
              }
            }
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==================== FORMAT DETECTION ====================

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): boolean {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Check if browser supports AVIF
 */
export async function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * Get best supported image format
 */
export async function getBestImageFormat(): Promise<'avif' | 'webp' | 'jpg'> {
  if (await supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'jpg';
}

// ==================== RESPONSIVE IMAGES ====================

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  format: 'webp' | 'avif' | 'jpg' = 'webp',
  quality: number = 80
): string {
  return widths
    .map((width) => {
      const url = `${baseUrl}?w=${width}&format=${format}&quality=${quality}`;
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(
  breakpoints: Record<string, string> = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
  }
): string {
  return `(max-width: 640px) ${breakpoints.mobile}, (max-width: 1024px) ${breakpoints.tablet}, ${breakpoints.desktop}`;
}

// ==================== LAZY LOADING ====================

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  onLoad?: (element: HTMLImageElement) => void;
}

/**
 * Setup lazy loading for images
 */
export function setupLazyLoading(
  selector: string = 'img[loading="lazy"]',
  options: LazyLoadOptions = {}
): () => void {
  const { rootMargin = '50px', threshold = 0.01, onLoad } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;

          // Load image
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }

          // Load srcset
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }

          // Callback
          img.onload = () => {
            img.classList.add('loaded');
            onLoad?.(img);
          };

          observer.unobserve(img);
        }
      });
    },
    { rootMargin, threshold }
  );

  // Observe all images
  document.querySelectorAll<HTMLImageElement>(selector).forEach((img) => {
    observer.observe(img);
  });

  // Return cleanup function
  return () => observer.disconnect();
}

// ==================== PRELOAD IMAGES ====================

/**
 * Preload critical images
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        })
    )
  );
}

/**
 * Preload image with priority
 */
export function preloadImage(url: string, priority: 'high' | 'low' = 'high'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  if (priority === 'high') {
    link.setAttribute('importance', 'high');
  }
  document.head.appendChild(link);
}

// ==================== IMAGE DIMENSIONS ====================

/**
 * Get image dimensions from URL
 */
export async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Calculate aspect ratio
 */
export function calculateAspectRatio(
  width: number,
  height: number
): number {
  return (height / width) * 100;
}

// ==================== PLACEHOLDER GENERATION ====================

/**
 * Generate solid color placeholder from image
 */
export async function generateColorPlaceholder(
  imageUrl: string
): Promise<string> {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '#f3f4f6';

    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1, 1);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        const hex = `#${[pixel[0], pixel[1], pixel[2]]
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('')}`;
        resolve(hex);
      };

      img.onerror = () => resolve('#f3f4f6');
      img.src = imageUrl;
    });
  } catch (error) {
    return '#f3f4f6';
  }
}

// ==================== PERFORMANCE ====================

/**
 * Measure image loading performance
 */
export function measureImagePerformance(imageUrl: string): Promise<number> {
  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      resolve(loadTime);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

// ==================== EXPORTS ====================

export default {
  generateBlurPlaceholder,
  compressImage,
  supportsWebP,
  supportsAVIF,
  getBestImageFormat,
  generateSrcSet,
  generateSizes,
  setupLazyLoading,
  preloadImages,
  preloadImage,
  getImageDimensions,
  calculateAspectRatio,
  generateColorPlaceholder,
  measureImagePerformance,
};
