import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { minifyHTMLLiterals } from 'minify-html-literals';

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'minify-html-literals',
          transform: (code) => minifyHTMLLiterals(code)?.code
        }
      ]
    }
  }
});
