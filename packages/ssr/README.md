# SSR (Experimental)

Render ShadowDOM on thee server with Declarative Shadow DOM. Parses HTML and recursively inserts user defined templates. The most important part of this would be the template loader. A template loader is an object that defines how the applicator will get the string values for both the html and the css. (css is optional).

```TS
import { Applicator. NoopTemplateCache, FileSysTemplateLoader } from '@joist/ssr';

// Define a template caching strategy and a template loader
const applicator = new Applicator(
  new NoopTemplateCache(),
  new FileSysTemplateLoader(
    (tag) => `elements/${tag}/${tag}.html`,
    (tag) => `elements/${tag}/${tag}.css`
  )
);

// Apply to a document and provide a list of elements to search for
applicator.apply(document, [])
```

## Vite

```TS
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
```
