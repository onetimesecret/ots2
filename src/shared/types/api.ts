import { z } from 'zod'

/**
 * One-Time Secret API v2 Types
 * API Documentation: https://onetimesecret.dev/api/v2
 */

// Base API response schema
export const ApiResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  message: z.string().optional(),
})

// Secret metadata schema
export const SecretMetadataSchema = z.object({
  custid: z.string(),
  metadata_key: z.string(),
  secret_key: z.string(),
  ttl: z.number(),
  metadata_ttl: z.number(),
  secret_ttl: z.number(),
  state: z.string(),
  updated: z.number(),
  created: z.number(),
  recipient: z.array(z.string()).optional(),
  passphrase_required: z.boolean().optional(),
})

// Secret response schema (when creating a secret)
export const CreateSecretResponseSchema = ApiResponseSchema.extend({
  custid: z.string(),
  metadata_key: z.string(),
  secret_key: z.string(),
  ttl: z.number(),
  metadata_ttl: z.number(),
  secret_ttl: z.number(),
  passphrase_required: z.boolean().optional(),
})

// Secret content schema (when retrieving a secret)
export const RetrieveSecretResponseSchema = ApiResponseSchema.extend({
  secret_key: z.string(),
  value: z.string(),
})

// Error response schema
export const ErrorResponseSchema = z.object({
  status: z.literal('error'),
  message: z.string(),
  code: z.string().optional(),
})

// TypeScript types derived from Zod schemas
export type ApiResponse = z.infer<typeof ApiResponseSchema>
export type SecretMetadata = z.infer<typeof SecretMetadataSchema>
export type CreateSecretResponse = z.infer<typeof CreateSecretResponseSchema>
export type RetrieveSecretResponse = z.infer<typeof RetrieveSecretResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

// Request types
export interface CreateSecretRequest {
  secret: string
  passphrase?: string
  ttl?: number
  recipient?: string
  metadata?: Record<string, unknown>
}

export interface RetrieveSecretRequest {
  secret_key: string
  passphrase?: string
}

export interface GenerateSecretRequest {
  passphrase?: string
  ttl?: number
  recipient?: string
  metadata?: Record<string, unknown>
}

// API Configuration
export interface ApiConfig {
  baseUrl: string
  username?: string
  apiToken?: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

// Default API configuration
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://onetimesecret.dev/api/v2',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
}
