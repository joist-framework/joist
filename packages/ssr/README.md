# SSR (Experimental)

Render ShadowDOM on thee server with Declarative Shadow DOM. Parses HTML and recursively inserts user defined templates. The most important part of this would be the template loader. A template loader is an object that defines how the applicator will get the string values for both the html and the css. (css is optional).

```TS
import { Applicator, NoopTemplateCache, FileSysTemplateLoader } from '@joist/ssr';

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
import { Applicator. NoopTemplateCache, FileSysTemplateLoader } from '@joist/ssr';
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
      transformIndexHtml: {
        enforce: "pre",
        transform(html) {
          return applicator.apply(html, ['my-element', 'my-dropdown']);
        }
      }
    }
  ],
});
```
