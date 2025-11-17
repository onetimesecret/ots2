/**
 * Pinia store for secret management
 * Handles secret creation, retrieval, and in-memory state
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { container } from 'tsyringe';
import { OtsV2Client } from '@/network/ots_client';
import { CreateSecretDto, SecretResponse, MetadataResponse } from '@/network/dto';
import { getErrorMessage } from '@/core/error';

export interface SecretState {
  value: string;
  passphrase: string;
  ttl: number;
  recipient: string;
}

export interface CreatedSecret {
  secretKey: string;
  metadataKey: string;
  shareUrl: string;
  created: number;
}

export const useSecretStore = defineStore('secret', () => {
  // =========================================================================
  // State
  // =========================================================================

  const client = container.resolve(OtsV2Client);

  const secretForm = ref<SecretState>({
    value: '',
    passphrase: '',
    ttl: 3600, // Default 1 hour
    recipient: '',
  });

  const createdSecret = ref<CreatedSecret | null>(null);
  const retrievedSecret = ref<SecretResponse | null>(null);
  const recentSecrets = ref<MetadataResponse[]>([]);

  const isCreating = ref(false);
  const isRetrieving = ref(false);
  const error = ref<string | null>(null);

  // =========================================================================
  // Computed
  // =========================================================================

  const hasCreatedSecret = computed(() => createdSecret.value !== null);
  const hasRetrievedSecret = computed(() => retrievedSecret.value !== null);
  const isFormValid = computed(() => secretForm.value.value.trim().length > 0);

  // =========================================================================
  // Actions
  // =========================================================================

  /**
   * Create a new secret
   */
  async function createSecret(): Promise<boolean> {
    if (!isFormValid.value) {
      error.value = 'Secret value cannot be empty';
      return false;
    }

    isCreating.value = true;
    error.value = null;

    try {
      const dto: CreateSecretDto = {
        secret: secretForm.value.value,
        ttl: secretForm.value.ttl,
      };

      if (secretForm.value.passphrase) {
        dto.passphrase = secretForm.value.passphrase;
      }

      if (secretForm.value.recipient) {
        dto.recipient = secretForm.value.recipient;
      }

      const response = await client.createSecret(dto);

      // Store created secret metadata
      createdSecret.value = {
        secretKey: response.secret_key,
        metadataKey: response.metadata_key,
        shareUrl: buildShareUrl(response.secret_key),
        created: response.created,
      };

      // Clear form for security
      clearForm();

      return true;
    } catch (err) {
      error.value = getErrorMessage(err);
      return false;
    } finally {
      isCreating.value = false;
    }
  }

  /**
   * Retrieve a secret (burns it)
   */
  async function retrieveSecret(
    secretKey: string,
    passphrase?: string,
  ): Promise<boolean> {
    isRetrieving.value = true;
    error.value = null;

    try {
      const response = await client.getSecret(secretKey, passphrase);
      retrievedSecret.value = response;
      return true;
    } catch (err) {
      error.value = getErrorMessage(err);
      return false;
    } finally {
      isRetrieving.value = false;
    }
  }

  /**
   * Get secret metadata without burning
   */
  async function getMetadata(metadataKey: string): Promise<MetadataResponse | null> {
    try {
      return await client.getMetadata(metadataKey);
    } catch (err) {
      error.value = getErrorMessage(err);
      return null;
    }
  }

  /**
   * Burn a secret without retrieving
   */
  async function burnSecret(metadataKey: string): Promise<boolean> {
    try {
      await client.burnSecret(metadataKey);
      return true;
    } catch (err) {
      error.value = getErrorMessage(err);
      return false;
    }
  }

  /**
   * Load recent secrets (requires auth)
   */
  async function loadRecentSecrets(): Promise<void> {
    try {
      recentSecrets.value = await client.getRecentMetadata();
    } catch (err) {
      error.value = getErrorMessage(err);
    }
  }

  /**
   * Clear the secret form
   */
  function clearForm(): void {
    secretForm.value = {
      value: '',
      passphrase: '',
      ttl: 3600,
      recipient: '',
    };
  }

  /**
   * Clear created secret from memory
   */
  function clearCreatedSecret(): void {
    createdSecret.value = null;
  }

  /**
   * Clear retrieved secret from memory
   */
  function clearRetrievedSecret(): void {
    retrievedSecret.value = null;
  }

  /**
   * Clear all sensitive data
   */
  function clearAll(): void {
    clearForm();
    clearCreatedSecret();
    clearRetrievedSecret();
    error.value = null;
  }

  /**
   * Build shareable URL for a secret
   */
  function buildShareUrl(secretKey: string): string {
    // In production, this should use the actual OTS domain
    return `https://onetimesecret.com/secret/${secretKey}`;
  }

  return {
    // State
    secretForm,
    createdSecret,
    retrievedSecret,
    recentSecrets,
    isCreating,
    isRetrieving,
    error,

    // Computed
    hasCreatedSecret,
    hasRetrievedSecret,
    isFormValid,

    // Actions
    createSecret,
    retrieveSecret,
    getMetadata,
    burnSecret,
    loadRecentSecrets,
    clearForm,
    clearCreatedSecret,
    clearRetrievedSecret,
    clearAll,
  };
});
