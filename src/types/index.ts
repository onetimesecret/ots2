/**
 * TypeScript type definitions for the application
 */

/** API credentials */
export interface ApiCredentials {
  username: string;
  api_key: string;
  endpoint: string;
}

/** Error response from Tauri commands */
export interface ErrorResponse {
  error: string;
  code: string;
}

/** Request to create a secret */
export interface CreateSecretRequest {
  secret: string;
  passphrase?: string;
  ttl?: number;
  recipient?: string;
}

/** Response from creating a secret */
export interface CreateSecretResponse {
  secret_key: string;
  metadata_key: string;
  ttl: number;
  metadata_ttl: number;
  secret_ttl: number;
  state: string;
  updated: number;
  created: number;
  recipient?: string[];
  passphrase_required?: boolean;
}

/** Request to retrieve a secret */
export interface RetrieveSecretRequest {
  secret_key: string;
  passphrase?: string;
}

/** Response from retrieving a secret */
export interface RetrieveSecretResponse {
  secret_key: string;
  value: string;
  metadata_key?: string;
}

/** Secret metadata */
export interface SecretMetadata {
  secret_key: string;
  metadata_key: string;
  ttl: number;
  metadata_ttl: number;
  secret_ttl: number;
  state: string;
  updated: number;
  created: number;
  recipient?: string[];
  passphrase_required?: boolean;
  received?: number;
}

/** Secret list item for UI */
export interface SecretListItem {
  metadata_key: string;
  secret_key: string;
  created: number;
  ttl: number;
  state: string;
  passphrase_required: boolean;
}

/**
 * Type guard to check if an error is an ErrorResponse
 */
export function isErrorResponse(error: unknown): error is ErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as ErrorResponse).error === 'string'
  );
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isErrorResponse(error)) {
    return error.error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
