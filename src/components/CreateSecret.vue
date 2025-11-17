<template>
  <div class="create-secret">
    <div class="card">
      <h2 class="mb-4">Create New Secret</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="label" for="secret">Secret Content *</label>
          <textarea
            id="secret"
            v-model="form.secret"
            class="textarea"
            placeholder="Enter the secret message or data you want to share..."
            required
          ></textarea>
          <p class="text-xs text-secondary mt-1">
            This content will be encrypted and can only be viewed once
          </p>
        </div>

        <div class="mb-3">
          <label class="label" for="passphrase">Passphrase (Optional)</label>
          <input
            id="passphrase"
            v-model="form.passphrase"
            type="password"
            class="input"
            placeholder="Additional password protection"
          />
          <p class="text-xs text-secondary mt-1">
            Require a passphrase to view the secret
          </p>
        </div>

        <div class="mb-3">
          <label class="label" for="ttl">Time to Live (seconds)</label>
          <select id="ttl" v-model.number="form.ttl" class="input">
            <option :value="300">5 minutes</option>
            <option :value="900">15 minutes</option>
            <option :value="1800">30 minutes</option>
            <option :value="3600">1 hour</option>
            <option :value="14400">4 hours</option>
            <option :value="86400">1 day</option>
            <option :value="604800">7 days</option>
          </select>
          <p class="text-xs text-secondary mt-1">
            How long the secret will be available
          </p>
        </div>

        <div class="mb-3">
          <label class="label" for="recipient">Recipient Email (Optional)</label>
          <input
            id="recipient"
            v-model="form.recipient"
            type="email"
            class="input"
            placeholder="recipient@example.com"
          />
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div v-if="result" class="alert alert-success">
          <p class="font-bold mb-2">Secret created successfully!</p>
          <div class="result-info">
            <div class="mb-2">
              <strong>Secret Link:</strong>
              <div class="code-block mt-1">{{ secretUrl }}</div>
              <button
                type="button"
                class="btn btn-secondary mt-1"
                @click="copyToClipboard(secretUrl)"
              >
                Copy Link
              </button>
            </div>
            <div class="text-xs text-secondary">
              <p>Secret Key: <span class="code">{{ result.secret_key }}</span></p>
              <p>Metadata Key: <span class="code">{{ result.metadata_key }}</span></p>
              <p>Expires in: {{ formatTTL(result.ttl) }}</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading || !form.secret"
        >
          {{ loading ? 'Creating...' : 'Create Secret' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import * as tauriService from '@/services/tauri';
import type { CreateSecretResponse } from '@/types';

const store = useAppStore();

const form = reactive({
  secret: '',
  passphrase: '',
  ttl: 3600,
  recipient: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<CreateSecretResponse | null>(null);

const secretUrl = computed(() => {
  if (!result.value || !store.credentials) return '';
  const endpoint = store.credentials.endpoint.replace(/\/$/, '');
  return `${endpoint}/secret/${result.value.secret_key}`;
});

async function handleSubmit() {
  try {
    loading.value = true;
    error.value = null;
    result.value = null;

    const response = await tauriService.createSecret(
      form.secret,
      form.passphrase || undefined,
      form.ttl,
      form.recipient || undefined
    );

    result.value = response;

    // Add to store
    store.addSecret({
      metadata_key: response.metadata_key,
      secret_key: response.secret_key,
      created: response.created,
      ttl: response.ttl,
      state: response.state,
      passphrase_required: response.passphrase_required || false,
    });

    // Reset form
    form.secret = '';
    form.passphrase = '';
    form.recipient = '';
  } catch (err: any) {
    error.value = err?.error || err.message || 'Failed to create secret';
  } finally {
    loading.value = false;
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  } catch (err) {
    alert('Failed to copy to clipboard');
  }
}

function formatTTL(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 24) {
    return `${Math.floor(hours / 24)} days`;
  } else if (hours > 0) {
    return `${hours} hours`;
  } else if (minutes > 0) {
    return `${minutes} minutes`;
  } else {
    return `${seconds} seconds`;
  }
}
</script>

<style scoped>
.create-secret {
  max-width: 700px;
}

.result-info {
  margin-top: 0.5rem;
}
</style>
