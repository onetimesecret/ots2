import { invoke } from '@tauri-apps/api/core'
import { ref } from 'vue'
import type {
  CreateSecretRequest,
  RetrieveSecretRequest,
  SecretResponse,
  SecretValue,
  SecretMetadata,
  Result,
} from '@/types/api'
import { useSecretsStore } from '@/stores/secrets'

export function useSecrets() {
  const store = useSecretsStore()
  const loading = ref(false)

  /**
   * Create a new secret
   */
  async function createSecret(
    request: CreateSecretRequest
  ): Promise<Result<SecretResponse>> {
    loading.value = true
    store.clearError()

    try {
      const result = await invoke<SecretResponse>('create_secret', {
        secret: request.secret,
        passphrase: request.passphrase,
        ttl: request.ttl || store.settings.default_ttl,
        recipient: request.recipient,
      })

      // Add to recent secrets
      store.addRecentSecret({
        id: result.id,
        created: result.created,
        ttl: result.ttl,
        secret_key: result.secret_key,
        metadata_key: result.metadata_key,
        passphrase_required: result.passphrase_required,
      })

      return { ok: true, value: result }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create secret'
      store.setError(message)
      return {
        ok: false,
        error: {
          message,
          code: 'CREATE_FAILED',
          status: 500,
        },
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Retrieve a secret by its key
   */
  async function retrieveSecret(
    request: RetrieveSecretRequest
  ): Promise<Result<SecretValue>> {
    loading.value = true
    store.clearError()

    try {
      const result = await invoke<SecretValue>('retrieve_secret', {
        secretKey: request.secret_key,
        passphrase: request.passphrase,
      })

      return { ok: true, value: result }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve secret'
      store.setError(message)
      return {
        ok: false,
        error: {
          message,
          code: 'RETRIEVE_FAILED',
          status: 500,
        },
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Get metadata for a secret
   */
  async function getSecretMetadata(
    metadataKey: string
  ): Promise<Result<SecretMetadata>> {
    loading.value = true
    store.clearError()

    try {
      const result = await invoke<SecretMetadata>('get_secret_metadata', {
        metadataKey,
      })

      return { ok: true, value: result }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get metadata'
      store.setError(message)
      return {
        ok: false,
        error: {
          message,
          code: 'METADATA_FAILED',
          status: 500,
        },
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    createSecret,
    retrieveSecret,
    getSecretMetadata,
  }
}
