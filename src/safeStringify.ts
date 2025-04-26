import type { StringifyOptions, ValueType } from './types';

/**
 * Safely converts any JavaScript value to a JSON string, handling circular references
 * and special objects like DOM nodes, functions, symbols, and errors.
 * 
 * @param value - The value to stringify
 * @param options - Configuration options
 * @returns A formatted JSON string representation of the value
 */
export function safeStringify(value: any, options: StringifyOptions = {}): string {
  const {
    maxDepth = 10,
    indentation = 2,
    showFunctions = true,
    dateFormat = 'iso',
    handlers = {},
  } = options;

  const seen = new WeakSet();
  let currentDepth = 0;

  const getType = (value: any): ValueType => {
    if (value === null) return 'null';
    if (typeof value === 'undefined') return 'undefined';
    
    // Browser-specific objects
    if (typeof window !== 'undefined') {
      if (value === window) return 'window';
      if (typeof Node !== 'undefined' && value instanceof Node) return 'node';
    }
    
    if (value instanceof Error) return 'error';
    if (value instanceof Date) return 'date';
    if (value instanceof RegExp) return 'regexp';
    if (Array.isArray(value)) return 'array';
    
    return typeof value as ValueType;
  };

  const getStringValue = (value: any, type: ValueType): any => {
    // Use custom handler if provided
    if (handlers[type]) {
      return handlers[type]!(value);
    }

    const typeHandlers: Record<ValueType, (v: any) => any> = {
      undefined: () => 'undefined',
      null: () => 'null',
      function: (v) => showFunctions 
        ? `[Function: ${v.name || 'anonymous'}]${v.toString().includes('{') ? `\n${v.toString()}` : ''}`
        : `[Function: ${v.name || 'anonymous'}]`,
      symbol: (v) => v.toString(),
      node: (v) => `[${v.nodeName || 'Node'}]`,
      error: (v) => `${v.name}: ${v.message}\n${v.stack}`,
      date: (v) => {
        if (dateFormat === 'iso') return v.toISOString();
        if (dateFormat === 'locale') return v.toLocaleString();
        return v.getTime().toString();
      },
      regexp: (v) => v.toString(),
      window: () => '[Window]',
      bigint: (v) => v.toString() + 'n',
      number: (v) => isNaN(v) ? 'NaN' : isFinite(v) ? v : v < 0 ? '-Infinity' : 'Infinity',
      string: (v) => v,
      boolean: (v) => v,
      object: (v) => v,  // Processed by processValue
      array: (v) => v,   // Processed by processValue
    };

    return typeHandlers[type](value);
  };

  const processValue = (value: any, depth = 0): any => {
    currentDepth = depth;
    if (depth > maxDepth) return '[Max depth exceeded]';
    
    const type = getType(value);

    if (type === 'object' || type === 'array') {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);

      const result = type === 'array' ? [] : {};
      
      try {
        for (const key in value) {
          try {
            result[key] = processValue(value[key], depth + 1);
          } catch (err) {
            result[key] = `[Error extracting property: ${err instanceof Error ? err.message : String(err)}]`;
          }
        }
      } catch (err) {
        return `[Error iterating: ${err instanceof Error ? err.message : String(err)}]`;
      }
      
      return result;
    }

    return getStringValue(value, type);
  };

  try {
    const processed = processValue(value);
    return JSON.stringify(processed, null, indentation);
  } catch (err) {
    return `[Stringify Error: ${err instanceof Error ? err.message : String(err)}]`;
  }
}

/**
 * Shorthand for safeStringify with compact output (no indentation)
 */
export function safeStringifyCompact(value: any, options: Omit<StringifyOptions, 'indentation'> = {}): string {
  return safeStringify(value, { ...options, indentation: 0 });
}