<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSecretsStore } from '../stores/secrets'

const secretsStore = useSecretsStore()

const secretText = ref('')
const passphrase = ref('')
const ttl = ref(604800) // 7 days default
const recipient = ref('')
const createdSecret = ref<{ key: string; url: string } | null>(null)

const ttlOptions = [
  { value: 300, label: '5 minutes' },
  { value: 1800, label: '30 minutes' },
  { value: 3600, label: '1 hour' },
  { value: 14400, label: '4 hours' },
  { value: 86400, label: '1 day' },
  { value: 604800, label: '7 days' },
]

const isValid = computed(() => secretText.value.trim().length > 0)

async function handleCreateSecret() {
  if (!isValid.value) return

  try {
    const result = await secretsStore.createSecret({
      secret: secretText.value,
      passphrase: passphrase.value || undefined,
      ttl: ttl.value,
      recipient: recipient.value || undefined,
    })

    createdSecret.value = {
      key: result.secret_key,
      url: `https://onetimesecret.dev/secret/${result.secret_key}`,
    }

    // Reset form
    secretText.value = ''
    passphrase.value = ''
    recipient.value = ''
  } catch (error) {
    console.error('Failed to create secret:', error)
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!')
  })
}

function resetForm() {
  createdSecret.value = null
}
</script>

<template>
  <div class="create-secret">
    <h2>Create Secret</h2>

    <div v-if="!createdSecret" class="form-container">
      <div class="form-group">
        <label for="secret">Secret Message</label>
        <textarea
          id="secret"
          v-model="secretText"
          placeholder="Enter your secret message..."
          rows="6"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="passphrase">Passphrase (Optional)</label>
          <input
            id="passphrase"
            v-model="passphrase"
            type="password"
            placeholder="Add extra security"
          />
        </div>

        <div class="form-group">
          <label for="ttl">Time to Live</label>
          <select id="ttl" v-model="ttl">
            <option v-for="option in ttlOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="recipient">Recipient Email (Optional)</label>
        <input id="recipient" v-model="recipient" type="email" placeholder="recipient@example.com" />
      </div>

      <button @click="handleCreateSecret" :disabled="!isValid" class="create-btn">
        Create Secret
      </button>
    </div>

    <div v-else class="result-container">
      <div class="success-message">
        <h3>Secret Created Successfully! 🎉</h3>
        <p>Share this URL with your recipient. It can only be viewed once.</p>
      </div>

      <div class="secret-url">
        <input :value="createdSecret.url" readonly />
        <button @click="copyToClipboard(createdSecret.url)" class="copy-btn">Copy</button>
      </div>

      <div class="secret-key">
        <strong>Secret Key:</strong> {{ createdSecret.key }}
      </div>

      <button @click="resetForm" class="reset-btn">Create Another Secret</button>
    </div>
  </div>
</template>

<style scoped>
.create-secret {
  padding: 1rem;
}

.create-secret h2 {
  margin: 0 0 1.5rem;
  color: #667eea;
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
  flex: 1;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.create-btn {
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

.create-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.create-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.success-message {
  background: #e8f5e9;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.success-message h3 {
  margin: 0 0 0.5rem;
  color: #2e7d32;
}

.success-message p {
  margin: 0;
  color: #1b5e20;
}

.secret-url {
  display: flex;
  gap: 0.5rem;
}

.secret-url input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-family: monospace;
  background: #f5f5f5;
}

.copy-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.copy-btn:hover {
  background: #5568d3;
}

.secret-key {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  font-family: monospace;
  word-break: break-all;
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
