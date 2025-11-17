<template>
  <div class="main-view">
    <header class="header">
      <h1>OneTimeSecret</h1>
      <div class="header-actions">
        <span class="user-info">{{ store.credentials?.username }}</span>
        <button class="btn btn-secondary" @click="handleLogout">
          Logout
        </button>
      </div>
    </header>

    <div class="container">
      <div class="tabs mb-4">
        <button
          class="tab"
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          Create Secret
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'retrieve' }"
          @click="activeTab = 'retrieve'"
        >
          Retrieve Secret
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'secrets' }"
          @click="activeTab = 'secrets'"
        >
          My Secrets
        </button>
      </div>

      <CreateSecret v-if="activeTab === 'create'" />
      <RetrieveSecret v-else-if="activeTab === 'retrieve'" />
      <SecretList v-else-if="activeTab === 'secrets'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/stores/app';
import CreateSecret from '@/components/CreateSecret.vue';
import RetrieveSecret from '@/components/RetrieveSecret.vue';
import SecretList from '@/components/SecretList.vue';

const store = useAppStore();
const activeTab = ref<'create' | 'retrieve' | 'secrets'>('create');

async function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    await store.logout();
  }
}
</script>

<style scoped>
.main-view {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
}

.header {
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.5rem;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid var(--color-border);
}

.tab {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--color-text);
}

.tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
</style>
