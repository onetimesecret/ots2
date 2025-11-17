/**
 * Secure key-value storage using Tauri Stronghold plugin
 * Wraps tauri-plugin-stronghold for type-safe, auditable storage
 *
 * Platform-specific backends:
 * - Windows: Credential Manager + AES-256-GCM vault
 * - macOS: Keychain (kSecAttrAccessibleWhenUnlockedThisDeviceOnly)
 * - Linux: Secret Service + AES-256-GCM vault
 */

import { invoke } from '@tauri-apps/api/core';
import { injectable } from 'tsyringe';
import { StorageError } from '@/core/error';

export interface SecureStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

@injectable()
export class SecureStorageService implements SecureStorage {
  private readonly VAULT_PATH = 'ots_vault';
  private initialized = false;

  /**
   * Initialize stronghold vault
   * Must be called before any storage operations
   */
  async initialize(password: string): Promise<void> {
    try {
      await invoke('plugin:stronghold|initialize', {
        path: this.VAULT_PATH,
        password,
      });
      this.initialized = true;
    } catch (error) {
      throw new StorageError(`Failed to initialize secure storage: ${error}`);
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new StorageError('Secure storage not initialized');
    }
  }

  /**
   * Retrieve a value from secure storage
   * @returns null if key doesn't exist
   */
  async get(key: string): Promise<string | null> {
    this.ensureInitialized();
    try {
      const value = await invoke<string | null>('plugin:stronghold|get', { key });
      return value;
    } catch (error) {
      throw new StorageError(`Failed to get key "${key}": ${error}`);
    }
  }

  /**
   * Store a value in secure storage
   */
  async set(key: string, value: string): Promise<void> {
    this.ensureInitialized();
    try {
      await invoke('plugin:stronghold|set', { key, value });
    } catch (error) {
      throw new StorageError(`Failed to set key "${key}": ${error}`);
    }
  }

  /**
   * Remove a value from secure storage
   */
  async remove(key: string): Promise<void> {
    this.ensureInitialized();
    try {
      await invoke('plugin:stronghold|remove', { key });
    } catch (error) {
      throw new StorageError(`Failed to remove key "${key}": ${error}`);
    }
  }

  /**
   * Clear all data from secure storage
   * USE WITH CAUTION - this cannot be undone
   */
  async clear(): Promise<void> {
    this.ensureInitialized();
    try {
      await invoke('plugin:stronghold|clear');
    } catch (error) {
      throw new StorageError(`Failed to clear storage: ${error}`);
    }
  }

  /**
   * Get API token from secure storage
   */
  async getToken(): Promise<string | null> {
    return this.get('api_token');
  }

  /**
   * Set API token in secure storage
   */
  async setToken(token: string): Promise<void> {
    return this.set('api_token', token);
  }

  /**
   * Remove API token from secure storage
   */
  async removeToken(): Promise<void> {
    return this.remove('api_token');
  }
}
