import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppConfig } from '@shared/types/app'
import { DEFAULT_APP_CONFIG } from '@shared/types/app'

/**
 * Application state store
 */
export const useAppStore = defineStore('app', () => {
  // State
  const config = ref<AppConfig>({ ...DEFAULT_APP_CONFIG })
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const appVersion = ref<string>('')

  // Computed
  const hasError = computed(() => error.value !== null)

  // Actions
  function setConfig(newConfig: Partial<AppConfig>) {
    config.value = { ...config.value, ...newConfig }
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function clearError() {
    error.value = null
  }

  async function loadAppVersion() {
    try {
      const result = await window.electronAPI.app.getVersion()
      if (result.success && result.data) {
        appVersion.value = result.data
      }
    } catch (err) {
      console.error('Failed to load app version:', err)
    }
  }

  return {
    // State
    config,
    isLoading,
    error,
    appVersion,

    // Computed
    hasError,

    // Actions
    setConfig,
    setLoading,
    setError,
    clearError,
    loadAppVersion,
  }
})
