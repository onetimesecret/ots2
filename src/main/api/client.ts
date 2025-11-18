import axios, { AxiosInstance, AxiosError } from 'axios'
import axiosRetry from 'axios-retry'
import {
  ApiConfig,
  DEFAULT_API_CONFIG,
  CreateSecretRequest,
  CreateSecretResponse,
  CreateSecretResponseSchema,
  RetrieveSecretRequest,
  RetrieveSecretResponse,
  RetrieveSecretResponseSchema,
  SecretMetadata,
  SecretMetadataSchema,
  ErrorResponse,
  ErrorResponseSchema,
} from '@shared/types'
import { getSecureItem } from '../storage/secure-storage'
import { SecureStorageKey } from '@shared/types/app'

/**
 * OTS API Client with secure authentication and retry logic
 */
export class OtsApiClient {
  private client: AxiosInstance
  private config: ApiConfig

  constructor(config?: Partial<ApiConfig>) {
    this.config = { ...DEFAULT_API_CONFIG, ...config }

    // Create axios instance
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    // Setup retry logic
    axiosRetry(this.client, {
      retries: this.config.retryAttempts || 3,
      retryDelay: (retryCount) => {
        return (this.config.retryDelay || 1000) * Math.pow(2, retryCount - 1)
      },
      retryCondition: (error: AxiosError) => {
        // Retry on network errors and 5xx errors
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status !== undefined && error.response.status >= 500)
        )
      },
    })

    // Setup request interceptor for authentication
    this.client.interceptors.request.use(async (config) => {
      // Get credentials from secure storage
      const username = await getSecureItem(SecureStorageKey.API_USERNAME)
      const apiToken = await getSecureItem(SecureStorageKey.API_TOKEN)

      if (username && apiToken) {
        // Use basic auth
        const credentials = Buffer.from(`${username}:${apiToken}`).toString('base64')
        config.headers.Authorization = `Basic ${credentials}`
      }

      return config
    })

    // Setup response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with error
          const errorData = error.response.data
          const parsedError = ErrorResponseSchema.safeParse(errorData)

          if (parsedError.success) {
            throw new ApiError(parsedError.data.message, parsedError.data.code)
          }
        }

        // Network or other error
        throw new ApiError(error.message)
      }
    )
  }

  /**
   * Create a new secret
   */
  async createSecret(request: CreateSecretRequest): Promise<CreateSecretResponse> {
    const response = await this.client.post('/share', {
      secret: request.secret,
      passphrase: request.passphrase,
      ttl: request.ttl,
      recipient: request.recipient,
      metadata: request.metadata,
    })

    // Validate response with Zod
    const parsed = CreateSecretResponseSchema.parse(response.data)
    return parsed
  }

  /**
   * Retrieve a secret
   */
  async retrieveSecret(request: RetrieveSecretRequest): Promise<RetrieveSecretResponse> {
    const url = `/secret/${request.secret_key}`

    const response = await this.client.post(url, {
      passphrase: request.passphrase,
    })

    // Validate response with Zod
    const parsed = RetrieveSecretResponseSchema.parse(response.data)
    return parsed
  }

  /**
   * Generate a random secret
   */
  async generateSecret(request: {
    passphrase?: string
    ttl?: number
    recipient?: string
  }): Promise<CreateSecretResponse> {
    const response = await this.client.post('/generate', {
      passphrase: request.passphrase,
      ttl: request.ttl,
      recipient: request.recipient,
    })

    // Validate response with Zod
    const parsed = CreateSecretResponseSchema.parse(response.data)
    return parsed
  }

  /**
   * Get metadata for a secret
   */
  async getMetadata(metadataKey: string): Promise<SecretMetadata> {
    const response = await this.client.post(`/private/${metadataKey}`)

    // Validate response with Zod
    const parsed = SecretMetadataSchema.parse(response.data)
    return parsed
  }

  /**
   * Update API configuration
   */
  updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config }

    // Update base URL if changed
    if (config.baseUrl) {
      this.client.defaults.baseURL = config.baseUrl
    }

    // Update timeout if changed
    if (config.timeout) {
      this.client.defaults.timeout = config.timeout
    }
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Singleton instance
let apiClientInstance: OtsApiClient | null = null

/**
 * Get the API client instance
 */
export function getApiClient(): OtsApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new OtsApiClient()
  }
  return apiClientInstance
}

/**
 * Reset the API client instance (useful for testing)
 */
export function resetApiClient(): void {
  apiClientInstance = null
}
