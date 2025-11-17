<template>
  <div class="secret-list">
    <div class="card">
      <h2 class="mb-4">My Secrets</h2>

      <p v-if="store.secrets.length === 0" class="text-center text-secondary">
        No secrets created yet. Create your first secret to get started.
      </p>

      <div v-else class="secrets-container">
        <div
          v-for="secret in store.secrets"
          :key="secret.metadata_key"
          class="secret-item"
        >
          <div class="secret-info">
            <div class="secret-header">
              <span class="code">{{ secret.secret_key }}</span>
              <span
                class="badge"
                :class="secret.state === 'received' ? 'badge-danger' : 'badge-success'"
              >
                {{ secret.state }}
              </span>
            </div>
            <div class="secret-meta">
              <span class="text-xs text-secondary">
                Created: {{ formatDate(secret.created) }}
              </span>
              <span v-if="secret.passphrase_required" class="text-xs">
                🔒 Passphrase protected
              </span>
            </div>
          </div>

          <div class="secret-actions">
            <button
              class="btn btn-secondary btn-sm"
              @click="viewMetadata(secret.metadata_key)"
            >
              View Details
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteSecret(secret.metadata_key)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Metadata Modal -->
    <div v-if="selectedMetadata" class="modal" @click.self="selectedMetadata = null">
      <div class="modal-content card">
        <h3 class="mb-3">Secret Metadata</h3>

        <div class="metadata-grid">
          <div class="metadata-item">
            <strong>Secret Key:</strong>
            <span class="code">{{ selectedMetadata.secret_key }}</span>
          </div>
          <div class="metadata-item">
            <strong>Metadata Key:</strong>
            <span class="code">{{ selectedMetadata.metadata_key }}</span>
          </div>
          <div class="metadata-item">
            <strong>State:</strong>
            <span>{{ selectedMetadata.state }}</span>
          </div>
          <div class="metadata-item">
            <strong>Created:</strong>
            <span>{{ formatDate(selectedMetadata.created) }}</span>
          </div>
          <div class="metadata-item">
            <strong>Updated:</strong>
            <span>{{ formatDate(selectedMetadata.updated) }}</span>
          </div>
          <div class="metadata-item">
            <strong>TTL:</strong>
            <span>{{ selectedMetadata.ttl }} seconds</span>
          </div>
          <div v-if="selectedMetadata.received" class="metadata-item">
            <strong>Received:</strong>
            <span>{{ formatDate(selectedMetadata.received) }}</span>
          </div>
        </div>

        <button class="btn btn-primary mt-3" @click="selectedMetadata = null">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/stores/app';
import * as tauriService from '@/services/tauri';
import type { SecretMetadata } from '@/types';

const store = useAppStore();
const selectedMetadata = ref<SecretMetadata | null>(null);

async function viewMetadata(metadataKey: string) {
  try {
    const metadata = await tauriService.getSecretMetadata(metadataKey);
    selectedMetadata.value = metadata;
  } catch (err: any) {
    alert(err?.error || err.message || 'Failed to load metadata');
  }
}

async function deleteSecret(metadataKey: string) {
  if (!confirm('Are you sure you want to delete this secret?')) {
    return;
  }

  try {
    await tauriService.deleteSecret(metadataKey);
    store.removeSecret(metadataKey);
    alert('Secret deleted successfully');
  } catch (err: any) {
    alert(err?.error || err.message || 'Failed to delete secret');
  }
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}
</script>

<style scoped>
.secret-list {
  max-width: 900px;
}

.secrets-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.secret-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
}

.secret-info {
  flex: 1;
}

.secret-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.secret-meta {
  display: flex;
  gap: 1rem;
}

.secret-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.badge {
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success {
  background-color: var(--color-success);
  color: white;
}

.badge-danger {
  background-color: var(--color-danger);
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.metadata-grid {
  display: grid;
  gap: 1rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metadata-item strong {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
</style>
