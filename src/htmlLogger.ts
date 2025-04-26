import { safeStringify } from './safeStringify';
import type { HtmlLogger, HtmlLoggerOptions } from './types';

/**
 * Creates a logger instance for HTML output
 * 
 * @param options - Configuration options for the HTML logger
 * @returns A logger instance with log, clear, and setOptions methods
 */
export function createHtmlLogger(options: HtmlLoggerOptions = {}): HtmlLogger {
  let currentOptions: HtmlLoggerOptions = {
    highlight: true,
    append: false,
    ...options,
  };

  const syntaxHighlight = (json: string): string => {
    if (!currentOptions.highlight) return json;
    
    // Add syntax highlighting with CSS classes
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null|undefined|NaN|Infinity)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z"|\[(?:Function|Node|Window|Circular|Error|Max depth exceeded)[^\]]*\])/g, 
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
            match = match.replace(/"/, '').replace(/"/, '');
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null|undefined|NaN|Infinity/.test(match)) {
          cls = 'json-null';
        } else if (/\[Function|\[Node|\[Window|\[Circular|\[Error|\[Max depth exceeded/.test(match)) {
          cls = 'json-special';
        }
        return `<span class="${cls}">${match}</span>`;
      });
  };

  // Add CSS for syntax highlighting
  const addStyles = (): void => {
    if (typeof document === 'undefined' || !currentOptions.highlight) return;
    
    const id = 'safe-stringify-styles';
    if (document.getElementById(id)) return;
    
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .safe-stringify-output {
        font-family: monospace;
        white-space: pre-wrap;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        overflow: auto;
        max-height: 600px;
      }
      .safe-stringify-output .json-key { color: #881391; }
      .safe-stringify-output .json-string { color: #C41A16; }
      .safe-stringify-output .json-number { color: #1C00CF; }
      .safe-stringify-output .json-boolean { color: #0000FF; }
      .safe-stringify-output .json-null { color: #808080; }
      .safe-stringify-output .json-special { color: #FF6B00; font-style: italic; }
    `;
    document.head.appendChild(style);
  };

  const logger: HtmlLogger = {
    log(value: any, element: HTMLElement, label?: string): void {
      if (!element || typeof document === 'undefined') return;
      
      addStyles();
      
      const stringified = safeStringify(value, currentOptions);
      const highlighted = syntaxHighlight(stringified);
      
      let content = '';
      if (label) {
        content = `<div><strong>${label}:</strong></div>${highlighted}`;
      } else {
        content = highlighted;
      }
      
      if (currentOptions.append) {
        const container = document.createElement('div');
        container.innerHTML = content;
        container.className = 'safe-stringify-output';
        if (currentOptions.className) {
          container.className += ` ${currentOptions.className}`;
        }
        element.appendChild(container);
      } else {
        element.innerHTML = `<div class="safe-stringify-output ${currentOptions.className || ''}">${content}</div>`;
      }
    },
    
    clear(element: HTMLElement): void {
      if (element) {
        element.innerHTML = '';
      }
    },
    
    setOptions(newOptions: Partial<HtmlLoggerOptions>): void {
      currentOptions = { ...currentOptions, ...newOptions };
    }
  };
  
  return logger;
}

/**
 * Logs a value to an HTML element
 * 
 * @param value - Value to log
 * @param element - HTML element to log to
 * @param label - Optional label for the logged value
 */
export function logToElement(value: any, element: HTMLElement, label?: string): void {
  const logger = createHtmlLogger();
  logger.log(value, element, label);
}