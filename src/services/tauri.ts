/**
 * Tauri IPC service layer
 * Provides type-safe wrappers around Tauri commands
 */

import { invoke } from '@tauri-apps/api/core';
import type {
  ApiCredentials,
  CreateSecretResponse,
  RetrieveSecretResponse,
  SecretMetadata,
} from '@/types';

/**
 * Create a new secret
 */
export async function createSecret(
  secret: string,
  passphrase?: string,
  ttl?: number,
  recipient?: string
): Promise<CreateSecretResponse> {
  return await invoke<CreateSecretResponse>('create_secret', {
    secret,
    passphrase,
    ttl,
    recipient,
  });
}

/**
 * Retrieve a secret
 */
export async function retrieveSecret(
  secretKey: string,
  passphrase?: string
): Promise<RetrieveSecretResponse> {
  return await invoke<RetrieveSecretResponse>('retrieve_secret', {
    secretKey,
    passphrase,
  });
}

/**
 * Delete/burn a secret
 */
export async function deleteSecret(metadataKey: string): Promise<SecretMetadata> {
  return await invoke<SecretMetadata>('delete_secret', {
    metadataKey,
  });
}

/**
 * Get secret metadata
 */
export async function getSecretMetadata(metadataKey: string): Promise<SecretMetadata> {
  return await invoke<SecretMetadata>('get_secret_metadata', {
    metadataKey,
  });
}

/**
 * Save API credentials
 */
export async function saveCredentials(
  username: string,
  apiKey: string,
  endpoint: string
): Promise<void> {
  return await invoke<void>('save_credentials', {
    username,
    apiKey,
    endpoint,
  });
}

/**
 * Get API credentials
 */
export async function getCredentials(): Promise<ApiCredentials> {
  return await invoke<ApiCredentials>('get_credentials');
}

/**
 * Delete API credentials
 */
export async function deleteCredentials(): Promise<void> {
  return await invoke<void>('delete_credentials');
}

/**
 * Test API connection
 */
export async function testConnection(): Promise<void> {
  return await invoke<void>('test_connection');
}
