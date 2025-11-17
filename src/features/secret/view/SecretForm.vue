<template>
  <div class="secret-form">
    <h2>Create a Secret</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="secret-value">Secret</label>
        <textarea
          id="secret-value"
          v-model="store.secretForm.value"
          placeholder="Enter your secret text..."
          rows="6"
          required
          :disabled="store.isCreating"
        />
      </div>

      <div class="form-group">
        <label for="passphrase">Passphrase (optional)</label>
        <input
          id="passphrase"
          v-model="store.secretForm.passphrase"
          type="password"
          placeholder="Optional passphrase for extra security"
          :disabled="store.isCreating"
        />
      </div>

      <div class="form-group">
        <label for="ttl">Expiration</label>
        <select
          id="ttl"
          v-model.number="store.secretForm.ttl"
          :disabled="store.isCreating"
        >
          <option :value="300">5 minutes</option>
          <option :value="1800">30 minutes</option>
          <option :value="3600">1 hour</option>
          <option :value="14400">4 hours</option>
          <option :value="86400">1 day</option>
          <option :value="604800">7 days</option>
        </select>
      </div>

      <div class="form-group">
        <label for="recipient">Recipient Email (optional)</label>
        <input
          id="recipient"
          v-model="store.secretForm.recipient"
          type="email"
          placeholder="Optional recipient email"
          :disabled="store.isCreating"
        />
      </div>

      <div v-if="store.error" class="error-message">
        {{ store.error }}
      </div>

      <button
        type="submit"
        :disabled="!store.isFormValid || store.isCreating"
        class="btn-primary"
      >
        {{ store.isCreating ? 'Creating...' : 'Create Secret' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useSecretStore } from '../store/secret_store';

const store = useSecretStore();

const handleSubmit = async () => {
  await store.createSecret();
};
</script>

<style scoped>
.secret-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #e0e0e0;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #b0b0b0;
  font-size: 0.9rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #e0e0e0;
  font-family: inherit;
  font-size: 1rem;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #0066cc;
}

input:disabled,
textarea:disabled,
select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  min-height: 120px;
  font-family: 'Monaco', 'Courier New', monospace;
}

.error-message {
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: #3a1a1a;
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  color: #ff6b6b;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #0052a3;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
