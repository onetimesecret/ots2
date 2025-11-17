<template>
  <div class="setup-container">
    <div class="setup-card card">
      <h1 class="mb-4">OneTimeSecret Setup</h1>

      <p class="text-secondary mb-4">
        Configure your OneTimeSecret API credentials to get started. You can obtain API credentials
        from your OneTimeSecret account settings.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="label" for="endpoint">API Endpoint</label>
          <input
            id="endpoint"
            v-model="form.endpoint"
            type="url"
            class="input"
            placeholder="https://onetimesecret.com"
            required
          />
          <p class="text-xs text-secondary mt-1">
            The OneTimeSecret API endpoint URL
          </p>
        </div>

        <div class="mb-3">
          <label class="label" for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="input"
            placeholder="your-username"
            required
          />
        </div>

        <div class="mb-3">
          <label class="label" for="apiKey">API Key</label>
          <input
            id="apiKey"
            v-model="form.apiKey"
            type="password"
            class="input"
            placeholder="your-api-key"
            required
          />
          <p class="text-xs text-secondary mt-1">
            Your API key will be stored securely in the system keychain
          </p>
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="loading"
        >
          {{ loading ? 'Connecting...' : 'Connect' }}
        </button>
      </form>

      <div class="mt-4 text-center text-sm text-secondary">
        <p>Don't have an account?</p>
        <a
          href="https://onetimesecret.com"
          target="_blank"
          class="text-primary"
        >
          Create one at OneTimeSecret.com
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAppStore } from '@/stores/app';
import { DEFAULT_API_ENDPOINT } from '@/constants';

const store = useAppStore();

const form = reactive({
  endpoint: DEFAULT_API_ENDPOINT,
  username: '',
  apiKey: '',
});

const loading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit() {
  try {
    loading.value = true;
    error.value = null;

    await store.saveNewCredentials(
      form.username,
      form.apiKey,
      form.endpoint
    );
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to connect';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.setup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--color-bg-secondary);
}

.setup-card {
  max-width: 500px;
  width: 100%;
}

.text-primary {
  color: var(--color-primary);
  text-decoration: none;
}

.text-primary:hover {
  text-decoration: underline;
}
</style>
