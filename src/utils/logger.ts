/**
 * PRODUCTION LOGGER
 * Medical-grade logging system
 * Logs errors, warnings, and info to console in dev
 * Can be extended to send to error tracking service (Sentry, LogRocket)
 */

// ==================== LOG LEVELS ====================

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// ==================== LOG ENTRY ====================

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  userRole?: string;
  page?: string;
}

// ==================== LOGGER CLASS ====================

class Logger {
  private minLevel: LogLevel;
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogsInMemory = 100;

  constructor() {
    // Safe check for import.meta.env (may be undefined in some environments)
    this.isDevelopment = 
      (typeof import.meta !== 'undefined' && import.meta.env?.DEV) || 
      (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
      false;
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning
   */
  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error
   */
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log fatal error (app-breaking)
   */
  fatal(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.FATAL, message, context, error);
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ) {
    // Skip if below minimum level
    if (level < this.minLevel) return;

    // Create log entry
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
      userId: this.getCurrentUserId(),
      userRole: this.getCurrentUserRole(),
      page: window.location.pathname,
    };

    // Store in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs.shift(); // Remove oldest
    }

    // Console output (development)
    if (this.isDevelopment) {
      this.logToConsole(entry);
    }

    // Send to error tracking service (production)
    if (!this.isDevelopment && level >= LogLevel.ERROR) {
      this.sendToErrorTracking(entry);
    }
  }

  /**
   * Log to console (development)
   */
  private logToConsole(entry: LogEntry) {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${levelName}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context);
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, entry.message, entry.error, entry.context);
        break;
    }
  }

  /**
   * Send to error tracking service (Sentry, LogRocket, etc.)
   */
  private sendToErrorTracking(entry: LogEntry) {
    // TODO: Integrate with error tracking service
    // Example for Sentry:
    // if (window.Sentry) {
    //   window.Sentry.captureException(entry.error || new Error(entry.message), {
    //     level: LogLevel[entry.level].toLowerCase(),
    //     extra: {
    //       ...entry.context,
    //       userId: entry.userId,
    //       userRole: entry.userRole,
    //       page: entry.page,
    //     },
    //   });
    // }

    // For now, just log to console in production too
    console.error('[PRODUCTION ERROR]', entry);
  }

  /**
   * Get current user ID from localStorage
   */
  private getCurrentUserId(): string | undefined {
    try {
      const user = localStorage.getItem('currentUser');
      if (user) {
        const parsed = JSON.parse(user);
        return parsed.id;
      }
    } catch (e) {
      // Ignore
    }
    return undefined;
  }

  /**
   * Get current user role from localStorage
   */
  private getCurrentUserRole(): string | undefined {
    try {
      const role = localStorage.getItem('userRole');
      return role || undefined;
    } catch (e) {
      // Ignore
    }
    return undefined;
  }

  /**
   * Get all logs from memory
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear logs from memory
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs() {
    const data = this.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-clarity-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// ==================== SINGLETON INSTANCE ====================

const logger = new Logger();

export default logger;

// ==================== CONVENIENCE EXPORTS ====================

export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
  getLogs: logger.getLogs.bind(logger),
  clearLogs: logger.clearLogs.bind(logger),
  exportLogs: logger.exportLogs.bind(logger),
  downloadLogs: logger.downloadLogs.bind(logger),
};

// ==================== GLOBAL ERROR HANDLER ====================

/**
 * Setup global error handler
 * Catches unhandled errors and logs them
 */
export function setupGlobalErrorHandler() {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error(
      'Unhandled Promise Rejection',
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        promise: event.promise,
        reason: event.reason,
      }
    );
  });

  // Catch global errors
  window.addEventListener('error', (event) => {
    logger.error(
      'Global Error',
      event.error || new Error(event.message),
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    );
  });

  logger.info('Global error handler initialized');
}

// ==================== PERFORMANCE LOGGING ====================

/**
 * Log performance metric
 */
export function logPerformance(metricName: string, value: number, unit: string = 'ms') {
  logger.debug(`Performance: ${metricName}`, {
    metric: metricName,
    value,
    unit,
  });
}

/**
 * Measure function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logPerformance(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${name} failed after ${duration.toFixed(2)}ms`, error as Error);
    throw error;
  }
}

/**
 * Measure sync function execution time
 */
export function measure<T>(name: string, fn: () => T): T {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    logPerformance(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${name} failed after ${duration.toFixed(2)}ms`, error as Error);
    throw error;
  }
}

// ==================== API LOGGING ====================

/**
 * Log API request
 */
export function logApiRequest(method: string, url: string, data?: any) {
  logger.debug(`API Request: ${method} ${url}`, { method, url, data });
}

/**
 * Log API response
 */
export function logApiResponse(method: string, url: string, status: number, data?: any) {
  if (status >= 400) {
    logger.error(`API Error: ${method} ${url} - ${status}`, undefined, {
      method,
      url,
      status,
      data,
    });
  } else {
    logger.debug(`API Response: ${method} ${url} - ${status}`, {
      method,
      url,
      status,
      data,
    });
  }
}

/**
 * Log API error
 */
export function logApiError(method: string, url: string, error: Error) {
  logger.error(`API Request Failed: ${method} ${url}`, error, {
    method,
    url,
  });
}
