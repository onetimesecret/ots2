<template>
  <div class="retrieve-secret">
    <div class="card">
      <h2 class="mb-4">Retrieve Secret</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="label" for="secretKey">Secret Key *</label>
          <input
            id="secretKey"
            v-model="form.secretKey"
            type="text"
            class="input"
            placeholder="Enter the secret key..."
            required
          />
          <p class="text-xs text-secondary mt-1">
            The secret key from the shared link
          </p>
        </div>

        <div class="mb-3">
          <label class="label" for="passphrase">Passphrase (if required)</label>
          <input
            id="passphrase"
            v-model="form.passphrase"
            type="password"
            class="input"
            placeholder="Enter passphrase if set"
          />
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div v-if="result" class="alert alert-success">
          <p class="font-bold mb-2">Secret Retrieved</p>
          <div class="secret-content">
            <strong>Secret Value:</strong>
            <div class="code-block mt-1">{{ result.value }}</div>
            <button
              type="button"
              class="btn btn-secondary mt-2"
              @click="copyToClipboard(result.value)"
            >
              Copy Secret
            </button>
          </div>
          <p class="text-xs text-secondary mt-3">
            This secret has been retrieved and is no longer available to view again.
          </p>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading || !form.secretKey"
        >
          {{ loading ? 'Retrieving...' : 'Retrieve Secret' }}
        </button>
      </form>
    </div>

    <div class="card mt-4">
      <h3 class="mb-2">How to use</h3>
      <ol class="instructions">
        <li>Obtain a secret link from the sender</li>
        <li>Extract the secret key from the URL (the part after /secret/)</li>
        <li>Enter the secret key above</li>
        <li>If a passphrase was set, enter it as well</li>
        <li>Click "Retrieve Secret" to view the content</li>
      </ol>
      <p class="text-xs text-secondary mt-2">
        Remember: Secrets can only be viewed once. After retrieval, they are permanently deleted.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import * as tauriService from '@/services/tauri';
import type { RetrieveSecretResponse } from '@/types';
import { getErrorMessage } from '@/types';

const form = reactive({
  secretKey: '',
  passphrase: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<RetrieveSecretResponse | null>(null);

async function handleSubmit() {
  try {
    loading.value = true;
    error.value = null;
    result.value = null;

    const response = await tauriService.retrieveSecret(
      form.secretKey,
      form.passphrase || undefined
    );

    result.value = response;

    // Clear form
    form.secretKey = '';
    form.passphrase = '';
  } catch (err: unknown) {
    error.value = getErrorMessage(err);
  } finally {
    loading.value = false;
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Secret copied to clipboard!');
  } catch (err) {
    alert('Failed to copy to clipboard');
  }
}
</script>

<style scoped>
.retrieve-secret {
  max-width: 700px;
}

.secret-content {
  margin-top: 0.5rem;
}

.instructions {
  padding-left: 1.5rem;
  line-height: 1.8;
}

.instructions li {
  margin-bottom: 0.5rem;
}
</style>
