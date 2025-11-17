/**
 * Unit tests for app store
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAppStore } from '../app';

vi.mock('@/services/tauri', () => ({
  getCredentials: vi.fn(),
  saveCredentials: vi.fn(),
  deleteCredentials: vi.fn(),
  testConnection: vi.fn(),
}));

describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = useAppStore();

    expect(store.credentials).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.secrets).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should add a secret to the list', () => {
    const store = useAppStore();

    const secret = {
      metadata_key: 'meta123',
      secret_key: 'secret123',
      created: 1234567890,
      ttl: 3600,
      state: 'new',
      passphrase_required: false,
    };

    store.addSecret(secret);

    expect(store.secrets).toHaveLength(1);
    expect(store.secrets[0]).toEqual(secret);
  });

  it('should remove a secret from the list', () => {
    const store = useAppStore();

    store.addSecret({
      metadata_key: 'meta123',
      secret_key: 'secret123',
      created: 1234567890,
      ttl: 3600,
      state: 'new',
      passphrase_required: false,
    });

    store.removeSecret('meta123');

    expect(store.secrets).toHaveLength(0);
  });

  it('should clear error', () => {
    const store = useAppStore();
    store.error = 'test error';

    store.clearError();

    expect(store.error).toBeNull();
  });
});
