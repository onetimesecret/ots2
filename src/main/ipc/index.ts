import { ipcMain } from 'electron'
import { IpcChannel } from '@shared/types/app'
import {
  setSecureItem,
  getSecureItem,
  deleteSecureItem,
  hasSecureItem,
} from '../storage/secure-storage'
import { getApiClient } from '../api/client'
import type {
  CreateSecretRequest,
  RetrieveSecretRequest,
} from '@shared/types'

/**
 * Register all IPC handlers for secure communication
 */
export function registerIpcHandlers(): void {
  // Storage handlers
  ipcMain.handle(IpcChannel.STORAGE_SET, async (_event, key: string, value: string) => {
    try {
      await setSecureItem(key, value)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle(IpcChannel.STORAGE_GET, async (_event, key: string) => {
    try {
      const value = await getSecureItem(key)
      return { success: true, data: value }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle(IpcChannel.STORAGE_DELETE, async (_event, key: string) => {
    try {
      await deleteSecureItem(key)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle(IpcChannel.STORAGE_HAS, async (_event, key: string) => {
    try {
      const exists = await hasSecureItem(key)
      return { success: true, data: exists }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  // API handlers
  ipcMain.handle(IpcChannel.API_CREATE_SECRET, async (_event, request: CreateSecretRequest) => {
    try {
      const client = getApiClient()
      const response = await client.createSecret(request)
      return { success: true, data: response }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle(
    IpcChannel.API_RETRIEVE_SECRET,
    async (_event, request: RetrieveSecretRequest) => {
      try {
        const client = getApiClient()
        const response = await client.retrieveSecret(request)
        return { success: true, data: response }
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    }
  )

  ipcMain.handle(
    IpcChannel.API_GENERATE_SECRET,
    async (_event, request: { passphrase?: string; ttl?: number; recipient?: string }) => {
      try {
        const client = getApiClient()
        const response = await client.generateSecret(request)
        return { success: true, data: response }
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    }
  )

  ipcMain.handle(IpcChannel.API_GET_METADATA, async (_event, metadataKey: string) => {
    try {
      const client = getApiClient()
      const response = await client.getMetadata(metadataKey)
      return { success: true, data: response }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  // App handlers
  ipcMain.handle(IpcChannel.APP_VERSION, async () => {
    const { app } = require('electron')
    return { success: true, data: app.getVersion() }
  })

  ipcMain.handle(IpcChannel.APP_QUIT, async () => {
    const { app } = require('electron')
    app.quit()
    return { success: true }
  })
}
