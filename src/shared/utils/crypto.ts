/**
 * Cryptographic utilities
 * These are helper functions for working with encrypted data
 */

/**
 * Convert a Buffer to a base64 string
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64')
}

/**
 * Convert a base64 string to a Buffer
 */
export function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64')
}

/**
 * Securely compare two strings in constant time to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Generate a random string for use as a passphrase or identifier
 */
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomArray = new Uint8Array(length)

  // Use crypto.getRandomValues for secure random generation
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomArray)
  } else if (typeof global !== 'undefined' && global.crypto) {
    global.crypto.getRandomValues(randomArray)
  } else {
    throw new Error('Crypto API not available')
  }

  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomArray[i]! % chars.length)
  }

  return result
}

/**
 * Validate passphrase strength
 */
export function validatePassphraseStrength(passphrase: string): {
  isValid: boolean
  strength: 'weak' | 'medium' | 'strong'
  feedback: string[]
} {
  const feedback: string[] = []
  let strength: 'weak' | 'medium' | 'strong' = 'weak'

  if (passphrase.length < 8) {
    feedback.push('Passphrase should be at least 8 characters long')
  }

  const hasUpperCase = /[A-Z]/.test(passphrase)
  const hasLowerCase = /[a-z]/.test(passphrase)
  const hasNumbers = /\d/.test(passphrase)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passphrase)

  const criteriaMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length

  if (criteriaMet < 2) {
    feedback.push('Use a mix of uppercase, lowercase, numbers, and special characters')
  }

  if (passphrase.length >= 12 && criteriaMet >= 3) {
    strength = 'strong'
  } else if (passphrase.length >= 8 && criteriaMet >= 2) {
    strength = 'medium'
  }

  return {
    isValid: passphrase.length >= 8 && criteriaMet >= 2,
    strength,
    feedback,
  }
}
