<template>
  <div class="secret-feature">
    <div class="container">
      <header class="header">
        <h1>One-Time Secret</h1>
        <p class="subtitle">Share sensitive information securely</p>
      </header>

      <main class="main">
        <SecretResult v-if="store.hasCreatedSecret" />
        <SecretForm v-else />
      </main>

      <footer class="footer">
        <router-link to="/settings" class="link">Settings</router-link>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSecretStore } from './store/secret_store';
import SecretForm from './view/SecretForm.vue';
import SecretResult from './view/SecretResult.vue';

const store = useSecretStore();
</script>

<style scoped>
.secret-feature {
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
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #0066cc;
}

.subtitle {
  color: #b0b0b0;
  font-size: 1.1rem;
}

.main {
  margin-bottom: 2rem;
}

.footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #404040;
}

.link {
  color: #0066cc;
  text-decoration: none;
  transition: color 0.2s;
}

.link:hover {
  color: #0052a3;
  text-decoration: underline;
}
</style>
