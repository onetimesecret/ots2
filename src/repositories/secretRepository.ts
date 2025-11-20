import { invoke } from '@tauri-apps/api/core'

export interface CreateSecretRequest {
  secret: string
  passphrase?: string
  ttl: number
  recipient?: string
}

export interface CreateSecretResponse {
  link: string
  secretKey: string
  metadataKey: string
}

export interface RetrieveSecretRequest {
  key: string
  passphrase?: string
}

export interface RetrieveSecretResponse {
  secret: string
  metadata?: {
    createdAt: string
    expiresAt: string
  }
}

/**
 * Repository for secret operations
 * Follows the repository pattern for clean separation of concerns
 */
export function useSecretRepository() {
  /**
   * Create a new secret
   * @param request - The secret creation request
   * @returns Response with secret link and keys
   */
  async function createSecret(
    request: CreateSecretRequest
  ): Promise<CreateSecretResponse> {
    try {
      const response = await invoke<CreateSecretResponse>('create_secret', {
        request
      })
      return response
    } catch (error) {
      console.error('Failed to create secret:', error)
      throw error
    }
  }

  /**
   * Retrieve a secret by key
   * Note: This burns the secret - it can only be retrieved once
   * @param request - The secret retrieval request
   * @returns The secret content and metadata
   */
  async function retrieveSecret(
    request: RetrieveSecretRequest
  ): Promise<RetrieveSecretResponse> {
    try {
      const response = await invoke<RetrieveSecretResponse>('retrieve_secret', {
        request
      })
      return response
    } catch (error) {
      console.error('Failed to retrieve secret:', error)
      throw error
    }
  }

  /**
   * Get secret metadata without burning it
   * @param metadataKey - The metadata key for the secret
   * @returns Secret metadata
   */
  async function getSecretMetadata(metadataKey: string): Promise<any> {
    try {
      const response = await invoke('get_secret_metadata', { metadataKey })
      return response
    } catch (error) {
      console.error('Failed to get secret metadata:', error)
      throw error
    }
  }

  return {
    createSecret,
    retrieveSecret,
    getSecretMetadata
  }
}
