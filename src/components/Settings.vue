<template>
  <div class="settings">
    <h2>Settings</h2>
    <p class="description">
      Configure your OneTimeSecret application preferences.
    </p>

    <form @submit.prevent="handleSave" class="form">
      <div class="form-section">
        <h3>API Configuration</h3>

        <div class="form-group">
          <label for="apiEndpoint">API Endpoint</label>
          <input
            id="apiEndpoint"
            v-model="formData.apiEndpoint"
            type="url"
            placeholder="https://onetimesecret.dev"
            required
          />
          <small>The OneTimeSecret API endpoint URL</small>
        </div>

        <div class="form-group">
          <label for="defaultTTL">Default Time to Live</label>
          <select id="defaultTTL" v-model="formData.defaultTTL">
            <option :value="300">5 minutes</option>
            <option :value="1800">30 minutes</option>
            <option :value="3600">1 hour</option>
            <option :value="14400">4 hours</option>
            <option :value="86400">1 day</option>
            <option :value="604800">7 days</option>
            <option :value="2592000">30 days</option>
          </select>
          <small>Default expiration time for new secrets</small>
        </div>
      </div>

      <div class="form-section">
        <h3>Appearance</h3>

        <div class="form-group">
          <label for="theme">Theme</label>
          <select id="theme" v-model="formData.theme">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <small>Choose your preferred color scheme</small>
        </div>
      </div>

      <div class="form-section">
        <h3>Security</h3>

        <div class="info-box">
          <h4>Secure Storage</h4>
          <p>
            This application uses platform-native secure storage to protect your data:
          </p>
          <ul>
            <li><strong>Windows:</strong> Windows Credential Manager</li>
            <li><strong>macOS:</strong> macOS Keychain</li>
            <li><strong>Linux:</strong> Secret Service API (libsecret)</li>
          </ul>
          <p>
            All sensitive data is encrypted and stored securely on your device.
          </p>
        </div>

        <div class="info-box">
          <h4>Privacy</h4>
          <p>
            This desktop application communicates directly with the OneTimeSecret API.
            No data is sent to third parties or tracked.
          </p>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save Settings' }}
        </button>
        <button type="button" @click="handleReset" class="btn-secondary">
          Reset to Defaults
        </button>
      </div>
    </form>

    <div v-if="saveSuccess" class="success-message">
      Settings saved successfully!
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="form-section">
      <h3>About</h3>
      <div class="about-box">
        <h4>OneTimeSecret Desktop</h4>
        <p><strong>Version:</strong> 0.1.0</p>
        <p><strong>License:</strong> MIT</p>
        <p>
          A secure, cross-platform desktop client for
          <a href="https://onetimesecret.dev" target="_blank" rel="noopener">
            OneTimeSecret
          </a>
        </p>
        <p class="tech-stack">
          <strong>Built with:</strong> Tauri v2 • Vue 3 • TypeScript • Rust
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSecretsStore } from '@/stores/secrets'
import type { AppSettings } from '@/types/api'

const store = useSecretsStore()
const loading = ref(false)
const saveSuccess = ref(false)
const error = ref<string | null>(null)

const formData = ref<AppSettings>({
  apiEndpoint: 'https://onetimesecret.dev',
  defaultTTL: 604800,
  theme: 'system',
})

onMounted(() => {
  // Load current settings
  formData.value = { ...store.settings }
})

async function handleSave() {
  loading.value = true
  error.value = null
  saveSuccess.value = false

  try {
    // Update store
    store.updateSettings(formData.value)

    // In a real app, you might save to secure storage here
    // await invoke('save_settings', { settings: formData.value })

    saveSuccess.value = true

    // Hide success message after 3 seconds
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save settings'
  } finally {
    loading.value = false
  }
}

function handleReset() {
  formData.value = {
    apiEndpoint: 'https://onetimesecret.dev',
    defaultTTL: 604800,
    theme: 'system',
  }
}
</script>

<style scoped>
.settings {
  max-width: 700px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #111827;
}

.description {
  color: #6b7280;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

h3 {
  font-size: 1.25rem;
  color: #111827;
  margin: 0;
}

h4 {
  font-size: 1rem;
  color: #374151;
  margin: 0 0 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

input,
select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

small {
  color: #6b7280;
  font-size: 0.75rem;
}

.info-box {
  padding: 1.5rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  color: #1e40af;
}

.info-box p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

.info-box ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  font-size: 0.875rem;
}

.info-box li {
  margin: 0.25rem 0;
}

.about-box {
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.about-box p {
  margin: 0.5rem 0;
  color: #374151;
  font-size: 0.875rem;
}

.about-box a {
  color: #667eea;
  text-decoration: none;
}

.about-box a:hover {
  text-decoration: underline;
}

.tech-stack {
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem !important;
}

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}

.btn-primary {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.success-message {
  padding: 1rem;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 0.5rem;
  color: #166534;
  margin-top: 1rem;
}

.error-message {
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  margin-top: 1rem;
}

@media (prefers-color-scheme: dark) {
  h2,
  h3 {
    color: #f9fafb;
  }

  h4 {
    color: #d1d5db;
  }

  .description {
    color: #9ca3af;
  }

  label {
    color: #d1d5db;
  }

  input,
  select {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .form-section {
    border-bottom-color: #374151;
  }

  .btn-secondary {
    background: #1f2937;
    border-color: #667eea;
  }

  .info-box {
    background: #1e3a8a;
    border-color: #3b82f6;
    color: #bfdbfe;
  }

  .about-box {
    background: #1f2937;
    border-color: #374151;
  }

  .about-box p {
    color: #d1d5db;
  }

  .tech-stack {
    border-top-color: #374151;
  }
}
</style>
