<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { validateEnv } from '@/core/env';

onMounted(() => {
  // Validate environment configuration
  try {
    validateEnv();
  } catch (error) {
    console.error('Environment validation failed:', error);
    alert('Application configuration error. Please check your environment settings.');
  }
});
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
  background: #1a1a1a;
  color: #e0e0e0;
}

/* Theme support */
[data-theme='light'] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #212121;
  --text-secondary: #757575;
  --border-color: #e0e0e0;
}

[data-theme='dark'] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --border-color: #404040;
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #2a2a2a;
}

::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #505050;
}

/* Selection styles */
::selection {
  background: #0066cc;
  color: white;
}
</style>
