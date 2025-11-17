/**
 * Exponential backoff retry policy with jitter
 */

import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { NetworkError } from '@/core/error';

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  retryableStatusCodes: number[];
  shouldRetry?: (error: AxiosError) => boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

/**
 * Calculates exponential backoff delay with jitter
 * @param attempt - Current retry attempt (0-based)
 * @param config - Retry configuration
 * @returns Delay in milliseconds
 */
function calculateDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = Math.min(
    config.initialDelayMs * Math.pow(2, attempt),
    config.maxDelayMs,
  );

  // Add jitter (±25%)
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);

  return Math.floor(exponentialDelay + jitter);
}

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: AxiosError, config: RetryConfig): boolean {
  // Custom retry logic
  if (config.shouldRetry) {
    return config.shouldRetry(error);
  }

  // Network errors (no response)
  if (!error.response) {
    return true;
  }

  // Check status code
  const status = error.response.status;
  return config.retryableStatusCodes.includes(status);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Attaches retry interceptor to Axios instance
 * @param axios - Axios instance
 * @param config - Retry configuration
 */
export function attachRetryInterceptor(
  axios: AxiosInstance,
  config: Partial<RetryConfig> = {},
): void {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const requestConfig = error.config as InternalAxiosRequestConfig & {
        retryCount?: number;
      };

      if (!requestConfig) {
        return Promise.reject(error);
      }

      // Initialize retry count
      requestConfig.retryCount = requestConfig.retryCount || 0;

      // Check if we should retry
      const shouldRetry =
        requestConfig.retryCount < retryConfig.maxRetries &&
        isRetryableError(error, retryConfig);

      if (!shouldRetry) {
        return Promise.reject(error);
      }

      // Increment retry count
      requestConfig.retryCount++;

      // Calculate and wait for backoff delay
      const delay = calculateDelay(requestConfig.retryCount - 1, retryConfig);

      console.warn(
        `Request failed (attempt ${requestConfig.retryCount}/${retryConfig.maxRetries}). ` +
          `Retrying in ${delay}ms...`,
        error.message,
      );

      await sleep(delay);

      // Retry the request
      return axios(requestConfig);
    },
  );
}

/**
 * Retry a function with exponential backoff
 * Generic retry utility for non-HTTP operations
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this was the last attempt, throw
      if (attempt === retryConfig.maxRetries) {
        break;
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, retryConfig);
      console.warn(
        `Operation failed (attempt ${attempt + 1}/${retryConfig.maxRetries + 1}). ` +
          `Retrying in ${delay}ms...`,
        lastError.message,
      );

      await sleep(delay);
    }
  }

  throw new NetworkError(
    `Operation failed after ${retryConfig.maxRetries + 1} attempts: ${lastError?.message}`,
  );
}
