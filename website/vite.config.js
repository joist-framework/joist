import { Applicator, NoopTemplateCache, FileSysTemplateLoader } from '@joist/ssr';
import joist from '@joist/plugin-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    target: 'es2020'
  },
  plugins: [
    joist(
      new Applicator(
        new NoopTemplateCache(),
        new FileSysTemplateLoader(
          (tag) => `./src/elements/${tag}/${tag}.html`,
          (tag) => `./src/elements/${tag}/${tag}.css`
        )
      )
    )
  ]
});
