/**
 * Application state store using Pinia
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ApiCredentials, SecretListItem } from '@/types';
import * as tauriService from '@/services/tauri';

export const useAppStore = defineStore('app', () => {
  // State
  const credentials = ref<ApiCredentials | null>(null);
  const isAuthenticated = ref(false);
  const secrets = ref<SecretListItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const hasCredentials = computed(() => credentials.value !== null);

  // Actions
  async function loadCredentials() {
    try {
      loading.value = true;
      error.value = null;
      credentials.value = await tauriService.getCredentials();
      isAuthenticated.value = true;
    } catch (err) {
      credentials.value = null;
      isAuthenticated.value = false;
      // It's normal to not have credentials on first run
      console.log('No credentials found:', err);
    } finally {
      loading.value = false;
    }
  }

  async function saveNewCredentials(username: string, apiKey: string, endpoint: string) {
    try {
      loading.value = true;
      error.value = null;

      // Save to secure storage
      await tauriService.saveCredentials(username, apiKey, endpoint);

      // Test connection
      await tauriService.testConnection();

      // Update local state
      credentials.value = { username, api_key: apiKey, endpoint };
      isAuthenticated.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save credentials';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      loading.value = true;
      error.value = null;
      await tauriService.deleteCredentials();
      credentials.value = null;
      isAuthenticated.value = false;
      secrets.value = [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to logout';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function addSecret(secret: SecretListItem) {
    secrets.value.unshift(secret);
  }

  function removeSecret(metadataKey: string) {
    const index = secrets.value.findIndex(s => s.metadata_key === metadataKey);
    if (index !== -1) {
      secrets.value.splice(index, 1);
    }
  }

  return {
    // State
    credentials,
    isAuthenticated,
    secrets,
    loading,
    error,
    // Computed
    hasCredentials,
    // Actions
    loadCredentials,
    saveNewCredentials,
    logout,
    clearError,
    addSecret,
    removeSecret,
  };
});
