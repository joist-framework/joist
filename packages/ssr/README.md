# SSR (Experimental)

Render ShadowDOM on the server with Declarative Shadow DOM. Parses HTML and recursively inserts user-defined templates. The most important part of this is the template loader. A template loader is an object that defines how the applicator will retrieve string values for both HTML and CSS templates (CSS is optional).

## Installation

```bash
npm i @joist/ssr
```

## Usage

Define a template caching strategy and a template loader, then use the `Applicator` to apply your custom templates to an HTML string or document.

```ts
import { Applicator, NoopTemplateCache, FileSysTemplateLoader } from "@joist/ssr";

// Define a template caching strategy and a template loader
const applicator = new Applicator(
  new NoopTemplateCache(),
  new FileSysTemplateLoader(
    (tag) => `elements/${tag}/${tag}.html`,
    (tag) => `elements/${tag}/${tag}.css`,
  ),
);

// Apply to a document and provide a list of elements to search for
const renderedHtml = applicator.apply(document, ["my-element", "my-dropdown"]);
```

## Vite Integration

While you can write a custom Vite plugin using `@joist/ssr`'s `Applicator`:

```ts
import { Applicator, NoopTemplateCache, FileSysTemplateLoader } from "@joist/ssr";
import { defineConfig } from "vite";

const applicator = new Applicator(
  new NoopTemplateCache(),
  new FileSysTemplateLoader(
    (tag) => `elements/${tag}/${tag}.html`,
    (tag) => `elements/${tag}/${tag}.css`,
  ),
);

export default defineConfig({
  plugins: [
    {
      name: "custom-joist-ssr",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return applicator.apply(html, ["my-element", "my-dropdown"]);
        },
      },
    },
  ],
});
```

We recommend using our official Vite plugin, which provides seamless integration and built-in hot-module-reloading (HMR) for element templates:

- See [@joist/plugin-vite](../plugin-vite/README.md) for detailed installation and usage guidelines.
