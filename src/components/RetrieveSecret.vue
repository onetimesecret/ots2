<template>
  <div class="retrieve-secret">
    <div class="form-group">
      <label for="secret-key">Secret Key</label>
      <input
        id="secret-key"
        v-model="secretKey"
        type="text"
        placeholder="Enter the secret key"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="retrieve-passphrase">Passphrase (if required)</label>
      <input
        id="retrieve-passphrase"
        v-model="passphrase"
        type="password"
        placeholder="Enter passphrase if the secret is protected"
        :disabled="loading"
      />
    </div>

    <div class="actions">
      <button @click="retrieveSecret" :disabled="loading || !canRetrieve">
        {{ loading ? 'Retrieving...' : 'Retrieve Secret' }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="secretContent" class="success">
      <p><strong>Secret retrieved successfully!</strong></p>
      <div class="secret-display">
        <textarea v-model="secretContent" readonly rows="6"></textarea>
        <button @click="copySecret" class="copy-btn">Copy Secret</button>
      </div>
      <p class="warning">This secret has been burned and cannot be retrieved again.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiStore } from '@/stores/apiStore'
import { useSecretRepository } from '@/repositories/secretRepository'

const apiStore = useApiStore()
const secretRepo = useSecretRepository()

const secretKey = ref('')
const passphrase = ref('')
const loading = ref(false)
const error = ref('')
const secretContent = ref('')

const canRetrieve = computed(() => {
  return apiStore.isConfigured && secretKey.value.trim().length > 0
})

async function retrieveSecret() {
  error.value = ''
  secretContent.value = ''
  loading.value = true

  try {
    const result = await secretRepo.retrieveSecret({
      key: secretKey.value,
      passphrase: passphrase.value || undefined
    })

    secretContent.value = result.secret
    secretKey.value = ''
    passphrase.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to retrieve secret'
  } finally {
    loading.value = false
  }
}

async function copySecret() {
  try {
    await navigator.clipboard.writeText(secretContent.value)
    // Could add a toast notification here
  } catch (e) {
    error.value = 'Failed to copy secret'
  }
}
</script>

<style scoped>
.retrieve-secret {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.secret-display {
  margin: 1rem 0;
}

.secret-display textarea {
  background: #f9f9f9;
  font-family: monospace;
  margin-bottom: 0.5rem;
}

.copy-btn {
  font-size: 0.9em;
}

.warning {
  color: #f59e0b;
  font-weight: 500;
  margin-top: 0.5rem;
}
</style>
