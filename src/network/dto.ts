/**
 * Data Transfer Objects (DTOs) for One-Time Secret v2 API
 * Generated from OpenAPI spec with Zod validation
 */

import { z } from 'zod';

// ============================================================================
// Request DTOs
// ============================================================================

export const CreateSecretDtoSchema = z.object({
  secret: z.string().min(1, 'Secret cannot be empty'),
  passphrase: z.string().optional(),
  ttl: z.number().int().min(300).max(604800).optional(), // 5 min to 7 days
  recipient: z.string().email().optional(),
  metadata_key: z.string().optional(),
  metadata_value: z.string().optional(),
});

export type CreateSecretDto = z.infer<typeof CreateSecretDtoSchema>;

export const GetSecretDtoSchema = z.object({
  secret_key: z.string(),
  passphrase: z.string().optional(),
});

export type GetSecretDto = z.infer<typeof GetSecretDtoSchema>;

// ============================================================================
// Response DTOs
// ============================================================================

export const SecretResponseSchema = z.object({
  custid: z.string(),
  metadata_key: z.string(),
  secret_key: z.string(),
  ttl: z.number(),
  metadata_ttl: z.number(),
  secret_ttl: z.number(),
  state: z.enum(['new', 'received', 'burned']),
  updated: z.number(),
  created: z.number(),
  recipient: z.array(z.string()).optional(),
  passphrase_required: z.boolean(),
  value: z.string().optional(), // Only present when retrieving
});

export type SecretResponse = z.infer<typeof SecretResponseSchema>;

export const MetadataResponseSchema = z.object({
  custid: z.string(),
  metadata_key: z.string(),
  secret_key: z.string(),
  ttl: z.number(),
  metadata_ttl: z.number(),
  secret_ttl: z.number(),
  state: z.enum(['new', 'received', 'burned']),
  updated: z.number(),
  created: z.number(),
  recipient: z.array(z.string()).optional(),
  passphrase_required: z.boolean(),
});

export type MetadataResponse = z.infer<typeof MetadataResponseSchema>;

export const ErrorResponseSchema = z.object({
  error: z.string().optional(),
  message: z.string(),
  code: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Builds a shareable URL for a secret
 */
export function buildSecretUrl(baseUrl: string, secretKey: string): string {
  return `${baseUrl}/secret/${secretKey}`;
}

/**
 * Builds a shareable URL for metadata
 */
export function buildMetadataUrl(baseUrl: string, metadataKey: string): string {
  return `${baseUrl}/private/${metadataKey}`;
}
