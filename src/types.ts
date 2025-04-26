export type ValueType = 
  | 'undefined' 
  | 'null' 
  | 'string' 
  | 'number' 
  | 'boolean'
  | 'function' 
  | 'symbol'
  | 'bigint' 
  | 'object' 
  | 'array' 
  | 'date' 
  | 'error' 
  | 'regexp' 
  | 'node' 
  | 'window';

export interface StringifyOptions {
  /**
   * Maximum depth to traverse objects
   * @default 10
   */
  maxDepth?: number;

  /**
   * Space value for JSON.stringify
   * @default 2
   */
  indentation?: number;

  /**
   * Whether to include function names and bodies
   * @default true
   */
  showFunctions?: boolean;

  /**
   * Format for date objects: 'iso', 'locale', or 'timestamp'
   * @default 'iso'
   */
  dateFormat?: 'iso' | 'locale' | 'timestamp';

  /**
   * Custom value handlers for specific types
   */
  handlers?: Partial<Record<ValueType, (value: any) => string>>;
}

export interface LoggerOptions extends StringifyOptions {
  /**
   * Whether to use colors in console output
   * @default true in supported environments
   */
  colors?: boolean;
  
  /**
   * Console method to use
   * @default 'log'
   */
  method?: 'log' | 'info' | 'warn' | 'error' | 'debug';
}

export interface HtmlLoggerOptions extends StringifyOptions {
  /**
   * Whether to use syntax highlighting in HTML output
   * @default true
   */
  highlight?: boolean;
  
  /**
   * CSS class to add to the output element
   */
  className?: string;
  
  /**
   * Whether to append to element or replace content
   * @default false (replace)
   */
  append?: boolean;
}

export interface Logger {
  log: (value: any, label?: string) => void;
  clear: () => void;
  setOptions: (options: Partial<LoggerOptions>) => void;
}

export interface HtmlLogger {
  log: (value: any, element: HTMLElement, label?: string) => void;
  clear: (element: HTMLElement) => void;
  setOptions: (options: Partial<HtmlLoggerOptions>) => void;
}