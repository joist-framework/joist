import { Applicator, NoopTemplateCache, FileSysTemplateLoader } from '@joist/ssr';
import { defineConfig } from 'vite';

const applicator = new Applicator(
  new NoopTemplateCache(),
  new FileSysTemplateLoader(
    (tag) => `elements/${tag}/${tag}.html`,
    (tag) => `elements/${tag}/${tag}.css`
  )
);

export default defineConfig({
  plugins: [
    {
      name: 'Web Component SSR',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          return applicator.apply(html, ['joist-header', 'joist-nav']);
        }
      },
      handleHotUpdate({ file, server }) {
        if (file.includes('elements') && (file.endsWith('.html') || file.endsWith('.css'))) {
          console.log(`${file} updated...`);

          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
        }
      }
    }
  ]
});
