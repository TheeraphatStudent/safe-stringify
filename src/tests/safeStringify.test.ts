import { describe, it, expect } from 'vitest';
import { safeStringify } from '../safeStringify';

describe('safeStringify', () => {
  it('handles primitive values', () => {
    expect(safeStringify('test')).toBe('"test"');
    expect(safeStringify(123)).toBe('123');
    expect(safeStringify(true)).toBe('true');
    expect(safeStringify(null)).toBe('"null"');
    expect(safeStringify(undefined)).toBe('"undefined"');
  });

  it('handles arrays', () => {
    const result = JSON.parse(safeStringify([1, 2, 3]));
    expect(result).toEqual([1, 2, 3]);
  });

  it('handles objects', () => {
    const obj = { a: 1, b: 'test', c: true };
    const result = JSON.parse(safeStringify(obj));
    expect(result).toEqual(obj);
  });

  it('handles nested objects', () => {
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
    const result = JSON.parse(safeStringify(obj));
    expect(result).toEqual(obj);
  });

  it('handles dates', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    const result = JSON.parse(safeStringify(date));
    expect(result).toBe(date.toISOString());
  });

  it('handles regular expressions', () => {
    const regex = /test/g;
    const result = JSON.parse(safeStringify(regex));
    expect(result).toBe(regex.toString());
  });

  it('handles functions', () => {
    function test() { return 'hello'; }
    const result = JSON.parse(safeStringify(test));
    expect(result).toBe('[Function: test]');
  });

  it('handles errors', () => {
    const error = new Error('Test error');
    const result = JSON.parse(safeStringify(error));
    expect(result).toContain('Error: Test error');
    expect(result).toContain('stack');
  });

  it('handles circular references', () => {
    const obj: any = { a: 1, b: 2 };
    obj.self = obj;
    obj.nested = { parent: obj };
    
    const result = JSON.parse(safeStringify(obj));
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.self).toBe('[Circular]');
    expect(result.nested.parent).toBe('[Circular]');
  });

  it('respects maxDepth option', () => {
    const deepObj = { l1: { l2: { l3: { l4: { l5: 'deep' } } } } };
    
    const result1 = JSON.parse(safeStringify(deepObj, { maxDepth: 3 }));
    expect(result1.l1.l2.l3).toBe('[Max depth exceeded]');
    
    const result2 = JSON.parse(safeStringify(deepObj, { maxDepth: 5 }));
    expect(result2.l1.l2.l3.l4.l5).toBe('deep');
  });

  it('handles custom date formats', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    
    const isoResult = JSON.parse(safeStringify(date, { dateFormat: 'iso' }));
    expect(isoResult).toBe(date.toISOString());
    
    const timestampResult = JSON.parse(safeStringify(date, { dateFormat: 'timestamp' }));
    expect(timestampResult).toBe(date.getTime().toString());
  });
});