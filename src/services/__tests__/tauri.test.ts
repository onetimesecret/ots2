/**
 * Unit tests for Tauri service layer
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as tauriService from '../tauri';

// Mock @tauri-apps/api/core
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('Tauri Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSecret', () => {
    it('should call invoke with correct parameters', async () => {
      const { invoke } = await import('@tauri-apps/api/core');
      const mockResponse = {
        secret_key: 'test123',
        metadata_key: 'meta123',
        ttl: 3600,
        metadata_ttl: 3600,
        secret_ttl: 3600,
        state: 'new',
        updated: 1234567890,
        created: 1234567890,
      };

      vi.mocked(invoke).mockResolvedValue(mockResponse);

      const result = await tauriService.createSecret('my secret', 'pass123', 3600);

      expect(invoke).toHaveBeenCalledWith('create_secret', {
        secret: 'my secret',
        passphrase: 'pass123',
        ttl: 3600,
        recipient: undefined,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('retrieveSecret', () => {
    it('should call invoke with correct parameters', async () => {
      const { invoke } = await import('@tauri-apps/api/core');
      const mockResponse = {
        secret_key: 'test123',
        value: 'secret value',
      };

      vi.mocked(invoke).mockResolvedValue(mockResponse);

      const result = await tauriService.retrieveSecret('test123', 'pass123');

      expect(invoke).toHaveBeenCalledWith('retrieve_secret', {
        secretKey: 'test123',
        passphrase: 'pass123',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
