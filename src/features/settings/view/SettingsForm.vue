<template>
  <div class="settings-form">
    <h2>Settings</h2>

    <div class="settings-section">
      <h3>Security</h3>

      <div class="form-group">
        <label for="auto-lock">Auto-lock timeout</label>
        <select
          id="auto-lock"
          :value="store.settings.autoLockTimeout"
          @change="handleTimeoutChange"
        >
          <option :value="30">30 seconds</option>
          <option :value="60">1 minute</option>
          <option :value="300">5 minutes</option>
        </select>
        <p class="help-text">
          Automatically lock the app after this period of inactivity
        </p>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="store.settings.biometricEnabled"
            @change="handleBiometricChange"
          />
          <span>Enable biometric authentication</span>
        </label>
        <p class="help-text">Use fingerprint or face recognition to unlock</p>
      </div>
    </div>

    <div class="settings-section">
      <h3>Appearance</h3>

      <div class="form-group">
        <label for="theme">Theme</label>
        <select
          id="theme"
          :value="store.settings.theme"
          @change="handleThemeChange"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
    </div>

    <div class="settings-section">
      <h3>API Configuration</h3>

      <div class="form-group">
        <label for="api-url">API Base URL</label>
        <input
          id="api-url"
          :value="store.settings.apiBaseUrl"
          type="url"
          @input="handleApiUrlChange"
        />
        <p class="help-text">
          One-Time Secret API endpoint (use custom instance if available)
        </p>
      </div>
    </div>

    <div v-if="store.error" class="error-message">
      {{ store.error }}
    </div>

    <div class="button-group">
      <button @click="handleSave" :disabled="store.isSaving" class="btn-primary">
        {{ store.isSaving ? 'Saving...' : 'Save Settings' }}
      </button>

      <button @click="handleReset" class="btn-secondary">Reset to Defaults</button>
    </div>

    <div class="danger-zone">
      <h3>Danger Zone</h3>
      <p>This action cannot be undone.</p>
      <button @click="handleWipeData" class="btn-danger">
        Wipe All Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../store/settings_store';
import { LockTimeout } from '@/security/app_lock';

const store = useSettingsStore();

const handleTimeoutChange = (event: Event) => {
  const value = Number((event.target as HTMLSelectElement).value) as LockTimeout;
  store.setAutoLockTimeout(value);
};

const handleBiometricChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  store.setBiometric(checked);
};

const handleThemeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as 'dark' | 'light';
  store.setTheme(value);
};

const handleApiUrlChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  store.setApiBaseUrl(value);
};

const handleSave = async () => {
  const success = await store.saveSettings();
  if (success) {
    alert('Settings saved successfully!');
  }
};

const handleReset = () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    store.resetToDefaults();
  }
};

const handleWipeData = async () => {
  if (
    confirm(
      'This will permanently delete ALL application data including saved secrets and settings. This action cannot be undone. Are you absolutely sure?',
    )
  ) {
    const success = await store.wipeAllData();
    if (success) {
      alert('All data has been wiped.');
    }
  }
};
</script>

<style scoped>
.settings-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  margin-bottom: 2rem;
  color: #e0e0e0;
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #404040;
}

.settings-section:last-of-type {
  border-bottom: none;
}

h3 {
  margin-bottom: 1rem;
  color: #b0b0b0;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #b0b0b0;
  font-size: 0.9rem;
}

input[type='url'],
select {
  width: 100%;
  padding: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #e0e0e0;
  font-family: inherit;
  font-size: 1rem;
}

input[type='url']:focus,
select:focus {
  outline: none;
  border-color: #0066cc;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  margin-right: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.checkbox-label span {
  color: #e0e0e0;
  font-size: 1rem;
}

.help-text {
  margin-top: 0.5rem;
  color: #808080;
  font-size: 0.85rem;
}

.error-message {
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: #3a1a1a;
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  color: #ff6b6b;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background: #0066cc;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0052a3;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #404040;
  color: white;
}

.btn-secondary:hover {
  background: #505050;
}

.danger-zone {
  margin-top: 3rem;
  padding: 1.5rem;
  background: #2a1a1a;
  border: 1px solid #5a2a2a;
  border-radius: 8px;
}

.danger-zone h3 {
  color: #ff6b6b;
  margin-bottom: 0.5rem;
}

.danger-zone p {
  color: #b0b0b0;
  margin-bottom: 1rem;
}

.btn-danger {
  width: 100%;
  background: #c62828;
  color: white;
}

.btn-danger:hover {
  background: #b71c1c;
}
</style>
