/**
 * API Type Definitions for OneTimeSecret
 * These types match the OTS API v2 specification
 */

export interface SecretMetadata {
  id: string
  created: string
  ttl: number
  metadata_key?: string
  secret_key?: string
  passphrase_required: boolean
}

export interface SecretResponse {
  id: string
  secret_key: string
  metadata_key: string
  ttl: number
  created: string
  updated: string
  passphrase_required: boolean
}

export interface SecretValue {
  value: string
  secret_key: string
  metadata_key?: string
}

export interface CreateSecretRequest {
  secret: string
  passphrase?: string
  ttl?: number
  recipient?: string
}

export interface RetrieveSecretRequest {
  secret_key: string
  passphrase?: string
}

export interface ApiError {
  message: string
  code: string
  status: number
}

export interface AppSettings {
  api_endpoint: string
  default_ttl: number
  theme: 'light' | 'dark' | 'system'
  api_username?: string
  api_key?: string
}

export type Result<T, E = ApiError> =
  | { ok: true; value: T }
  | { ok: false; error: E }
