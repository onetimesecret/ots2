/**
 * Environment configuration - compile-time flags only
 * NEVER store secrets here
 */

export const ENV = {
  /** Base URL for One-Time Secret API */
  OTS_API_BASE: import.meta.env.VITE_OTS_BASE || 'https://onetimesecret.com/api',

  /** Feature flags */
  ENABLE_CERT_PINNING: import.meta.env.VITE_ENABLE_CERT_PINNING === 'true',
  ENABLE_SENTRY: import.meta.env.VITE_ENABLE_SENTRY === 'true',

  /** Development mode */
  DEV_MODE: import.meta.env.DEV,

  /** Sentry DSN (only if enabled) */
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
} as const;

/**
 * Validates environment configuration on startup
 * @throws {Error} if critical config is missing
 */
export function validateEnv(): void {
  if (!ENV.OTS_API_BASE) {
    throw new Error('VITE_OTS_BASE is required');
  }

  if (ENV.ENABLE_SENTRY && !ENV.SENTRY_DSN) {
    throw new Error('VITE_SENTRY_DSN is required when Sentry is enabled');
  }

  // Validate API base URL format
  try {
    new URL(ENV.OTS_API_BASE);
  } catch {
    throw new Error(`Invalid VITE_OTS_BASE URL: ${ENV.OTS_API_BASE}`);
  }
}
