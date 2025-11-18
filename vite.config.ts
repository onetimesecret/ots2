import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`
        entry: 'src/main/index.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`
        input: 'src/main/preload.ts',
      },
      // Optional: Use Node.js API in the Renderer process
      renderer: {},
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@main': resolve(__dirname, './src/main'),
      '@renderer': resolve(__dirname, './src/renderer'),
      '@shared': resolve(__dirname, './src/shared'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure proper code splitting
        manualChunks: {
          'vue-vendor': ['vue', 'pinia'],
          'api-vendor': ['axios', 'axios-retry', 'zod'],
        },
      },
    },
  },
})
