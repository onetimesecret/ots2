/**
 * Unit tests for error classes
 */

import { describe, it, expect } from 'vitest';
import {
  BaseError,
  NetworkError,
  ApiError,
  AuthError,
  CryptoError,
  StorageError,
  ValidationError,
  ConfigError,
  isBaseError,
  getErrorMessage,
} from '@/core/error';

describe('Error Classes', () => {
  it('should create NetworkError with correct properties', () => {
    const error = new NetworkError('Network failed', 500);
    expect(error).toBeInstanceOf(BaseError);
    expect(error.name).toBe('NetworkError');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).toBe('Network failed');
    expect(error.statusCode).toBe(500);
  });

  it('should create ApiError with response data', () => {
    const response = { error: 'Not found' };
    const error = new ApiError('API error', 404, response);
    expect(error).toBeInstanceOf(BaseError);
    expect(error.name).toBe('ApiError');
    expect(error.code).toBe('API_ERROR');
    expect(error.statusCode).toBe(404);
    expect(error.response).toEqual(response);
  });

  it('should create AuthError with default 401 status', () => {
    const error = new AuthError('Unauthorized');
    expect(error.statusCode).toBe(401);
  });

  it('should create ValidationError with field errors', () => {
    const fields = { email: ['Invalid email'], password: ['Too short'] };
    const error = new ValidationError('Validation failed', fields);
    expect(error.fields).toEqual(fields);
    expect(error.statusCode).toBe(422);
  });

  it('should identify BaseError instances', () => {
    const error = new CryptoError('Crypto failed');
    expect(isBaseError(error)).toBe(true);
    expect(isBaseError(new Error('Regular error'))).toBe(false);
    expect(isBaseError('string error')).toBe(false);
  });

  it('should extract error messages from various error types', () => {
    expect(getErrorMessage(new NetworkError('Network error'))).toBe('Network error');
    expect(getErrorMessage(new Error('Regular error'))).toBe('Regular error');
    expect(getErrorMessage('String error')).toBe('String error');
    expect(getErrorMessage({ unknown: 'object' })).toBe('An unknown error occurred');
  });

  it('should serialize errors to JSON', () => {
    const error = new StorageError('Storage failed');
    const json = error.toJSON();
    expect(json).toEqual({
      name: 'StorageError',
      code: 'STORAGE_ERROR',
      message: 'Storage failed',
      statusCode: undefined,
    });
  });
});
