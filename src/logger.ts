import { safeStringify } from './safeStringify';
import type { Logger, LoggerOptions } from './types';

/**
 * Creates a logger instance for console output
 * 
 * @param options - Configuration options for the logger
 * @returns A logger instance with log, clear, and setOptions methods
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  let currentOptions: LoggerOptions = {
    colors: typeof window !== 'undefined' && 
      window.navigator && 
      window.navigator.userAgent && 
      !window.navigator.userAgent.includes('Node.js'),
    method: 'log',
    ...options,
  };

  const logger: Logger = {
    log(value: any, label?: string): void {
      const method = currentOptions.method || 'log';
      const stringified = safeStringify(value, currentOptions);
      
      if (label) {
        if (currentOptions.colors && typeof console !== 'undefined' && typeof (console as any).group === 'function') {
          (console as any).group(label);
          console[method](stringified);
          (console as any).groupEnd();
        } else {
          console[method](`${label}:`, stringified);
        }
      } else {
        console[method](stringified);
      }
    },
    
    clear(): void {
      if (typeof console !== 'undefined' && typeof console.clear === 'function') {
        console.clear();
      }
    },
    
    setOptions(newOptions: Partial<LoggerOptions>): void {
      currentOptions = { ...currentOptions, ...newOptions };
    }
  };
  
  return logger;
}

/**
 * Simple utility for logging objects to console
 * 
 * @param value - Value to log
 * @param label - Optional label for the logged value
 */
export function log(value: any, label?: string): void {
  const logger = createLogger();
  logger.log(value, label);
}