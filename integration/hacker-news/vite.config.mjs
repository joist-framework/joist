import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        static: resolve(__dirname, 'static.html'),
        vanilla: resolve(__dirname, 'vanilla.html')
      }
    }
  }
});
