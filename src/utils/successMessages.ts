// Success Messages Utility - Elderly-Friendly Success Feedback
// Created: November 7, 2025
// Purpose: Provide specific, encouraging success messages with visual feedback

export interface SuccessMessage {
  title: string;
  message: string;
  icon?: string;
  showUndo?: boolean;
  undoLabel?: string;
  celebration?: boolean; // Show confetti or animation
}

/**
 * Get elderly-friendly success message from action and context
 * Returns specific, encouraging messages with appropriate visual feedback
 */
export function getSuccessMessage(action: string, context?: any): SuccessMessage {
  const actionLower = action.toLowerCase();
  
  // Authentication successes
  if (actionLower.includes('login') || actionLower.includes('sign in')) {
    return {
      title: 'Welcome Back!',
      message: context?.name ? `Good to see you, ${context.name}!` : 'You are logged in successfully',
      icon: '👋',
      celebration: false,
    };
  }
  
  if (actionLower.includes('register') || actionLower.includes('sign up') || actionLower.includes('account created')) {
    return {
      title: 'Account Created!',
      message: context?.name ? `Welcome aboard, ${context.name}!` : 'Your account is ready to use',
      icon: '🎉',
      celebration: true,
    };
  }
  
  if (actionLower.includes('logout') || actionLower.includes('signed out')) {
    return {
      title: 'Logged Out',
      message: 'See you next time! Your data is safe',
      icon: '👋',
      celebration: false,
    };
  }
  
  // Medication actions
  if (actionLower.includes('marked as taken') || actionLower.includes('medication taken')) {
    return {
      title: 'Great Job!',
      message: context?.name 
        ? `${context.name} marked as taken` 
        : 'Medication marked as taken',
      icon: '✅',
      celebration: false,
      showUndo: true,
      undoLabel: 'Undo',
    };
  }
  
  if (actionLower.includes('medication added') || actionLower.includes('prescription added')) {
    return {
      title: 'Medication Added!',
      message: context?.name 
        ? `${context.name} ${context?.dosage || ''} added to your list`.trim()
        : 'New medication added successfully',
      icon: '💊',
      celebration: false,
    };
  }
  
  if (actionLower.includes('medication updated') || actionLower.includes('prescription updated')) {
    return {
      title: 'Changes Saved!',
      message: context?.name 
        ? `${context.name} updated successfully`
        : 'Medication updated successfully',
      icon: '✏️',
      celebration: false,
    };
  }
  
  if (actionLower.includes('medication deleted') || actionLower.includes('prescription deleted')) {
    return {
      title: 'Medication Removed',
      message: context?.name 
        ? `${context.name} has been deleted`
        : 'Medication removed from your list',
      icon: '🗑️',
      celebration: false,
      showUndo: true,
      undoLabel: 'Undo Delete',
    };
  }
  
  if (actionLower.includes('medication prescribed') || actionLower.includes('prescribed for')) {
    return {
      title: 'Prescription Created!',
      message: context?.patientName 
        ? `${context.medicationName || 'Medication'} prescribed for ${context.patientName}`
        : 'Prescription added to treatment plan',
      icon: '💊',
      celebration: false,
    };
  }
  
  // User management
  if (actionLower.includes('dependent added') || actionLower.includes('family member added')) {
    return {
      title: 'Family Member Added!',
      message: context?.name 
        ? `${context.name} added successfully`
        : 'New dependent added to your care list',
      icon: '👥',
      celebration: false,
    };
  }
  
  if (actionLower.includes('dependent removed') || actionLower.includes('dependent deleted')) {
    return {
      title: 'Dependent Removed',
      message: context?.name 
        ? `${context.name} removed from your care list`
        : 'Dependent removed successfully',
      icon: '👋',
      celebration: false,
      showUndo: true,
      undoLabel: 'Undo Remove',
    };
  }
  
  if (actionLower.includes('invitation sent') || actionLower.includes('patient invited')) {
    return {
      title: 'Invitation Sent!',
      message: context?.email 
        ? `Invitation email sent to ${context.email}`
        : 'Patient invitation sent successfully',
      icon: '✉️',
      celebration: false,
    };
  }
  
  if (actionLower.includes('patient added')) {
    return {
      title: 'Patient Added!',
      message: context?.name 
        ? `${context.name} added to your patient list`
        : 'New patient added successfully',
      icon: '👤',
      celebration: false,
    };
  }
  
  // Settings & Preferences
  if (actionLower.includes('settings saved') || actionLower.includes('preferences saved')) {
    return {
      title: 'Settings Saved!',
      message: 'Your preferences have been updated',
      icon: '⚙️',
      celebration: false,
    };
  }
  
  if (actionLower.includes('dark mode') || actionLower.includes('light mode')) {
    const isDark = actionLower.includes('dark');
    return {
      title: isDark ? 'Dark Mode On' : 'Light Mode On',
      message: isDark ? 'Easier on the eyes' : 'Bright and clear',
      icon: isDark ? '🌙' : '☀️',
      celebration: false,
    };
  }
  
  if (actionLower.includes('notification') && actionLower.includes('enabled')) {
    return {
      title: 'Notifications On',
      message: 'You will receive reminders for your medications',
      icon: '🔔',
      celebration: false,
    };
  }
  
  if (actionLower.includes('notification') && actionLower.includes('disabled')) {
    return {
      title: 'Notifications Off',
      message: 'Reminders have been turned off',
      icon: '🔕',
      celebration: false,
    };
  }
  
  // Data operations
  if (actionLower.includes('schedule shared')) {
    return {
      title: 'Schedule Shared!',
      message: context?.email 
        ? `Shared with ${context.email}`
        : 'Your schedule has been shared',
      icon: '🔗',
      celebration: false,
    };
  }
  
  if (actionLower.includes('photo uploaded') || actionLower.includes('photo added')) {
    return {
      title: 'Photo Added!',
      message: 'Medication photo saved successfully',
      icon: '📷',
      celebration: false,
    };
  }
  
  if (actionLower.includes('profile updated')) {
    return {
      title: 'Profile Updated!',
      message: 'Your information has been saved',
      icon: '👤',
      celebration: false,
    };
  }
  
  if (actionLower.includes('password changed') || actionLower.includes('password reset')) {
    return {
      title: 'Password Changed!',
      message: 'Your new password is active',
      icon: '🔑',
      celebration: false,
    };
  }
  
  if (actionLower.includes('email verified')) {
    return {
      title: 'Email Verified!',
      message: 'Your email address is confirmed',
      icon: '✅',
      celebration: true,
    };
  }
  
  // Achievements
  if (actionLower.includes('achievement unlocked') || actionLower.includes('badge earned')) {
    return {
      title: 'Achievement Unlocked!',
      message: context?.achievement 
        ? `You earned: ${context.achievement}`
        : 'Great progress! Keep it up!',
      icon: '🏆',
      celebration: true,
    };
  }
  
  if (actionLower.includes('streak') || actionLower.includes('perfect week')) {
    return {
      title: 'Amazing Streak!',
      message: context?.days 
        ? `${context.days} days of perfect adherence!`
        : 'You are on a roll!',
      icon: '🔥',
      celebration: true,
    };
  }
  
  // Role switching
  if (actionLower.includes('switched to')) {
    const role = context?.role || (actionLower.includes('patient') ? 'patient' : 
                                   actionLower.includes('caregiver') ? 'caregiver' : 'doctor');
    return {
      title: 'View Switched',
      message: `Now viewing as ${role}`,
      icon: role === 'patient' ? '👤' : role === 'caregiver' ? '👥' : '⚕️',
      celebration: false,
    };
  }
  
  // Import/Export
  if (actionLower.includes('data exported')) {
    return {
      title: 'Data Exported!',
      message: 'Your data has been downloaded',
      icon: '📥',
      celebration: false,
    };
  }
  
  if (actionLower.includes('data imported')) {
    return {
      title: 'Data Imported!',
      message: context?.count 
        ? `${context.count} medications imported`
        : 'Your data has been imported',
      icon: '📤',
      celebration: false,
    };
  }
  
  // Generic success fallback
  return {
    title: 'Success!',
    message: 'Action completed successfully',
    icon: '✅',
    celebration: false,
  };
}

