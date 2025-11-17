<template>
  <div v-if="store.hasCreatedSecret" class="secret-result">
    <h2>Secret Created!</h2>

    <div class="result-card">
      <div class="result-item">
        <label>Share URL</label>
        <div class="url-container">
          <input
            :value="store.createdSecret!.shareUrl"
            readonly
            class="url-input"
          />
          <button @click="copyUrl" class="btn-copy">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>

      <div class="result-item">
        <label>Secret Key</label>
        <code class="key">{{ store.createdSecret!.secretKey }}</code>
      </div>

      <div class="result-item">
        <label>Metadata Key</label>
        <code class="key">{{ store.createdSecret!.metadataKey }}</code>
      </div>

      <div class="warning">
        <strong>Important:</strong> This URL will only work once. After the secret
        is viewed, it will be permanently deleted.
      </div>

      <button @click="handleClose" class="btn-secondary">
        Create Another Secret
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { useSecretStore } from '../store/secret_store';

const store = useSecretStore();
const copied = ref(false);

let copyTimeout: number | null = null;

const copyUrl = async () => {
  if (!store.createdSecret) return;

  try {
    await writeText(store.createdSecret.shareUrl);
    copied.value = true;

    // Reset after 2 seconds
    if (copyTimeout) clearTimeout(copyTimeout);
    copyTimeout = window.setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy URL:', error);
  }
};

const handleClose = () => {
  store.clearCreatedSecret();
};
</script>

<style scoped>
.secret-result {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #4caf50;
}

.result-card {
  background: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 1.5rem;
}

.result-item {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #b0b0b0;
  font-size: 0.9rem;
}

.url-container {
  display: flex;
  gap: 0.5rem;
}

.url-input {
  flex: 1;
  padding: 0.75rem;
  background: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #e0e0e0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
}

.btn-copy {
  padding: 0.75rem 1.5rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-copy:hover {
  background: #0052a3;
}

.key {
  display: block;
  padding: 0.75rem;
  background: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #4caf50;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  word-break: break-all;
}

.warning {
  padding: 1rem;
  background: #3a2a1a;
  border: 1px solid #5a4a2a;
  border-radius: 4px;
  color: #ffb74d;
  margin-bottom: 1.5rem;
}

.warning strong {
  display: block;
  margin-bottom: 0.5rem;
}

.btn-secondary {
  width: 100%;
  padding: 1rem;
  background: #404040;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #505050;
}
</style>
