/**
 * Application-level types and interfaces
 */

// Application state
export interface AppState {
  isAuthenticated: boolean
  apiConfigured: boolean
  lastError: string | null
}

// Secure storage keys
export enum SecureStorageKey {
  API_TOKEN = 'ots_api_token',
  API_USERNAME = 'ots_api_username',
  API_BASE_URL = 'ots_api_base_url',
}

// IPC Channel names (for secure communication between main and renderer)
export enum IpcChannel {
  // Storage operations
  STORAGE_SET = 'storage:set',
  STORAGE_GET = 'storage:get',
  STORAGE_DELETE = 'storage:delete',
  STORAGE_HAS = 'storage:has',

  // API operations
  API_CREATE_SECRET = 'api:create-secret',
  API_RETRIEVE_SECRET = 'api:retrieve-secret',
  API_GENERATE_SECRET = 'api:generate-secret',
  API_GET_METADATA = 'api:get-metadata',

  // Configuration
  CONFIG_SET = 'config:set',
  CONFIG_GET = 'config:get',

  // System
  APP_VERSION = 'app:version',
  APP_QUIT = 'app:quit',
}

// Result type for operations that can fail
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

// Secret display data (for UI)
export interface SecretDisplay {
  key: string
  url: string
  createdAt: Date
  expiresAt: Date
  hasPassphrase: boolean
  recipientCount: number
}

// App configuration
export interface AppConfig {
  theme: 'light' | 'dark' | 'system'
  autoCheckUpdates: boolean
  defaultTtl: number
  enableNotifications: boolean
}

// Default app configuration
export const DEFAULT_APP_CONFIG: AppConfig = {
  theme: 'system',
  autoCheckUpdates: true,
  defaultTtl: 604800, // 7 days in seconds
  enableNotifications: true,
}
