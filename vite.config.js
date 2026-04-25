import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: '/wordy-prototype.html',
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  build: {
    rollupOptions: {
      input: {
        prototype: resolve(__dirname, 'wordy-prototype.html'),
      },
    },
  },
});
