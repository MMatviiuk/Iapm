/**
 * ENHANCED SESSION MANAGEMENT
 * Enterprise-grade session handling with security and monitoring
 * HIPAA/GDPR Compliant
 */

import { logAudit } from './auditLogger';

export interface SessionInfo {
  id: string;
  userId: string;
  userRole: 'patient' | 'caregiver' | 'doctor';
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent: string;
  rememberMe: boolean;
  isActive: boolean;
}

class SessionManager {
  private readonly SESSION_KEY = 'session_info';
  private readonly ACTIVITY_KEY = 'last_activity';
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
  private readonly DEFAULT_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  
  private activityTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private session: SessionInfo | null = null;

  constructor() {
    this.loadSession();
    this.setupActivityTracking();
    this.setupBeforeUnload();
  }

  /**
   * Create new session
   */
  createSession(
    userId: string,
    userRole: 'patient' | 'caregiver' | 'doctor',
    rememberMe = false
  ): SessionInfo {
    const now = new Date();
    const duration = rememberMe ? this.REMEMBER_ME_DURATION : this.DEFAULT_DURATION;
    const expiresAt = new Date(now.getTime() + duration);

    this.session = {
      id: this.generateSessionId(),
      userId,
      userRole,
      createdAt: now.toISOString(),
      lastActivity: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      userAgent: navigator.userAgent,
      rememberMe,
      isActive: true,
    };

    this.saveSession();
    this.startActivityMonitoring();

    logAudit('LOGIN', 'session', {
      userId,
      userRole,
      success: true,
      metadata: {
        sessionId: this.session.id,
        rememberMe,
        expiresAt: expiresAt.toISOString(),
      },
    });

    return this.session;
  }

  /**
   * End current session
   */
  endSession(): void {
    if (this.session) {
      logAudit('LOGOUT', 'session', {
        userId: this.session.userId,
        userRole: this.session.userRole,
        success: true,
        metadata: {
          sessionId: this.session.id,
          duration: this.getSessionDuration(),
        },
      });

      this.session.isActive = false;
      this.clearSession();
    }

    this.stopActivityMonitoring();
  }

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    if (!this.session) return;

    const now = new Date();
    this.session.lastActivity = now.toISOString();
    localStorage.setItem(this.ACTIVITY_KEY, now.toISOString());

    // Save session
    this.saveSession();

    // Reset inactivity timer
    this.resetActivityTimer();
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    if (!this.session || !this.session.isActive) {
      return false;
    }

    const now = new Date();
    const expiresAt = new Date(this.session.expiresAt);

    if (now >= expiresAt) {
      this.handleSessionExpired();
      return false;
    }

    // Check inactivity
    const lastActivity = new Date(this.session.lastActivity);
    const inactiveTime = now.getTime() - lastActivity.getTime();

    if (inactiveTime >= this.INACTIVITY_TIMEOUT) {
      this.handleSessionInactive();
      return false;
    }

