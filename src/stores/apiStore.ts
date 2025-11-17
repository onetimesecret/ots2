import { defineStore } from 'pinia'
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/core'

export interface ApiConfig {
  baseUrl: string
  username: string
  apiKey?: string
}

export interface TestConnectionResult {
  success: boolean
  error?: string
}

export const useApiStore = defineStore('api', () => {
  const isConfigured = ref(false)
  const baseUrl = ref('')
  const username = ref('')

  /**
   * Load API configuration from secure storage
   */
  async function loadConfig(): Promise<ApiConfig | null> {
    try {
      const config = await invoke<ApiConfig | null>('load_api_config')
      if (config) {
        baseUrl.value = config.baseUrl
        username.value = config.username
        isConfigured.value = true
        return config
      }
      return null
    } catch (error) {
      console.error('Failed to load config:', error)
      throw error
    }
  }

  /**
   * Save API configuration to secure storage
   * API key is stored in platform-specific keychain
   */
  async function saveConfig(config: ApiConfig): Promise<void> {
    try {
      await invoke('save_api_config', { config })
      baseUrl.value = config.baseUrl
      username.value = config.username
      isConfigured.value = true
    } catch (error) {
      console.error('Failed to save config:', error)
      throw error
    }
  }

  /**
   * Test API connection
   */
  async function testConnection(): Promise<TestConnectionResult> {
    try {
      const result = await invoke<TestConnectionResult>('test_api_connection')
      return result
    } catch (error) {
      console.error('Connection test failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  return {
    isConfigured,
    baseUrl,
    username,
    loadConfig,
    saveConfig,
    testConnection
  }
})
