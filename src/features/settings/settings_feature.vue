<template>
  <div class="settings-feature">
    <div class="container">
      <header class="header">
        <router-link to="/" class="back-link">&larr; Back to Home</router-link>
        <h1>Settings</h1>
      </header>

      <main class="main">
        <SettingsForm />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettingsStore } from './store/settings_store';
import SettingsForm from './view/SettingsForm.vue';

const store = useSettingsStore();

onMounted(() => {
  store.loadSettings();
});
</script>

<style scoped>
.settings-feature {
  min-height: 100vh;
  background: #1a1a1a;
  color: #e0e0e0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #0066cc;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: #0052a3;
  text-decoration: underline;
}

h1 {
  font-size: 2rem;
  color: #e0e0e0;
}
</style>
