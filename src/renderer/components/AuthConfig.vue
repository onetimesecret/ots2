<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const username = ref('')
const apiToken = ref('')
const baseUrl = ref('https://onetimesecret.dev/api/v2')
const error = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  error.value = ''

  if (!username.value || !apiToken.value) {
    error.value = 'Username and API token are required'
    return
  }

  isLoading.value = true

  try {
    await authStore.saveCredentials(username.value, apiToken.value, baseUrl.value)
  } catch (err: any) {
    error.value = err.message || 'Failed to save credentials'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-config">
    <div class="auth-card">
      <h2>API Configuration</h2>
      <p class="description">
        Enter your One-Time Secret API credentials to get started. Your credentials will be stored
        securely using OS-level encryption.
      </p>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            :disabled="isLoading"
            required
          />
        </div>

        <div class="form-group">
          <label for="apiToken">API Token</label>
          <input
            id="apiToken"
            v-model="apiToken"
            type="password"
            placeholder="Enter your API token"
            :disabled="isLoading"
            required
          />
        </div>

        <div class="form-group">
          <label for="baseUrl">API Base URL</label>
          <input
            id="baseUrl"
            v-model="baseUrl"
            type="url"
            placeholder="https://onetimesecret.dev/api/v2"
            :disabled="isLoading"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? 'Saving...' : 'Save Credentials' }}
        </button>
      </form>

      <div class="help-text">
        <p>
          Don't have an account?
          <a href="https://onetimesecret.dev" target="_blank" rel="noopener noreferrer">
            Sign up at onetimesecret.dev
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-config {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.auth-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.auth-card h2 {
  margin: 0 0 1rem;
  color: #667eea;
}

.description {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.help-text {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.help-text a {
  color: #667eea;
  text-decoration: none;
}

.help-text a:hover {
  text-decoration: underline;
}
</style>
