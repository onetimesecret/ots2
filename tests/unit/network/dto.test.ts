/**
 * Unit tests for DTOs
 */

import { describe, it, expect } from 'vitest';
import {
  CreateSecretDtoSchema,
  SecretResponseSchema,
  buildSecretUrl,
  buildMetadataUrl,
} from '@/network/dto';

describe('DTOs', () => {
  describe('CreateSecretDtoSchema', () => {
    it('should validate valid secret DTO', () => {
      const dto = {
        secret: 'my secret',
        ttl: 3600,
      };

      const result = CreateSecretDtoSchema.safeParse(dto);
      expect(result.success).toBe(true);
    });

    it('should reject empty secret', () => {
      const dto = {
        secret: '',
      };

      const result = CreateSecretDtoSchema.safeParse(dto);
      expect(result.success).toBe(false);
    });

    it('should validate optional fields', () => {
      const dto = {
        secret: 'my secret',
        passphrase: 'password123',
        ttl: 7200,
        recipient: 'test@example.com',
      };

      const result = CreateSecretDtoSchema.safeParse(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('SecretResponseSchema', () => {
    it('should validate valid response', () => {
      const response = {
        custid: 'customer123',
        metadata_key: 'meta_key_123',
        secret_key: 'secret_key_456',
        ttl: 3600,
        metadata_ttl: 3600,
        secret_ttl: 3600,
        state: 'new',
        updated: 1234567890,
        created: 1234567890,
        passphrase_required: false,
      };

      const result = SecretResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    });

    it('should validate response with value field', () => {
      const response = {
        custid: 'customer123',
        metadata_key: 'meta_key_123',
        secret_key: 'secret_key_456',
        ttl: 3600,
        metadata_ttl: 3600,
        secret_ttl: 3600,
        state: 'received',
        updated: 1234567890,
        created: 1234567890,
        passphrase_required: false,
        value: 'secret content',
      };

      const result = SecretResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe('secret content');
      }
    });
  });

  describe('URL builders', () => {
    it('should build secret URL', () => {
      const url = buildSecretUrl('https://example.com', 'secret_key_123');
      expect(url).toBe('https://example.com/secret/secret_key_123');
    });

    it('should build metadata URL', () => {
      const url = buildMetadataUrl('https://example.com', 'meta_key_456');
      expect(url).toBe('https://example.com/private/meta_key_456');
    });
  });
});
