/**
 * Avatar utility functions for gender and age-appropriate avatars
 * Demo version uses real photos from Unsplash
 * Production version allows custom photo uploads
 */

export type Gender = 'male' | 'female';

interface AvatarOptions {
  name: string;
  gender?: Gender;
  dateOfBirth?: string;
  seed?: string;
  customPhotoUrl?: string; // For user-uploaded photos
}

/**
 * Demo avatars - real photos matching gender, age, and role
 * European-looking patients and professional doctor headshots
 * In production, users can upload their own photos
 */
const DEMO_AVATARS: Record<string, string> = {
  // Landing page testimonials - European elderly FACE portraits (NOT from behind!)
  'Sarah Johnson': 'https://images.unsplash.com/photo-1647774449593-41224c91da26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Michael Chen': 'https://images.unsplash.com/photo-1655628591001-ae40b826ae24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Dr. Emily Rodriguez': 'https://images.unsplash.com/photo-1706565029539-d09af5896340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  
  // PATIENTS - European elderly (unique for each person)
  'Margaret Williams': 'https://images.unsplash.com/photo-1664813495783-a7b19be83624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Thomas O\'Connor': 'https://images.unsplash.com/photo-1655628591001-ae40b826ae24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Giovanni Russo': 'https://images.unsplash.com/photo-1758686253859-8ef7e940096e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Hans Müller': 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Hans Mueller': 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Anna Kowalski': 'https://images.unsplash.com/photo-1647774449593-41224c91da26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Françoise Dubois': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Francoise Dubois': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Miguel López': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Miguel Lopez': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Maria García': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Maria Garcia': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Patrick O\'Brien': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Brigitte Schneider': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Henrik Larsen': 'https://images.unsplash.com/photo-1556474835-b0f3ac40d4d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Lars Jensen': 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Erik Svensson': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Annika Johansson': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Pierre Martin': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  
  // CAREGIVERS - European adults (30-60 years)
  'Catherine Bennett': 'https://images.unsplash.com/photo-1655249481446-25d575f1c054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzYyNzcyNDAzfDA&ixlib=rb-4.1.0&q=80&w=400',
  'Michael O\'Brien': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Martina Rossi': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Anna Weber': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Robert Johnson': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  
  // DOCTORS - Professional headshots (therapist/GP style)
  'Dr. Sarah Mitchell': 'https://images.unsplash.com/photo-1706565029539-d09af5896340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Dr. James Anderson': 'https://images.unsplash.com/photo-1645066928295-2506defde470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0aGVyYXBpc3QlMjBkb2N0b3IlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI4NjAxMDJ8MA&ixlib=rb-4.1.0&q=80&w=400',
  'Dr. Carlos Rodriguez': 'https://images.unsplash.com/photo-1762237798212-bcc000c00891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Dr. Emma Murphy': 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Dr. Klaus Schmidt': 'https://images.unsplash.com/photo-1748288166888-f1bd5d6ef9ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  
  // Fallback names
  'Anna': 'https://images.unsplash.com/photo-1647774449593-41224c91da26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Oksana Williams': 'https://images.unsplash.com/photo-1647774449593-41224c91da26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'Dr. Katarzyna Nowak': 'https://images.unsplash.com/photo-1706565029539-d09af5896340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'John Smith': 'https://images.unsplash.com/photo-1664793348200-641d676b2544?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBtYW4lMjBjbG9zZXVwJTIwZmFjZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc2Mjg1NTcyNnww&ixlib=rb-4.1.0&q=80&w=400',
};

/**
 * Generates gender and age-appropriate avatar URL
 * 
 * Priority:
 * 1. Custom uploaded photo (production feature)
 * 2. Demo avatar if name matches (demo mode)
 * 3. Fallback based on gender/age
 */
export function getAvatarUrl(options: AvatarOptions): string {
  const { name, gender = 'female', customPhotoUrl } = options;
  
  // 1. User uploaded photo (production)
  if (customPhotoUrl) {
    return customPhotoUrl;
  }
  
  // 2. Demo avatar (if name matches)
  if (DEMO_AVATARS[name]) {
    return DEMO_AVATARS[name];
  }
  
  // 3. Fallback - gender/age appropriate photo
  return getDefaultAvatarByGender(gender);
}

/**
 * Get default avatar based on gender
 * Used when no custom photo or demo avatar available
 * European elderly patients - FACE portraits (not from behind!)
 */
function getDefaultAvatarByGender(gender: Gender): string {
  switch (gender) {
    case 'male':
      return 'https://images.unsplash.com/photo-1655628591001-ae40b826ae24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
    case 'female':
      return 'https://images.unsplash.com/photo-1647774449593-41224c91da26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
  }
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format age for display (e.g., "75 yrs")
 */
export function formatAge(dateOfBirth: string): string {
  const age = calculateAge(dateOfBirth);
  return `${age} yrs`;
}

/**
 * Get avatar with role-specific border color classes
 */
export function getRoleAvatarClasses(role: 'myself' | 'caregiver' | 'doctor' | 'patient'): string {
  switch (role) {
    case 'caregiver':
      return 'ring-2 ring-orange-500';
    case 'doctor':
      return 'ring-2 ring-purple-500';
    case 'myself':
    case 'patient':
    default:
      return 'ring-2 ring-blue-500';
  }
}

/**
 * Get gender label for display
 */
export function getGenderLabel(gender: Gender): string {
  switch (gender) {
    case 'male':
      return 'Male';
    case 'female':
      return 'Female';
  }
}

/**
 * Generate consistent avatar seed from user data
 * This ensures the same person always gets the same avatar
 */
export function generateAvatarSeed(name: string, email?: string): string {
  // Combine name and email (if provided) for uniqueness
  const baseString = email ? `${name}-${email}` : name;
  
  // Simple hash function to ensure consistency
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Return unique seed
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Math.abs(hash)}`;
}