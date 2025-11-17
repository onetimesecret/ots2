<template>
  <div class="retrieve-secret">
    <h2>Retrieve a Secret</h2>
    <p class="description">
      Enter the secret key to view a one-time secret. Once viewed, it will be permanently destroyed.
    </p>

    <form v-if="!retrievedSecret" @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="secretKey">Secret Key</label>
        <input
          id="secretKey"
          v-model="formData.secretKey"
          type="text"
          placeholder="Enter the secret key..."
          required
        />
        <small>The key should look like: abc123def456</small>
      </div>

      <div class="form-group">
        <label for="passphrase">Passphrase (if required)</label>
        <input
          id="passphrase"
          v-model="formData.passphrase"
          type="password"
          placeholder="Enter passphrase if one was set"
        />
      </div>

      <button type="submit" class="btn-primary" :disabled="loading || !formData.secretKey">
        {{ loading ? 'Retrieving...' : 'Retrieve Secret' }}
      </button>
    </form>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="retrievedSecret" class="success-box">
      <h3>Secret Retrieved</h3>
      <div class="warning">
        <strong>Warning:</strong> This secret has been permanently destroyed and can no longer be viewed.
      </div>

      <div class="secret-content">
        <label>Secret Content:</label>
        <div class="content-box">
          <pre>{{ retrievedSecret.value }}</pre>
          <button @click="copyToClipboard(retrievedSecret.value)" class="btn-copy">
            Copy
          </button>
        </div>
      </div>

      <button @click="reset" class="btn-secondary">Retrieve Another Secret</button>
    </div>

    <div v-if="metadataInfo" class="metadata-box">
      <h3>Secret Metadata</h3>
      <div class="metadata-grid">
        <div class="metadata-item">
          <label>Created:</label>
          <span>{{ formatDate(metadataInfo.created) }}</span>
        </div>
        <div class="metadata-item">
          <label>Time to Live:</label>
          <span>{{ formatTTL(metadataInfo.ttl) }}</span>
        </div>
        <div class="metadata-item">
          <label>Passphrase Required:</label>
          <span>{{ metadataInfo.passphrase_required ? 'Yes' : 'No' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSecrets } from '@/composables/useSecrets'
import type { SecretValue, SecretMetadata } from '@/types/api'

const { retrieveSecret, getSecretMetadata, loading } = useSecrets()

const formData = ref({
  secretKey: '',
  passphrase: '',
})

const retrievedSecret = ref<SecretValue | null>(null)
const metadataInfo = ref<SecretMetadata | null>(null)
const error = ref<string | null>(null)

async function handleSubmit() {
  error.value = null

  // Optionally fetch metadata first
  const metadataResult = await getSecretMetadata(formData.value.secretKey)
  if (metadataResult.ok) {
    metadataInfo.value = metadataResult.value
  }

  // Retrieve the secret
  const result = await retrieveSecret({
    secret_key: formData.value.secretKey,
    passphrase: formData.value.passphrase || undefined,
  })

  if (result.ok) {
    retrievedSecret.value = result.value
  } else {
    error.value = result.error.message
  }
}

function reset() {
  formData.value = {
    secretKey: '',
    passphrase: '',
  }
  retrievedSecret.value = null
  metadataInfo.value = null
  error.value = null
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    // Could add a toast notification here
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString()
}

function formatTTL(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`
  return `${Math.floor(seconds / 86400)} days`
}
</script>

<style scoped>
.retrieve-secret {
  max-width: 600px;
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
  gap: 1.5rem;
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

input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

small {
  color: #6b7280;
  font-size: 0.75rem;
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
  margin-top: 1rem;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.btn-copy {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-copy:hover {
  background: #5568d3;
}

.error-message {
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  margin-top: 1rem;
}

.success-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 0.5rem;
}

.success-box h3 {
  color: #166534;
  margin-bottom: 1rem;
}

.warning {
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.375rem;
  color: #92400e;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.secret-content {
  margin: 1.5rem 0;
}

.secret-content label {
  display: block;
  margin-bottom: 0.5rem;
  color: #166534;
}

.content-box {
  position: relative;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
}

.content-box pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 0.875rem;
  color: #111827;
  padding-right: 4rem;
}

.content-box .btn-copy {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.metadata-box {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.metadata-box h3 {
  color: #374151;
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.metadata-grid {
  display: grid;
  gap: 1rem;
}

.metadata-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metadata-item label {
  color: #6b7280;
  font-weight: 500;
}

.metadata-item span {
  color: #111827;
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  h2 {
    color: #f9fafb;
  }

  .description {
    color: #9ca3af;
  }

  label {
    color: #d1d5db;
  }

  input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .btn-secondary {
    background: #1f2937;
    border-color: #667eea;
  }

  .content-box {
    background: #374151;
    border-color: #4b5563;
  }

  .content-box pre {
    color: #f9fafb;
  }

  .metadata-box {
    background: #1f2937;
    border-color: #374151;
  }

  .metadata-box h3 {
    color: #f9fafb;
  }

  .metadata-item label {
    color: #9ca3af;
  }

  .metadata-item span {
    color: #f9fafb;
  }
}
</style>
