/**
 * One-Time Secret v2 REST API Client
 * Type-safe, testable client with automatic retries and auth
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { inject, injectable, singleton } from 'tsyringe';
import { SecureStorageService } from '@/security/secure_kv';
import { ENV } from '@/core/env';
import { ApiError, AuthError, ValidationError } from '@/core/error';
import { attachRetryInterceptor } from './retry_policy';
import { attachCertificatePinning } from './cert_pin';
import {
  CreateSecretDto,
  CreateSecretDtoSchema,
  GetSecretDto,
  SecretResponse,
  SecretResponseSchema,
  MetadataResponse,
  MetadataResponseSchema,
  ErrorResponse,
  ErrorResponseSchema,
} from './dto';

@singleton()
export class OtsV2Client {
  private readonly http: AxiosInstance;

  constructor(
    @inject('SecureStorageService') private readonly secure: SecureStorageService,
  ) {
    // Create Axios instance with base configuration
    this.http = axios.create({
      baseURL: ENV.OTS_API_BASE,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // Attach interceptors
    this.setupInterceptors();
  }

  /**
   * Set up request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.http.interceptors.request.use(
      async (config) => {
        const token = await this.secure.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - handle errors
    this.http.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      },
    );

    // Attach retry policy
    attachRetryInterceptor(this.http, {
      maxRetries: 3,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    });

    // Attach certificate pinning (if enabled)
    attachCertificatePinning(this.http);
  }

  /**
   * Handle API errors and convert to application errors
   */
  private handleError(error: AxiosError): Error {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Try to parse error response
      const errorParse = ErrorResponseSchema.safeParse(data);
      const message = errorParse.success
        ? errorParse.data.message
        : 'An error occurred';

      // Handle specific status codes
      if (status === 401 || status === 403) {
        return new AuthError(message, status);
      }

      if (status === 422) {
        return new ValidationError(message);
      }

      return new ApiError(message, status, data);
    }

    if (error.request) {
      // Request made but no response
      return new ApiError('No response from server', 0);
    }

    // Something else happened
    return new ApiError(error.message || 'Unknown error', 0);
  }

  // =========================================================================
  // API Methods
  // =========================================================================

  /**
   * Create a new secret
   * @param dto - Secret creation parameters
   * @returns Secret metadata including keys
   */
  async createSecret(dto: CreateSecretDto): Promise<SecretResponse> {
    // Validate input
    const validated = CreateSecretDtoSchema.parse(dto);

    const { data } = await this.http.post<SecretResponse>(
      '/v2/secret',
      validated,
    );

    return SecretResponseSchema.parse(data);
  }

  /**
   * Retrieve a secret (burns it)
   * @param secretKey - The secret key
   * @param passphrase - Optional passphrase if required
   * @returns Secret data
   */
  async getSecret(secretKey: string, passphrase?: string): Promise<SecretResponse> {
    const params: GetSecretDto = { secret_key: secretKey };
    if (passphrase) {
      params.passphrase = passphrase;
    }

    const { data } = await this.http.post<SecretResponse>(
      `/v2/secret/${secretKey}`,
      params,
    );

    return SecretResponseSchema.parse(data);
  }

  /**
   * Get secret metadata without burning it
   * @param metadataKey - The metadata key
   * @returns Secret metadata
   */
  async getMetadata(metadataKey: string): Promise<MetadataResponse> {
    const { data } = await this.http.post<MetadataResponse>(
      `/v2/private/${metadataKey}`,
    );

    return MetadataResponseSchema.parse(data);
  }

  /**
   * Burn a secret without retrieving it
   * @param metadataKey - The metadata key
   * @returns Updated metadata
   */
  async burnSecret(metadataKey: string): Promise<MetadataResponse> {
    const { data } = await this.http.post<MetadataResponse>(
      `/v2/private/${metadataKey}/burn`,
    );

    return MetadataResponseSchema.parse(data);
  }

  /**
   * Get recent metadata (requires authentication)
   * @returns Array of recent secrets metadata
   */
  async getRecentMetadata(): Promise<MetadataResponse[]> {
    const { data } = await this.http.get<MetadataResponse[]>(
      '/v2/private/recent',
    );

    if (!Array.isArray(data)) {
      throw new ApiError('Invalid response format', 200);
    }

    return data.map((item) => MetadataResponseSchema.parse(item));
  }

  /**
   * Check API status
   * @returns true if API is reachable
   */
  async checkStatus(): Promise<boolean> {
    try {
      await this.http.get('/v2/status');
      return true;
    } catch {
      return false;
    }
  }
}
