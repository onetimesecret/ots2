<template>
  <div class="app">
    <header class="app-header">
      <h1>OneTimeSecret</h1>
      <p class="subtitle">Secure Secret Sharing</p>
    </header>

    <main class="app-main">
      <div class="tabs">
        <button
          :class="['tab', { active: activeTab === 'create' }]"
          @click="activeTab = 'create'"
        >
          Create Secret
        </button>
        <button
          :class="['tab', { active: activeTab === 'retrieve' }]"
          @click="activeTab = 'retrieve'"
        >
          Retrieve Secret
        </button>
        <button
          :class="['tab', { active: activeTab === 'settings' }]"
          @click="activeTab = 'settings'"
        >
          Settings
        </button>
      </div>

      <div class="tab-content">
        <CreateSecret v-if="activeTab === 'create'" />
        <RetrieveSecret v-else-if="activeTab === 'retrieve'" />
        <Settings v-else-if="activeTab === 'settings'" />
      </div>
    </main>

    <footer class="app-footer">
      <p>Secure, ephemeral secret sharing • End-to-end encryption</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CreateSecret from './components/CreateSecret.vue'
import RetrieveSecret from './components/RetrieveSecret.vue'
import Settings from './components/Settings.vue'

type TabType = 'create' | 'retrieve' | 'settings'
const activeTab = ref<TabType>('create')
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.tab:hover {
  color: #374151;
  background: #f9fafb;
}

.tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-footer {
  background: #f9fafb;
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
  border-top: 1px solid #e5e7eb;
}

.app-footer p {
  margin: 0;
  font-size: 0.875rem;
}
</style>
