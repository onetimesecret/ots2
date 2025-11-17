/**
 * Pinia store for application settings
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { container } from 'tsyringe';
import { AppLockService, LockTimeout } from '@/security/app_lock';
import { SecureStorageService } from '@/security/secure_kv';

export interface AppSettings {
  autoLockTimeout: LockTimeout;
  biometricEnabled: boolean;
  theme: 'dark' | 'light';
  apiBaseUrl: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  autoLockTimeout: 60,
  biometricEnabled: false,
  theme: 'dark',
  apiBaseUrl: 'https://onetimesecret.com/api',
};

export const useSettingsStore = defineStore('settings', () => {
  // =========================================================================
  // State
  // =========================================================================

  const appLock = container.resolve(AppLockService);
  const secureStorage = container.resolve(SecureStorageService);

  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS });
  const isSaving = ref(false);
  const error = ref<string | null>(null);

  // =========================================================================
  // Actions
  // =========================================================================

  /**
   * Load settings from storage
   */
  async function loadSettings(): Promise<void> {
    try {
      const stored = await secureStorage.get('app_settings');
      if (stored) {
        const parsed = JSON.parse(stored) as AppSettings;
        settings.value = { ...DEFAULT_SETTINGS, ...parsed };

        // Apply settings
        applySettings();
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      error.value = 'Failed to load settings';
    }
  }

  /**
   * Save settings to storage
   */
  async function saveSettings(): Promise<boolean> {
    isSaving.value = true;
    error.value = null;

    try {
      const serialized = JSON.stringify(settings.value);
      await secureStorage.set('app_settings', serialized);

      // Apply settings
      applySettings();

      return true;
    } catch (err) {
      console.error('Failed to save settings:', err);
      error.value = 'Failed to save settings';
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  /**
   * Update auto-lock timeout
   */
  function setAutoLockTimeout(timeout: LockTimeout): void {
    settings.value.autoLockTimeout = timeout;
    appLock.configure({ timeout });
  }

  /**
   * Toggle biometric authentication
   */
  function setBiometric(enabled: boolean): void {
    settings.value.biometricEnabled = enabled;
    appLock.configure({ biometricEnabled: enabled });
  }

  /**
   * Set theme
   */
  function setTheme(theme: 'dark' | 'light'): void {
    settings.value.theme = theme;
    applyTheme(theme);
  }

  /**
   * Set API base URL
   */
  function setApiBaseUrl(url: string): void {
    settings.value.apiBaseUrl = url;
  }

  /**
   * Wipe all application data
   */
  async function wipeAllData(): Promise<boolean> {
    try {
      await secureStorage.clear();
      settings.value = { ...DEFAULT_SETTINGS };
      return true;
    } catch (err) {
      console.error('Failed to wipe data:', err);
      error.value = 'Failed to wipe data';
      return false;
    }
  }

  /**
   * Reset settings to defaults
   */
  function resetToDefaults(): void {
    settings.value = { ...DEFAULT_SETTINGS };
    applySettings();
  }

  /**
   * Apply settings to the application
   */
  function applySettings(): void {
    appLock.configure({
      timeout: settings.value.autoLockTimeout,
      biometricEnabled: settings.value.biometricEnabled,
    });

    applyTheme(settings.value.theme);
  }

  /**
   * Apply theme to the application
   */
  function applyTheme(theme: 'dark' | 'light'): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  return {
    // State
    settings,
    isSaving,
    error,

    // Actions
    loadSettings,
    saveSettings,
    setAutoLockTimeout,
    setBiometric,
    setTheme,
    setApiBaseUrl,
    wipeAllData,
    resetToDefaults,
  };
});
