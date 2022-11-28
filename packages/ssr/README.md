# SSR

Render ShadowDOM on thee server with Declarative Shadow DOM. Parses HTML and recursively inserts user defined templates.

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
applicator.apply(document, { elements: [] })
```
