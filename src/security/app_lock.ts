/**
 * Application lock manager
 * Handles window state changes and background timeout
 */

import { injectable } from 'tsyringe';
import { ref, Ref } from 'vue';
import { getCurrentWindow } from '@tauri-apps/api/window';

export type LockTimeout = 30 | 60 | 300; // 30s, 1m, 5m

export interface AppLockConfig {
  timeout: LockTimeout;
  biometricEnabled: boolean;
}

@injectable()
export class AppLockService {
  private readonly isLocked: Ref<boolean> = ref(false);
  private lockTimer: number | null = null;
  private config: AppLockConfig = {
    timeout: 60, // Default 1 minute
    biometricEnabled: false,
  };

  constructor() {
    this.setupWindowListeners();
  }

  /**
   * Get the current lock state
   */
  get locked(): Ref<boolean> {
    return this.isLocked;
  }

  /**
   * Configure lock settings
   */
  configure(config: Partial<AppLockConfig>): void {
    this.config = { ...this.config, ...config };

    // Restart timer with new timeout
    if (this.lockTimer) {
      this.resetLockTimer();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): AppLockConfig {
    return { ...this.config };
  }

  /**
   * Lock the application
   */
  lock(): void {
    this.isLocked.value = true;
    this.clearLockTimer();

    // TODO: Clear sensitive data from memory
    // TODO: Notify other components about lock state
  }

  /**
   * Unlock the application
   * @param password - User password for verification
   * @returns true if unlock successful
   */
  async unlock(password: string): Promise<boolean> {
    // TODO: Verify password against stored hash
    // TODO: Support biometric authentication

    // Placeholder implementation
    if (password.length > 0) {
      this.isLocked.value = false;
      this.resetLockTimer();
      return true;
    }

    return false;
  }

  /**
   * Start the auto-lock timer
   */
  private startLockTimer(): void {
    this.clearLockTimer();

    this.lockTimer = window.setTimeout(() => {
      this.lock();
    }, this.config.timeout * 1000);
  }

  /**
   * Reset the auto-lock timer
   */
  private resetLockTimer(): void {
    this.startLockTimer();
  }

  /**
   * Clear the auto-lock timer
   */
  private clearLockTimer(): void {
    if (this.lockTimer !== null) {
      window.clearTimeout(this.lockTimer);
      this.lockTimer = null;
    }
  }

  /**
   * Set up window event listeners for auto-lock
   */
  private setupWindowListeners(): void {
    const appWindow = getCurrentWindow();

    // Listen for window focus/blur events
    appWindow.listen('tauri://blur', () => {
      // Window lost focus - start lock timer
      this.startLockTimer();
    });

    appWindow.listen('tauri://focus', () => {
      // Window gained focus - reset lock timer
      this.resetLockTimer();
    });

    // Listen for user activity to reset timer
    if (typeof window !== 'undefined') {
      const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];

      activityEvents.forEach((event) => {
        window.addEventListener(event, () => {
          if (!this.isLocked.value) {
            this.resetLockTimer();
          }
        }, { passive: true });
      });
    }

    // Start initial timer
    this.startLockTimer();
  }

  /**
   * Destroy the service and clean up listeners
   */
  destroy(): void {
    this.clearLockTimer();
    // TODO: Remove event listeners
  }
}
