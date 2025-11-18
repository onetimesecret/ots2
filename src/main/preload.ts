import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannel } from '@shared/types/app'
import type {
  CreateSecretRequest,
  RetrieveSecretRequest,
  CreateSecretResponse,
  RetrieveSecretResponse,
  SecretMetadata,
} from '@shared/types'

/**
 * Secure IPC Bridge
 * This preload script exposes a limited, secure API to the renderer process
 * using contextBridge to maintain context isolation
 */

// Define the API interface
export interface ElectronAPI {
  // Storage API
  storage: {
    set: (key: string, value: string) => Promise<{ success: boolean; error?: string }>
    get: (key: string) => Promise<{ success: boolean; data?: string | null; error?: string }>
    delete: (key: string) => Promise<{ success: boolean; error?: string }>
    has: (key: string) => Promise<{ success: boolean; data?: boolean; error?: string }>
  }

  // API operations
  api: {
    createSecret: (
      request: CreateSecretRequest
    ) => Promise<{ success: boolean; data?: CreateSecretResponse; error?: string }>
    retrieveSecret: (
      request: RetrieveSecretRequest
    ) => Promise<{ success: boolean; data?: RetrieveSecretResponse; error?: string }>
    generateSecret: (request: {
      passphrase?: string
      ttl?: number
      recipient?: string
    }) => Promise<{ success: boolean; data?: CreateSecretResponse; error?: string }>
    getMetadata: (
      metadataKey: string
    ) => Promise<{ success: boolean; data?: SecretMetadata; error?: string }>
  }

  // App operations
  app: {
    getVersion: () => Promise<{ success: boolean; data?: string; error?: string }>
    quit: () => Promise<{ success: boolean; error?: string }>
  }
}

// Expose protected methods to the renderer process
const electronAPI: ElectronAPI = {
  storage: {
    set: (key: string, value: string) => ipcRenderer.invoke(IpcChannel.STORAGE_SET, key, value),
    get: (key: string) => ipcRenderer.invoke(IpcChannel.STORAGE_GET, key),
    delete: (key: string) => ipcRenderer.invoke(IpcChannel.STORAGE_DELETE, key),
    has: (key: string) => ipcRenderer.invoke(IpcChannel.STORAGE_HAS, key),
  },

  api: {
    createSecret: (request: CreateSecretRequest) =>
      ipcRenderer.invoke(IpcChannel.API_CREATE_SECRET, request),
    retrieveSecret: (request: RetrieveSecretRequest) =>
      ipcRenderer.invoke(IpcChannel.API_RETRIEVE_SECRET, request),
    generateSecret: (request: { passphrase?: string; ttl?: number; recipient?: string }) =>
      ipcRenderer.invoke(IpcChannel.API_GENERATE_SECRET, request),
    getMetadata: (metadataKey: string) =>
      ipcRenderer.invoke(IpcChannel.API_GET_METADATA, metadataKey),
  },

  app: {
    getVersion: () => ipcRenderer.invoke(IpcChannel.APP_VERSION),
    quit: () => ipcRenderer.invoke(IpcChannel.APP_QUIT),
  },
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
