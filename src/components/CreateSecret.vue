<template>
  <div class="create-secret">
    <h2>Create a Secret</h2>
    <p class="description">
      Create a secret link that will expire after being viewed once or after the time limit.
    </p>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="secret">Secret Content</label>
        <textarea
          id="secret"
          v-model="formData.secret"
          placeholder="Enter your secret here..."
          rows="6"
          required
        />
      </div>

      <div class="form-group">
        <label for="passphrase">Passphrase (Optional)</label>
        <input
          id="passphrase"
          v-model="formData.passphrase"
          type="password"
          placeholder="Add extra protection with a passphrase"
        />
        <small>Recipient will need this passphrase to view the secret</small>
      </div>

      <div class="form-group">
        <label for="ttl">Time to Live</label>
        <select id="ttl" v-model="formData.ttl">
          <option :value="300">5 minutes</option>
          <option :value="1800">30 minutes</option>
          <option :value="3600">1 hour</option>
          <option :value="14400">4 hours</option>
          <option :value="86400">1 day</option>
          <option :value="604800">7 days</option>
          <option :value="2592000">30 days</option>
        </select>
      </div>

      <div class="form-group">
        <label for="recipient">Recipient Email (Optional)</label>
        <input
          id="recipient"
          v-model="formData.recipient"
          type="email"
          placeholder="recipient@example.com"
        />
        <small>Optionally send a notification to the recipient</small>
      </div>

      <button type="submit" class="btn-primary" :disabled="loading || !formData.secret">
        {{ loading ? 'Creating...' : 'Create Secret Link' }}
      </button>
    </form>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="createdSecret" class="success-box">
      <h3>Secret Created Successfully!</h3>
      <div class="secret-info">
        <div class="info-row">
          <label>Secret Link:</label>
          <div class="copy-group">
            <input
              :value="secretLink"
              readonly
              class="secret-link"
              @click="selectText"
            />
            <button @click="copyToClipboard(secretLink)" class="btn-copy">
              Copy
            </button>
          </div>
        </div>
        <div class="info-row">
          <label>Metadata Key:</label>
          <div class="copy-group">
            <input
              :value="createdSecret.metadata_key"
              readonly
              @click="selectText"
            />
            <button @click="copyToClipboard(createdSecret.metadata_key)" class="btn-copy">
              Copy
            </button>
          </div>
        </div>
      </div>
      <p class="warning">
        <strong>Important:</strong> Save this link now! It can only be viewed once.
      </p>
      <button @click="reset" class="btn-secondary">Create Another Secret</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSecrets } from '@/composables/useSecrets'
import { useSecretsStore } from '@/stores/secrets'
import type { SecretResponse } from '@/types/api'

const { createSecret, loading } = useSecrets()
const store = useSecretsStore()

const formData = ref({
  secret: '',
  passphrase: '',
  ttl: 604800, // 7 days default
  recipient: '',
})

const createdSecret = ref<SecretResponse | null>(null)
const error = ref<string | null>(null)

const secretLink = computed(() => {
  if (!createdSecret.value) return ''
  return `${store.settings.apiEndpoint}/secret/${createdSecret.value.secret_key}`
})

async function handleSubmit() {
  error.value = null

  const result = await createSecret({
    secret: formData.value.secret,
    passphrase: formData.value.passphrase || undefined,
    ttl: formData.value.ttl,
    recipient: formData.value.recipient || undefined,
  })

  if (result.ok) {
    createdSecret.value = result.value
  } else {
    error.value = result.error.message
  }
}

function reset() {
  formData.value = {
    secret: '',
    passphrase: '',
    ttl: 604800,
    recipient: '',
  }
  createdSecret.value = null
  error.value = null
}

function selectText(event: Event) {
  const input = event.target as HTMLInputElement
  input.select()
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    // Could add a toast notification here
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.create-secret {
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

input,
textarea,
select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea {
  resize: vertical;
  font-family: monospace;
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
  white-space: nowrap;
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

.secret-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row label {
  color: #166534;
}

.copy-group {
  display: flex;
  gap: 0.5rem;
}

.copy-group input {
  flex: 1;
  font-family: monospace;
  font-size: 0.875rem;
}

.secret-link {
  color: #667eea;
  font-weight: 500;
}

.warning {
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.375rem;
  color: #92400e;
  margin: 1rem 0;
  font-size: 0.875rem;
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

  input,
  textarea,
  select {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .btn-secondary {
    background: #1f2937;
    border-color: #667eea;
  }
}
</style>
