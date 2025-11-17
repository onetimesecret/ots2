<template>
  <div class="create-secret">
    <div class="form-group">
      <label for="secret-content">Secret Content</label>
      <textarea
        id="secret-content"
        v-model="secretContent"
        rows="4"
        placeholder="Enter your secret message here..."
        :disabled="loading"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="passphrase">Passphrase (Optional)</label>
      <input
        id="passphrase"
        v-model="passphrase"
        type="password"
        placeholder="Optional passphrase for extra security"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="ttl">Time to Live</label>
      <select id="ttl" v-model="ttl" :disabled="loading">
        <option value="300">5 minutes</option>
        <option value="3600">1 hour</option>
        <option value="86400">1 day</option>
        <option value="604800">7 days</option>
      </select>
    </div>

    <div class="actions">
      <button @click="createSecret" :disabled="loading || !canCreate">
        {{ loading ? 'Creating...' : 'Create Secret' }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="secretLink" class="success">
      <p><strong>Secret created successfully!</strong></p>
      <p>Link: <code>{{ secretLink }}</code></p>
      <button @click="copyLink" class="copy-btn">Copy Link</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiStore } from '@/stores/apiStore'
import { useSecretRepository } from '@/repositories/secretRepository'

const apiStore = useApiStore()
const secretRepo = useSecretRepository()

const secretContent = ref('')
const passphrase = ref('')
const ttl = ref('3600')
const loading = ref(false)
const error = ref('')
const secretLink = ref('')

const canCreate = computed(() => {
  return apiStore.isConfigured && secretContent.value.trim().length > 0
})

async function createSecret() {
  error.value = ''
  secretLink.value = ''
  loading.value = true

  try {
    const result = await secretRepo.createSecret({
      secret: secretContent.value,
      passphrase: passphrase.value || undefined,
      ttl: parseInt(ttl.value)
    })

    secretLink.value = result.link
    secretContent.value = ''
    passphrase.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create secret'
  } finally {
    loading.value = false
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(secretLink.value)
    // Could add a toast notification here
  } catch (e) {
    error.value = 'Failed to copy link'
  }
}
</script>

<style scoped>
.create-secret {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

select {
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 0.6em 0.8em;
  font-size: 1em;
  font-family: inherit;
  width: 100%;
}

code {
  background: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  word-break: break-all;
  display: block;
  margin: 0.5rem 0;
}

.copy-btn {
  margin-top: 0.5rem;
  font-size: 0.9em;
}
</style>
