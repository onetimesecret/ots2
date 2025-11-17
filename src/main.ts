/**
 * Application entry point
 * Bootstrap, dependency graph, and Vue app initialization
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './core/router';
import { setupDI } from './di_container';

// Initialize dependency injection container
setupDI();

// Create Vue app
const app = createApp(App);

// Install Pinia state management
const pinia = createPinia();
app.use(pinia);

// Install Vue Router
app.use(router);

// Mount the app
app.mount('#app');

// Error handling
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // TODO: Send to error reporting service if enabled
});

window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
  // TODO: Send to error reporting service if enabled
});

// Log startup info in development
if (import.meta.env.DEV) {
  console.log('OTS Client started in development mode');
  console.log('Environment:', import.meta.env);
}