/**
 * Format success for toast notification
 * Returns a formatted string with icon
 */
export function formatSuccessForToast(action: string, context?: any): string {
  const successInfo = getSuccessMessage(action, context);
  return `${successInfo.icon ? successInfo.icon + ' ' : ''}${successInfo.title}`;
}

/**
 * Get celebration level (for animations)
 * Returns 'none', 'small', or 'big'
 */
export function getCelebrationLevel(action: string): 'none' | 'small' | 'big' {
  const actionLower = action.toLowerCase();
  
  // Big celebrations
  if (
    actionLower.includes('account created') ||
    actionLower.includes('achievement unlocked') ||
    actionLower.includes('perfect week') ||
    actionLower.includes('email verified')
  ) {
    return 'big';
  }
  
  // Small celebrations
  if (
    actionLower.includes('marked as taken') ||
    actionLower.includes('medication added') ||
    actionLower.includes('streak')
  ) {
    return 'small';
  }
  
  // No celebration
  return 'none';
}

/**
 * Get success sound (for audio feedback)
 * Returns sound effect name
 */
export function getSuccessSound(action: string): 'success' | 'achievement' | 'celebration' | 'none' {
  const actionLower = action.toLowerCase();
  
  // Achievement sounds
  if (
    actionLower.includes('achievement') ||
    actionLower.includes('streak') ||
    actionLower.includes('perfect week')
  ) {
    return 'achievement';
  }
  
  // Celebration sounds
  if (
    actionLower.includes('account created') ||
    actionLower.includes('email verified')
  ) {
    return 'celebration';
  }
  
  // Regular success
  if (
    actionLower.includes('added') ||
    actionLower.includes('saved') ||
    actionLower.includes('updated') ||
    actionLower.includes('marked as taken')
  ) {
    return 'success';
  }
  
  // No sound for quiet actions (delete, logout, etc.)
  return 'none';
}

/**
 * Check if action should show undo option
 */
export function shouldShowUndo(action: string): boolean {
  const actionLower = action.toLowerCase();
  
  return (
    actionLower.includes('deleted') ||
    actionLower.includes('removed') ||
    actionLower.includes('marked as taken')
  );
}
