<script setup lang="ts">
import { ref } from 'vue'
import { useSecretsStore } from '../stores/secrets'

const secretsStore = useSecretsStore()

const secretKey = ref('')
const passphrase = ref('')
const retrievedSecret = ref<string | null>(null)

async function handleRetrieveSecret() {
  if (!secretKey.value.trim()) return

  try {
    const result = await secretsStore.retrieveSecret({
      secret_key: secretKey.value,
      passphrase: passphrase.value || undefined,
    })

    retrievedSecret.value = result.value

    // Reset form
    secretKey.value = ''
    passphrase.value = ''
  } catch (error) {
    console.error('Failed to retrieve secret:', error)
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!')
  })
}

function resetView() {
  retrievedSecret.value = null
  secretsStore.clearCurrentSecret()
}
</script>

<template>
  <div class="retrieve-secret">
    <h2>Retrieve Secret</h2>

    <div v-if="!retrievedSecret" class="form-container">
      <p class="description">
        Enter the secret key to retrieve a one-time secret. Remember, it can only be viewed once!
      </p>

      <div class="form-group">
        <label for="secretKey">Secret Key</label>
        <input
          id="secretKey"
          v-model="secretKey"
          type="text"
          placeholder="Enter secret key"
        />
      </div>

      <div class="form-group">
        <label for="retrievePassphrase">Passphrase (if required)</label>
        <input
          id="retrievePassphrase"
          v-model="passphrase"
          type="password"
          placeholder="Enter passphrase"
        />
      </div>

      <button @click="handleRetrieveSecret" :disabled="!secretKey.trim()" class="retrieve-btn">
        Retrieve Secret
      </button>
    </div>

    <div v-else class="result-container">
      <div class="warning-message">
        <h3>⚠️ Important</h3>
        <p>
          This secret has now been destroyed. Make sure to save it somewhere secure before closing
          this window.
        </p>
      </div>

      <div class="secret-content">
        <div class="secret-text">{{ retrievedSecret }}</div>
        <button @click="copyToClipboard(retrievedSecret)" class="copy-btn">
          Copy to Clipboard
        </button>
      </div>

      <button @click="resetView" class="reset-btn">Retrieve Another Secret</button>
    </div>
  </div>
</template>

<style scoped>
.retrieve-secret {
  padding: 1rem;
}

.retrieve-secret h2 {
  margin: 0 0 1.5rem;
  color: #667eea;
}

.description {
  color: #666;
  margin-bottom: 1.5rem;
}

.form-container {
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

.retrieve-btn {
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

.retrieve-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.retrieve-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.warning-message {
  background: #fff3e0;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
}

.warning-message h3 {
  margin: 0 0 0.5rem;
  color: #e65100;
}

.warning-message p {
  margin: 0;
  color: #ef6c00;
}

.secret-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.secret-text {
  padding: 1.5rem;
  background: #f5f5f5;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 100px;
  max-height: 300px;
  overflow-y: auto;
}

.copy-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
}

.copy-btn:hover {
  background: #5568d3;
}

.reset-btn {
  background: #666;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.reset-btn:hover {
  background: #555;
}
</style>
