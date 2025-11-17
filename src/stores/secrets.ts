import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SecretMetadata, SecretResponse, AppSettings } from '@/types/api'

export const useSecretsStore = defineStore('secrets', () => {
  // State
  const recentSecrets = ref<SecretMetadata[]>([])
  const settings = ref<AppSettings>({
    apiEndpoint: 'https://onetimesecret.dev',
    defaultTTL: 604800, // 7 days in seconds
    theme: 'system',
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  function addRecentSecret(secret: SecretMetadata) {
    // Add to beginning of array, limit to 10 most recent
    recentSecrets.value = [secret, ...recentSecrets.value.slice(0, 9)]
  }

  function clearRecentSecrets() {
    recentSecrets.value = []
  }

  function updateSettings(newSettings: Partial<AppSettings>) {
    settings.value = { ...settings.value, ...newSettings }
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setError(message: string | null) {
    error.value = message
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    recentSecrets,
    settings,
    loading,
    error,
    // Actions
    addRecentSecret,
    clearRecentSecrets,
    updateSettings,
    setLoading,
    setError,
    clearError,
  }
})
