/**
 * Dependency Injection Container Setup
 * Using tsyringe for compile-time type safety
 */

import 'reflect-metadata';
import { container } from 'tsyringe';
import { SecureStorageService } from '@/security/secure_kv';
import { AppLockService } from '@/security/app_lock';
import { OtsV2Client } from '@/network/ots_client';

/**
 * Register all services in the DI container
 */
export function setupDI(): void {
  // Security services
  container.registerSingleton('SecureStorageService', SecureStorageService);
  container.registerSingleton('AppLockService', AppLockService);

  // Network services
  container.registerSingleton('OtsV2Client', OtsV2Client);

  // Log registration for debugging
  if (import.meta.env.DEV) {
    console.log('DI container initialized');
  }
}

/**
 * Get a service from the DI container
 */
export function getService<T>(token: string | { new (...args: any[]): T }): T {
  return container.resolve(token as any);
}

/**
 * Clear the DI container (useful for testing)
 */
export function clearContainer(): void {
  container.clearInstances();
}
