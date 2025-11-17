<template>
  <div class="container">
    <header class="header">
      <h1>Onetimesecret Desktop</h1>
      <p class="subtitle">Secure, privacy-first secret sharing</p>
    </header>

    <main class="main">
      <div class="card">
        <h2>API Configuration</h2>
        <ApiConfig />
      </div>

      <div class="card">
        <h2>Create Secret</h2>
        <CreateSecret />
      </div>

      <div class="card">
        <h2>Retrieve Secret</h2>
        <RetrieveSecret />
      </div>
    </main>

    <footer class="footer">
      <p>Built with Tauri v2 | Secure by design</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ApiConfig from './components/ApiConfig.vue'
import CreateSecret from './components/CreateSecret.vue'
import RetrieveSecret from './components/RetrieveSecret.vue'
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.5rem;
}

.footer {
  padding: 1.5rem;
  text-align: center;
  background: #f5f5f5;
  color: #666;
  font-size: 0.9rem;
}
</style>
