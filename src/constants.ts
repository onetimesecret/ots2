/**
 * Application constants
 */

/** Default API endpoint for OneTimeSecret */
export const DEFAULT_API_ENDPOINT = 'https://onetimesecret.com';

/** Time-to-live options in seconds */
export const TTL_OPTIONS = {
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  FOUR_HOURS: 14400,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
} as const;

/** TTL option labels */
export const TTL_LABELS: Record<number, string> = {
  [TTL_OPTIONS.FIVE_MINUTES]: '5 minutes',
  [TTL_OPTIONS.FIFTEEN_MINUTES]: '15 minutes',
  [TTL_OPTIONS.THIRTY_MINUTES]: '30 minutes',
  [TTL_OPTIONS.ONE_HOUR]: '1 hour',
  [TTL_OPTIONS.FOUR_HOURS]: '4 hours',
  [TTL_OPTIONS.ONE_DAY]: '1 day',
  [TTL_OPTIONS.ONE_WEEK]: '7 days',
};

/** Error codes from backend */
export const ERROR_CODES = {
  API_ERROR: 'API_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  CONFIG_ERROR: 'CONFIG_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  SERIALIZATION_ERROR: 'SERIALIZATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
} as const;

/** Secret states */
export const SECRET_STATES = {
  NEW: 'new',
  RECEIVED: 'received',
  BURNED: 'burned',
} as const;
