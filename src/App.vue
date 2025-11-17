<template>
  <div id="app">
    <div v-if="store.loading" class="loading-container">
      <div class="loading">Loading...</div>
    </div>

    <template v-else>
      <SetupView v-if="!store.isAuthenticated" />
      <MainView v-else />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import SetupView from '@/components/SetupView.vue';
import MainView from '@/components/MainView.vue';

const store = useAppStore();

onMounted(async () => {
  await store.loadCredentials();
});
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
}
</style>
