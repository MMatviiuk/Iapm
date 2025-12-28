/**
 * Prescription Clarity Logo
 * REAL LOGO from Figma - Pill capsule with shield and cross
 * BLUE (#2196F3) on TRANSPARENT background
 */

import logoImage from 'figma:asset/1365186ed792a761a8bbf201e130c3178c120715.png';

interface PillShieldLogoProps {
  className?: string;
  size?: number;
  color?: string;
  role?: 'patient' | 'caregiver' | 'doctor';
  square?: boolean;
}

export function PillShieldLogo({ 
  className = '', 
  size = 48,
  square = false,
}: PillShieldLogoProps) {
  // Real logo has approximately 1:1 aspect ratio
  const width = size;
  const height = size;
  
  return (
    <img 
      src={logoImage} 
      alt="Prescription Clarity Logo"
      width={width}
      height={height}
      className={className}
      style={{ 
        width: width, 
        height: height, 
        objectFit: 'contain',
        flexShrink: 0
      }}
    />
  );
}

/**
 * Outline version (legacy - same as main logo)
 * Kept for backward compatibility
 */
export function PillShieldLogoOutline({ 
  className = '', 
  size = 48,
}: PillShieldLogoProps) {
  return (
    <PillShieldLogo 
      className={className}
      size={size}
    />
  );
}

/**
 * Filled variant - uses square logo for compact spaces
 * Perfect for mobile headers and small spaces
 */
export function PillShieldLogoFilled({ 
  className = '', 
  size = 48,
}: { 
  className?: string; 
  size?: number;
  role?: 'patient' | 'caregiver' | 'doctor';
  primaryColor?: string;
  secondaryColor?: string;
}) {
  return (
    <PillShieldLogo 
      className={className}
      size={size}
      square={true}
    />
  );
}

/**
 * Simple logo variant for small sizes (16px - 32px)
 * Uses square version for better visibility at small scales
 */
export function PillShieldLogoSimple({ 
  className = '', 
  size = 24,
}: { 
  className?: string; 
  size?: number;
  color?: string;
  role?: 'patient' | 'caregiver' | 'doctor';
}) {
  return (
    <PillShieldLogo 
      className={className}
      size={size}
      square={true}
    />
  );
}

/**
 * Logo variants by role for easy usage
 */
export function PatientLogo(props: Omit<PillShieldLogoProps, 'role'>) {
  return <PillShieldLogo {...props} />;
}

export function CaregiverLogo(props: Omit<PillShieldLogoProps, 'role'>) {
  return <PillShieldLogo {...props} />;
}

export function DoctorLogo(props: Omit<PillShieldLogoProps, 'role'>) {
  return <PillShieldLogo {...props} />;
}
