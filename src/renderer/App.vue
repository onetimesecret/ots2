<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'
import { useAuthStore } from './stores/auth'
import CreateSecret from './components/CreateSecret.vue'
import RetrieveSecret from './components/RetrieveSecret.vue'
import AuthConfig from './components/AuthConfig.vue'

const appStore = useAppStore()
const authStore = useAuthStore()

onMounted(async () => {
  await appStore.loadAppVersion()
  await authStore.loadCredentials()
})
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>OneTimeSecret Desktop</h1>
      <p class="subtitle">Secure, privacy-first secret sharing</p>
      <div class="version">v{{ appStore.appVersion }}</div>
    </header>

    <main class="app-main">
      <!-- Show auth config if not authenticated -->
      <AuthConfig v-if="!authStore.isAuthenticated" />

      <!-- Show secret management when authenticated -->
      <div v-else class="secret-container">
        <div class="tabs">
          <div class="tab-content">
            <CreateSecret />
            <div class="divider"></div>
            <RetrieveSecret />
          </div>
        </div>
      </div>

      <!-- Error display -->
      <div v-if="appStore.hasError" class="error-banner">
        <strong>Error:</strong> {{ appStore.error }}
        <button @click="appStore.clearError" class="error-close">×</button>
      </div>

      <!-- Loading indicator -->
      <div v-if="appStore.isLoading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
    </main>

    <footer class="app-footer">
      <p>
        Built with security and privacy in mind •
        <a href="https://onetimesecret.dev" target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
}

.app-header {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #667eea;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 1.1rem;
}

.version {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #999;
}

.app-main {
  flex: 1;
  padding: 2rem;
  position: relative;
}

.secret-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.divider {
  height: 2px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 1rem 0;
}

.error-banner {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #ff5252;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideIn 0.3s ease-out;
  z-index: 1000;
}

.error-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.app-footer {
  text-align: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  color: white;
}

.app-footer p {
  margin: 0;
}

.app-footer a {
  color: white;
  text-decoration: underline;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
