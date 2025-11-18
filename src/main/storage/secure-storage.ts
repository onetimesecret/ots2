import { safeStorage } from 'electron'
import * as fs from 'fs/promises'
import * as path from 'path'
import { app } from 'electron'

/**
 * Secure storage using Electron's safeStorage API
 * This uses OS-level encryption:
 * - Windows: DPAPI
 * - macOS: Keychain
 * - Linux: Secret Service API (libsecret)
 */

const STORAGE_DIR = path.join(app.getPath('userData'), 'secure-storage')
const STORAGE_FILE = path.join(STORAGE_DIR, 'encrypted-data.json')

interface StorageData {
  [key: string]: string // Base64 encoded encrypted data
}

/**
 * Ensure storage directory exists
 */
async function ensureStorageDir(): Promise<void> {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create storage directory:', error)
    throw error
  }
}

/**
 * Load encrypted storage data from disk
 */
async function loadStorageData(): Promise<StorageData> {
  try {
    await ensureStorageDir()
    const data = await fs.readFile(STORAGE_FILE, 'utf-8')
    return JSON.parse(data) as StorageData
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty object
      return {}
    }
    console.error('Failed to load storage data:', error)
    throw error
  }
}

/**
 * Save encrypted storage data to disk
 */
async function saveStorageData(data: StorageData): Promise<void> {
  try {
    await ensureStorageDir()
    await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to save storage data:', error)
    throw error
  }
}

/**
 * Store an encrypted value
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available on this system')
  }

  // Encrypt the value
  const encrypted = safeStorage.encryptString(value)

  // Convert to base64 for storage
  const base64 = encrypted.toString('base64')

  // Load existing data
  const data = await loadStorageData()

  // Update with new encrypted value
  data[key] = base64

  // Save back to disk
  await saveStorageData(data)
}

/**
 * Retrieve and decrypt a value
 */
export async function getSecureItem(key: string): Promise<string | null> {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available on this system')
  }

  // Load storage data
  const data = await loadStorageData()

  // Get encrypted value
  const base64 = data[key]
  if (!base64) {
    return null
  }

  try {
    // Convert from base64
    const encrypted = Buffer.from(base64, 'base64')

    // Decrypt the value
    const decrypted = safeStorage.decryptString(encrypted)

    return decrypted
  } catch (error) {
    console.error('Failed to decrypt item:', error)
    throw new Error('Failed to decrypt stored item')
  }
}

/**
 * Delete a stored item
 */
export async function deleteSecureItem(key: string): Promise<void> {
  // Load storage data
  const data = await loadStorageData()

  // Remove the key
  delete data[key]

  // Save back to disk
  await saveStorageData(data)
}

/**
 * Check if a key exists in storage
 */
export async function hasSecureItem(key: string): Promise<boolean> {
  const data = await loadStorageData()
  return key in data
}

/**
 * Clear all stored items
 */
export async function clearSecureStorage(): Promise<void> {
  await saveStorageData({})
}

/**
 * Check if encryption is available
 */
export function isEncryptionAvailable(): boolean {
  return safeStorage.isEncryptionAvailable()
}
