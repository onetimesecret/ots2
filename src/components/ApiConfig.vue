<template>
  <div class="api-config">
    <div class="form-group">
      <label for="api-url">API Base URL</label>
      <input
        id="api-url"
        v-model="apiUrl"
        type="url"
        placeholder="https://onetimesecret.com"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="username">Username (Email)</label>
      <input
        id="username"
        v-model="username"
        type="email"
        placeholder="your@email.com"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="api-key">API Key</label>
      <input
        id="api-key"
        v-model="apiKey"
        type="password"
        placeholder="Your API key"
        :disabled="loading"
      />
    </div>

    <div class="actions">
      <button @click="saveConfig" :disabled="loading || !isValid">
        {{ loading ? 'Saving...' : 'Save Configuration' }}
      </button>
      <button @click="testConnection" :disabled="loading || !isConfigured" class="secondary">
        {{ loading ? 'Testing...' : 'Test Connection' }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApiStore } from '@/stores/apiStore'

const apiStore = useApiStore()

const apiUrl = ref('https://onetimesecret.com')
const username = ref('')
const apiKey = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const isValid = computed(() => {
  return apiUrl.value && username.value && apiKey.value
})

const isConfigured = computed(() => apiStore.isConfigured)

onMounted(async () => {
  loading.value = true
  try {
    const config = await apiStore.loadConfig()
    if (config) {
      apiUrl.value = config.baseUrl
      username.value = config.username
      // API key is loaded from secure storage, don't show in UI
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load configuration'
  } finally {
    loading.value = false
  }
})

async function saveConfig() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    await apiStore.saveConfig({
      baseUrl: apiUrl.value,
      username: username.value,
      apiKey: apiKey.value
    })
    success.value = 'Configuration saved securely'
    apiKey.value = '' // Clear the input for security
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save configuration'
  } finally {
    loading.value = false
  }
}

async function testConnection() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const result = await apiStore.testConnection()
    if (result.success) {
      success.value = 'Connection successful!'
    } else {
      error.value = result.error || 'Connection failed'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Connection test failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.api-config {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.secondary {
  background-color: #6c757d;
}

.secondary:hover {
  background-color: #5a6268;
}
</style>
