import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  CreateSecretRequest,
  CreateSecretResponse,
  RetrieveSecretRequest,
  RetrieveSecretResponse,
  SecretMetadata,
} from '@shared/types'
import { useAppStore } from './app'

/**
 * Secrets management store
 */
export const useSecretsStore = defineStore('secrets', () => {
  const appStore = useAppStore()

  // State
  const recentSecrets = ref<CreateSecretResponse[]>([])
  const currentSecret = ref<RetrieveSecretResponse | null>(null)
  const currentMetadata = ref<SecretMetadata | null>(null)

  // Actions
  async function createSecret(request: CreateSecretRequest): Promise<CreateSecretResponse> {
    appStore.setLoading(true)
    appStore.clearError()

    try {
      const result = await window.electronAPI.api.createSecret(request)

      if (result.success && result.data) {
        // Add to recent secrets
        recentSecrets.value.unshift(result.data)

        // Keep only last 10 secrets
        if (recentSecrets.value.length > 10) {
          recentSecrets.value = recentSecrets.value.slice(0, 10)
        }

        return result.data
      } else {
        throw new Error(result.error || 'Failed to create secret')
      }
    } catch (error: any) {
      appStore.setError(error.message)
      throw error
    } finally {
      appStore.setLoading(false)
    }
  }

  async function retrieveSecret(
    request: RetrieveSecretRequest
  ): Promise<RetrieveSecretResponse> {
    appStore.setLoading(true)
    appStore.clearError()

    try {
      const result = await window.electronAPI.api.retrieveSecret(request)

      if (result.success && result.data) {
        currentSecret.value = result.data
        return result.data
      } else {
        throw new Error(result.error || 'Failed to retrieve secret')
      }
    } catch (error: any) {
      appStore.setError(error.message)
      throw error
    } finally {
      appStore.setLoading(false)
    }
  }

  async function generateSecret(request: {
    passphrase?: string
    ttl?: number
    recipient?: string
  }): Promise<CreateSecretResponse> {
    appStore.setLoading(true)
    appStore.clearError()

    try {
      const result = await window.electronAPI.api.generateSecret(request)

      if (result.success && result.data) {
        // Add to recent secrets
        recentSecrets.value.unshift(result.data)

        // Keep only last 10 secrets
        if (recentSecrets.value.length > 10) {
          recentSecrets.value = recentSecrets.value.slice(0, 10)
        }

        return result.data
      } else {
        throw new Error(result.error || 'Failed to generate secret')
      }
    } catch (error: any) {
      appStore.setError(error.message)
      throw error
    } finally {
      appStore.setLoading(false)
    }
  }

  async function getMetadata(metadataKey: string): Promise<SecretMetadata> {
    appStore.setLoading(true)
    appStore.clearError()

    try {
      const result = await window.electronAPI.api.getMetadata(metadataKey)

      if (result.success && result.data) {
        currentMetadata.value = result.data
        return result.data
      } else {
        throw new Error(result.error || 'Failed to get metadata')
      }
    } catch (error: any) {
      appStore.setError(error.message)
      throw error
    } finally {
      appStore.setLoading(false)
    }
  }

  function clearCurrentSecret() {
    currentSecret.value = null
  }

  function clearRecentSecrets() {
    recentSecrets.value = []
  }

  return {
    // State
    recentSecrets,
    currentSecret,
    currentMetadata,

    // Actions
    createSecret,
    retrieveSecret,
    generateSecret,
    getMetadata,
    clearCurrentSecret,
    clearRecentSecrets,
  }
})
