/**
 * Sealed error classes for type-safe error handling
 * All application errors should extend BaseError
 */

export abstract class BaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

/** Network-related errors */
export class NetworkError extends BaseError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode);
  }
}

/** API errors from One-Time Secret */
export class ApiError extends BaseError {
  constructor(
    message: string,
    statusCode: number,
    public readonly response?: unknown,
  ) {
    super(message, 'API_ERROR', statusCode);
  }
}

/** Authentication/authorization errors */
export class AuthError extends BaseError {
  constructor(message: string, statusCode = 401) {
    super(message, 'AUTH_ERROR', statusCode);
  }
}

/** Encryption/decryption errors */
export class CryptoError extends BaseError {
  constructor(message: string) {
    super(message, 'CRYPTO_ERROR');
  }
}

/** Secure storage errors */
export class StorageError extends BaseError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR');
  }
}

/** Validation errors */
export class ValidationError extends BaseError {
  constructor(
    message: string,
    public readonly fields?: Record<string, string[]>,
  ) {
    super(message, 'VALIDATION_ERROR', 422);
  }
}

/** Configuration errors */
export class ConfigError extends BaseError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR');
  }
}

/**
 * Type guard to check if error is a BaseError
 */
export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}

/**
 * Safely extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isBaseError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred';
}
