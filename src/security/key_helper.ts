/**
 * Cryptographic key derivation and AES encryption helpers
 * Uses Web Crypto API for browser-compatible cryptography
 */

import { CryptoError } from '@/core/error';

/**
 * Derives a cryptographic key from a password using PBKDF2
 * @param password - User password
 * @param salt - Salt (should be random and unique per user)
 * @param iterations - Number of PBKDF2 iterations (default: 100,000)
 * @returns Derived key
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations = 100_000,
): Promise<CryptoKey> {
  try {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    const baseKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey'],
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations,
        hash: 'SHA-256',
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt'],
    );
  } catch (error) {
    throw new CryptoError(`Key derivation failed: ${error}`);
  }
}

/**
 * Generates a random salt
 * @param length - Salt length in bytes (default: 16)
 */
export function generateSalt(length = 16): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Generates a random initialization vector for AES-GCM
 * @param length - IV length in bytes (default: 12 for AES-GCM)
 */
export function generateIV(length = 12): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Encrypts data using AES-256-GCM
 * @param key - Encryption key
 * @param data - Data to encrypt
 * @param iv - Initialization vector (will be generated if not provided)
 * @returns Object containing ciphertext and IV
 */
export async function encrypt(
  key: CryptoKey,
  data: string,
  iv?: Uint8Array,
): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const actualIV = iv || generateIV();

    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: actualIV as BufferSource,
      },
      key,
      dataBuffer,
    );

    return { ciphertext, iv: actualIV };
  } catch (error) {
    throw new CryptoError(`Encryption failed: ${error}`);
  }
}

/**
 * Decrypts AES-256-GCM encrypted data
 * @param key - Decryption key
 * @param ciphertext - Encrypted data
 * @param iv - Initialization vector used during encryption
 * @returns Decrypted plaintext
 */
export async function decrypt(
  key: CryptoKey,
  ciphertext: ArrayBuffer,
  iv: Uint8Array,
): Promise<string> {
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
      },
      key,
      ciphertext,
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new CryptoError(`Decryption failed: ${error}`);
  }
}

/**
 * Encodes ArrayBuffer to Base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes Base64 string to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Securely wipes a string from memory
 * Note: In JavaScript, we can't truly wipe memory, but we can overwrite the reference
 */
export function secureWipe(value: string): string {
  // Create a new string filled with zeros of the same length
  return '0'.repeat(value.length);
}
