import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SecureStorageKey } from '@shared/types/app'

/**
 * Authentication and API configuration store
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const isAuthenticated = ref(false)
  const username = ref<string>('')
  const apiBaseUrl = ref<string>('https://onetimesecret.dev/api/v2')

  // Computed
  const hasCredentials = computed(() => username.value !== '')

  // Actions
  async function loadCredentials() {
    try {
      const [usernameResult, baseUrlResult] = await Promise.all([
        window.electronAPI.storage.get(SecureStorageKey.API_USERNAME),
        window.electronAPI.storage.get(SecureStorageKey.API_BASE_URL),
      ])

      if (usernameResult.success && usernameResult.data) {
        username.value = usernameResult.data
        isAuthenticated.value = true
      }

      if (baseUrlResult.success && baseUrlResult.data) {
        apiBaseUrl.value = baseUrlResult.data
      }
    } catch (error) {
      console.error('Failed to load credentials:', error)
    }
  }

  async function saveCredentials(user: string, token: string, baseUrl?: string) {
    try {
      await Promise.all([
        window.electronAPI.storage.set(SecureStorageKey.API_USERNAME, user),
        window.electronAPI.storage.set(SecureStorageKey.API_TOKEN, token),
        baseUrl
          ? window.electronAPI.storage.set(SecureStorageKey.API_BASE_URL, baseUrl)
          : Promise.resolve(),
      ])

      username.value = user
      if (baseUrl) {
        apiBaseUrl.value = baseUrl
      }
      isAuthenticated.value = true
    } catch (error) {
      console.error('Failed to save credentials:', error)
      throw error
    }
  }

  async function clearCredentials() {
    try {
      await Promise.all([
        window.electronAPI.storage.delete(SecureStorageKey.API_USERNAME),
        window.electronAPI.storage.delete(SecureStorageKey.API_TOKEN),
      ])

      username.value = ''
      isAuthenticated.value = false
    } catch (error) {
      console.error('Failed to clear credentials:', error)
      throw error
    }
  }

  return {
    // State
    isAuthenticated,
    username,
    apiBaseUrl,

    // Computed
    hasCredentials,

    // Actions
    loadCredentials,
    saveCredentials,
    clearCredentials,
  }
})