    return true;
  }

  /**
   * Get current session
   */
  getSession(): SessionInfo | null {
    return this.session;
  }

  /**
   * Extend session (when remember me is enabled)
   */
  extendSession(): void {
    if (!this.session || !this.session.rememberMe) return;

    const now = new Date();
    const newExpiresAt = new Date(now.getTime() + this.REMEMBER_ME_DURATION);
    this.session.expiresAt = newExpiresAt.toISOString();
    this.saveSession();

    logAudit('SESSION_EXTENDED', 'session', {
      userId: this.session.userId,
      userRole: this.session.userRole,
      success: true,
      metadata: {
        sessionId: this.session.id,
        newExpiresAt: newExpiresAt.toISOString(),
      },
    });
  }

  /**
   * Get session duration in milliseconds
   */
  getSessionDuration(): number {
    if (!this.session) return 0;

    const created = new Date(this.session.createdAt);
    const now = new Date();
    return now.getTime() - created.getTime();
  }

  /**
   * Get time until session expires
   */
  getTimeUntilExpiry(): number {
    if (!this.session) return 0;

    const expiresAt = new Date(this.session.expiresAt);
    const now = new Date();
    return Math.max(0, expiresAt.getTime() - now.getTime());
  }

  /**
   * Get time since last activity
   */
  getTimeSinceActivity(): number {
    if (!this.session) return 0;

    const lastActivity = new Date(this.session.lastActivity);
    const now = new Date();
    return now.getTime() - lastActivity.getTime();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      if (stored) {
        this.session = JSON.parse(stored);
        
        // Validate on load
        if (this.session && !this.isSessionValid()) {
          this.clearSession();
        } else if (this.session) {
          this.startActivityMonitoring();
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      this.clearSession();
    }
  }

  private saveSession(): void {
    if (!this.session) return;

    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  private clearSession(): void {
    this.session = null;
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.ACTIVITY_KEY);
  }

  private handleSessionExpired(): void {
    if (!this.session) return;

    logAudit('SESSION_EXPIRED', 'session', {
      userId: this.session.userId,
      userRole: this.session.userRole,
      success: true,
      metadata: {
        sessionId: this.session.id,
        duration: this.getSessionDuration(),
      },
    });

    this.clearSession();
    this.stopActivityMonitoring();

    // Redirect to login
    window.location.href = '/login?reason=expired';
  }

  private handleSessionInactive(): void {
    if (!this.session) return;

    logAudit('SESSION_EXPIRED', 'session', {
      userId: this.session.userId,
      userRole: this.session.userRole,
      success: true,
      metadata: {
        sessionId: this.session.id,
        reason: 'inactivity',
        inactiveTime: this.getTimeSinceActivity(),
      },
    });

    this.clearSession();
    this.stopActivityMonitoring();

    // Redirect to login
    window.location.href = '/login?reason=inactive';
  }

  private setupActivityTracking(): void {
    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    activityEvents.forEach((event) => {
      window.addEventListener(event, () => {
        if (this.session && this.session.isActive) {
          this.updateActivity();
        }
      });
    });

    // Check session validity periodically
    setInterval(() => {
      if (this.session && !this.isSessionValid()) {
        this.handleSessionExpired();
      }
    }, 60000); // Every minute
  }

  private startActivityMonitoring(): void {
    this.resetActivityTimer();
  }

  private stopActivityMonitoring(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  private resetActivityTimer(): void {
    // Clear existing timers
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    // Set warning timer (5 minutes before timeout)
    const warningTime = this.INACTIVITY_TIMEOUT - 5 * 60 * 1000;
    this.warningTimer = setTimeout(() => {
      this.showInactivityWarning();
    }, warningTime);

    // Set timeout timer
    this.activityTimer = setTimeout(() => {
      this.handleSessionInactive();
    }, this.INACTIVITY_TIMEOUT);
  }

  private showInactivityWarning(): void {
    // Show warning toast
    if (window.dispatchEvent) {
      const event = new CustomEvent('session-warning', {
        detail: {
          message: 'Your session will expire in 5 minutes due to inactivity.',
          timeRemaining: 5 * 60 * 1000,
        },
      });
      window.dispatchEvent(event);
    }
  }

  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      if (this.session && this.session.isActive) {
        this.updateActivity();
        this.saveSession();
      }
    });
  }

  /**
   * Get session statistics
   */
  getStatistics(): {
    isActive: boolean;
    duration: number;
    timeSinceActivity: number;
    timeUntilExpiry: number;
    rememberMe: boolean;
  } {
    if (!this.session) {
      return {
        isActive: false,
        duration: 0,
        timeSinceActivity: 0,
        timeUntilExpiry: 0,
        rememberMe: false,
      };
    }

    return {
      isActive: this.session.isActive,
      duration: this.getSessionDuration(),
      timeSinceActivity: this.getTimeSinceActivity(),
      timeUntilExpiry: this.getTimeUntilExpiry(),
      rememberMe: this.session.rememberMe,
    };
  }
}

// Singleton instance
export const sessionManager = new SessionManager();

// Helper functions
export function createSession(
  userId: string,
  userRole: 'patient' | 'caregiver' | 'doctor',
  rememberMe = false
): SessionInfo {
  return sessionManager.createSession(userId, userRole, rememberMe);
}

export function endSession(): void {
  sessionManager.endSession();
}

export function isSessionValid(): boolean {
  return sessionManager.isSessionValid();
}

export function updateActivity(): void {
  sessionManager.updateActivity();
}

export function getSession(): SessionInfo | null {
  return sessionManager.getSession();
}
