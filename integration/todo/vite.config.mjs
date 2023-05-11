import { defineConfig } from 'vite';
import minifyHTML from 'rollup-plugin-minify-html-literals';

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [minifyHTML.default()],
    },
  },
});
