/**
 * Prescription Clarity Logo
 * Modern capsule design with medical cross and shield
 * Automatically switches between light and dark theme
 * Light: Blue (#2196F3) on transparent
 * Dark: Blue shield with glow effect
 */

import { useEffect, useState } from 'react';

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Original design: Shield with capsule and cross on top
  // Dark theme uses glow effect, light theme is simpler
  
  if (isDarkMode) {
    // Dark theme - Shield with glow + capsule with cross
    return (
      <svg 
        width={size} 
        height={size * 1.2} 
        viewBox="0 0 1000 1200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <filter id="glow-dark" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.376 0 0 0 0 0.647 0 0 0 0 0.980 0 0 0 1 0"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Shield background with glow */}
        <path 
          d="M 500 220 Q 650 320, 800 340 L 800 600 C 800 700, 770 780, 720 840 C 660 915, 590 960, 500 990 C 410 960, 340 915, 280 840 C 230 780, 200 700, 200 600 L 200 340 Q 350 320, 500 220 Z" 
          fill="#2B5A8C" 
          stroke="#60A5FA" 
          strokeWidth="4" 
          filter="url(#glow-dark)"
        />
        
        {/* Capsule with medical cross */}
        <g transform="translate(500, 590) rotate(45)">
          <path 
            d="M -110 -165.375 A 110 110 0 0 1 110 -165.375 L 110 165.375 A 110 110 0 0 1 -110 165.375 Z" 
            fill="white" 
            stroke="#2B5A8C" 
            strokeWidth="13"
          />
          <rect x="-110" y="-12.5" width="220" height="25" fill="#2B5A8C"/>
          <g transform="translate(25, -95)">
            <path 
              d="M -27 0 L 0 0 L 0 -80" 
              stroke="#2B5A8C" 
              strokeWidth="25" 
              strokeLinecap="square" 
              strokeLinejoin="miter" 
              fill="none"
            />
          </g>
        </g>
      </svg>
    );
  } else {
    // Light theme - Shield + capsule with cross (no glow, simpler colors)
    return (
      <svg 
        width={size} 
        height={size * 1.2} 
        viewBox="0 0 1000 1200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Shield background - light blue */}
        <path 
          d="M 500 220 Q 650 320, 800 340 L 800 600 C 800 700, 770 780, 720 840 C 660 915, 590 960, 500 990 C 410 960, 340 915, 280 840 C 230 780, 200 700, 200 600 L 200 340 Q 350 320, 500 220 Z" 
          fill="#2196F3" 
          stroke="#1976D2" 
          strokeWidth="4"
        />
        
        {/* Capsule with medical cross */}
        <g transform="translate(500, 590) rotate(45)">
          <path 
            d="M -110 -165.375 A 110 110 0 0 1 110 -165.375 L 110 165.375 A 110 110 0 0 1 -110 165.375 Z" 
            fill="white" 
            stroke="#1976D2" 
            strokeWidth="13"
          />
          <rect x="-110" y="-12.5" width="220" height="25" fill="#1976D2"/>
          <g transform="translate(25, -95)">
            <path 
              d="M -27 0 L 0 0 L 0 -80" 
              stroke="#1976D2" 
              strokeWidth="25" 
              strokeLinecap="square" 
              strokeLinejoin="miter" 
              fill="none"
            />
          </g>
        </g>
      </svg>
    );
  }
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