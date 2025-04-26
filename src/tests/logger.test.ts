import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createLogger } from '../logger';

describe('logger', () => {
  let consoleSpy: any;
  
  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  
  it('creates a logger instance', () => {
    const logger = createLogger();
    expect(logger).toHaveProperty('log');
    expect(logger).toHaveProperty('clear');
    expect(logger).toHaveProperty('setOptions');
  });
  
  it('logs to console', () => {
    const logger = createLogger();
    logger.log({ test: 'value' });
    expect(consoleSpy).toHaveBeenCalled();
  });
  
  it('respects method option', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const logger = createLogger({ method: 'warn' });
    logger.log({ test: 'value' });
    
    expect(consoleSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    
    warnSpy.mockRestore();
  });
  
  it('allows changing options', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const logger = createLogger();
    logger.log({ test: 'value' });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockClear();
    
    logger.setOptions({ method: 'warn' });
    logger.log({ test: 'value' });
    expect(consoleSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    
    warnSpy.mockRestore();
  });
  
  it('handles labeled logs', () => {
    const logger = createLogger();
    logger.log({ test: 'value' }, 'Test Label');
    expect(consoleSpy).toHaveBeenCalled();
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[0]).toContain('Test Label');
  });
});