// Notifications utility for demo mode
// Generates realistic notifications based on user role

export interface Notification {
  id: string;
  type: 'medication' | 'reminder' | 'achievement' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  icon?: string;
  actionLabel?: string;
  actionUrl?: string;
}

// Generate realistic notifications for patient role
export function generatePatientNotifications(): Notification[] {
  const now = new Date();
  const notifications: Notification[] = [];

  // Upcoming medication (HIGH priority)
  notifications.push({
    id: 'notif-1',
    type: 'medication',
    title: 'Time to Take Medication',
    message: 'Lisinopril 10mg - Take with water before meal',
    timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 min ago
    read: false,
    priority: 'high',
    icon: '💊',
    actionLabel: 'Mark as Taken',
    actionUrl: 'dashboard',
  });

  // Missed medication (HIGH priority)
  notifications.push({
    id: 'notif-2',
    type: 'alert',
    title: 'Missed Medication',
    message: 'You missed Metformin 500mg at 8:00 AM',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: 'high',
    icon: '⚠️',
    actionLabel: 'View Schedule',
    actionUrl: 'schedule',
  });

  // Refill reminder (MEDIUM priority)
  notifications.push({
    id: 'notif-3',
    type: 'reminder',
    title: 'Refill Reminder',
    message: 'Atorvastatin supply running low (5 days left)',
    timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
    priority: 'medium',
    icon: '📅',
    actionLabel: 'View Details',
    actionUrl: 'medications',
  });

  // Achievement unlocked (LOW priority)
  notifications.push({
    id: 'notif-4',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'Perfect Week - 100% adherence for 7 days straight',
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true, // Already read
    priority: 'low',
    icon: '🏆',
    actionLabel: 'View Achievements',
    actionUrl: 'rewards',
  });

  // System notification (LOW priority)
  notifications.push({
    id: 'notif-5',
    type: 'system',
    title: 'Weekly Report Available',
    message: 'Your weekly medication adherence report is ready',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    priority: 'low',
    icon: '📊',
    actionLabel: 'View Report',
    actionUrl: 'history',
  });

  return notifications;
}

// Generate realistic notifications for caregiver role
export function generateCaregiverNotifications(): Notification[] {
  const now = new Date();
  const notifications: Notification[] = [];

  // Dependent at risk (HIGH priority)
  notifications.push({
    id: 'notif-c1',
    type: 'alert',
    title: 'Dependent At Risk',
    message: 'John Williams missed 2 medications today (adherence: 65%)',
    timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
    read: false,
    priority: 'high',
    icon: '🆘',
    actionLabel: 'Check Now',
    actionUrl: 'caregiver',
  });

  // Medication taken (MEDIUM priority)
  notifications.push({
    id: 'notif-c2',
    type: 'medication',
    title: 'Medication Taken',
    message: 'Emily Thompson took Levothyroxine 50mcg at 8:15 AM',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: 'medium',
    icon: '✅',
    actionLabel: 'View Details',
    actionUrl: 'dependent-details',
  });

  // Refill needed (MEDIUM priority)
  notifications.push({
    id: 'notif-c3',
    type: 'reminder',
    title: 'Refill Needed',
    message: 'Sarah Johnson - Warfarin supply ends in 3 days',
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
    priority: 'medium',
    icon: '📅',
    actionLabel: 'View Medications',
    actionUrl: 'dependent-details',
  });

  // Good adherence (LOW priority)
  notifications.push({
    id: 'notif-c4',
    type: 'achievement',
    title: 'Excellent Progress',
    message: 'All dependents achieved 95%+ adherence this week',
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: 'low',
    icon: '🎉',
    actionLabel: 'View Analytics',
    actionUrl: 'caregiver-analytics',
  });

  return notifications;
}

// Generate realistic notifications for doctor role
export function generateDoctorNotifications(): Notification[] {
  const now = new Date();
  const notifications: Notification[] = [];

  // Patient at risk (HIGH priority)
  notifications.push({
    id: 'notif-d1',
    type: 'alert',
    title: 'Patient At Risk',
    message: 'Margaret Williams - Adherence dropped to 58% (critical)',
    timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
    read: false,
    priority: 'high',
    icon: '🚨',
    actionLabel: 'Review Patient',
    actionUrl: 'patient-details',
  });

  // New patient accepted (MEDIUM priority)
  notifications.push({
    id: 'notif-d2',
    type: 'system',
    title: 'New Patient',
    message: 'Robert Martinez accepted your invitation',
    timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: false,
    priority: 'medium',
    icon: '👤',
    actionLabel: 'View Patient',
    actionUrl: 'patient-details',
  });

  // Cohort report (MEDIUM priority)
  notifications.push({
    id: 'notif-d3',
    type: 'system',
    title: 'Weekly Cohort Report',
    message: 'Overall adherence: 88% - 1 patient needs attention',
    timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false,
    priority: 'medium',
    icon: '📊',
    actionLabel: 'View Analytics',
    actionUrl: 'doctor-analytics',
  });

  // Patient improvement (LOW priority)
  notifications.push({
    id: 'notif-d4',
    type: 'achievement',
    title: 'Patient Improvement',
    message: 'David Brown achieved 100% adherence for 30 days',
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: 'low',
    icon: '🌟',
    actionLabel: 'View Patient',
    actionUrl: 'patient-details',
  });

  return notifications;
}

// Get notifications based on role
export function getNotificationsByRole(role: 'myself' | 'caregiver' | 'doctor'): Notification[] {
  switch (role) {
    case 'caregiver':
      return generateCaregiverNotifications();
    case 'doctor':
      return generateDoctorNotifications();
    default:
      return generatePatientNotifications();
  }
}

// Get unread count
export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter(n => !n.read).length;
}

// Mark notification as read
export function markAsRead(notifications: Notification[], notificationId: string): Notification[] {
  return notifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
}

// Mark all as read
export function markAllAsRead(notifications: Notification[]): Notification[] {
  return notifications.map(n => ({ ...n, read: true }));
}

// Delete notification
export function deleteNotification(notifications: Notification[], notificationId: string): Notification[] {
  return notifications.filter(n => n.id !== notificationId);
}

// Clear all notifications
export function clearAllNotifications(): Notification[] {
  return [];
}

// Save notifications to localStorage
export function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
}

// Load notifications from localStorage
export function loadNotifications(): Notification[] | null {
  try {
    const stored = localStorage.getItem('notifications');
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return parsed.map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load notifications:', error);
    return null;
  }
}

// Format time ago (e.g., "5 min ago", "2 hours ago")
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
}

// Get priority color class
export function getPriorityColor(priority: 'low' | 'medium' | 'high', darkMode: boolean): string {
  switch (priority) {
    case 'high':
      return darkMode 
        ? 'bg-red-950/30 border-red-800 text-red-300' 
        : 'bg-red-50 border-red-200 text-red-900';
    case 'medium':
      return darkMode
        ? 'bg-orange-950/30 border-orange-800 text-orange-300'
        : 'bg-orange-50 border-orange-200 text-orange-900';
    default:
      return darkMode
        ? 'bg-slate-800/50 border-slate-700 text-slate-300'
        : 'bg-slate-50 border-slate-200 text-slate-700';
  }
}
