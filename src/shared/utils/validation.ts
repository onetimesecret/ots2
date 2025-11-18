/**
 * Validation utilities
 */

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validate API token format (basic validation)
 */
export function isValidApiToken(token: string): boolean {
  return token.length >= 16 && /^[a-zA-Z0-9_-]+$/.test(token)
}

/**
 * Validate TTL value (time to live in seconds)
 */
export function isValidTtl(ttl: number): boolean {
  // TTL should be between 5 minutes and 7 days
  const MIN_TTL = 300 // 5 minutes
  const MAX_TTL = 604800 // 7 days
  return ttl >= MIN_TTL && ttl <= MAX_TTL
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  // Remove any HTML tags and trim whitespace
  return input.replace(/<[^>]*>/g, '').trim()
}

/**
 * Validate secret key format
 */
export function isValidSecretKey(key: string): boolean {
  // Secret keys should be alphanumeric and at least 8 characters
  return key.length >= 8 && /^[a-zA-Z0-9]+$/.test(key)
}
