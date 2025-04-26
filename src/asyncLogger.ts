import { log } from './logger';
import { logToElement } from './htmlLogger';
import type { LoggerOptions, HtmlLoggerOptions } from './types';

/**
 * Logs the result of a Promise when it resolves
 * 
 * @param promise - Promise to log when resolved
 * @param label - Optional label for the logged value
 * @param options - Logger options
 */
export function logAsync<T>(
  promise: Promise<T>, 
  label?: string, 
  options?: LoggerOptions
): Promise<T> {
  return promise.then(result => {
    if (options) {
      const logger = createAsyncLogger(options);
      logger.log(result, label);
    } else {
      log(result, label);
    }
    return result;
  }).catch(error => {
    if (options) {
      const logger = createAsyncLogger({ ...options, method: 'error' });
      logger.log(error, label ? `${label} (Error)` : 'Error');
    } else {
      console.error(label ? `${label} (Error):` : 'Error:', error);
    }
    throw error;
  });
}

/**
 * Logs the result of a Promise to an HTML element when it resolves
 * 
 * @param promise - Promise to log when resolved
 * @param element - HTML element to log to
 * @param label - Optional label for the logged value
 * @param options - HTML logger options
 */
export function logAsyncToElement<T>(
  promise: Promise<T>, 
  element: HTMLElement, 
  label?: string, 
  options?: HtmlLoggerOptions
): Promise<T> {
  return promise.then(result => {
    logToElement(result, element, label);
    return result;
  }).catch(error => {
    logToElement(error, element, label ? `${label} (Error)` : 'Error');
    throw error;
  });
}

/**
 * Creates an async logger for tracking and logging Promise results
 * 
 * @param options - Logger options
 */
export function createAsyncLogger(options: LoggerOptions = {}) {
  let currentOptions = { ...options };
  
  return {
    log<T>(promise: Promise<T>, label?: string): Promise<T> {
      return logAsync(promise, label, currentOptions);
    },
    
    toElement<T>(promise: Promise<T>, element: HTMLElement, label?: string): Promise<T> {
      return logAsyncToElement(promise, element, label, currentOptions);
    },
    
    setOptions(newOptions: Partial<LoggerOptions>): void {
      currentOptions = { ...currentOptions, ...newOptions };
    }
  };
}