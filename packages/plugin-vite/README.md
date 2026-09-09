# Joist Vite Plugin

Official Vite plugin for server-side rendering Joist Web Components (using Declarative Shadow DOM) and enabling Hot Module Replacement (HMR) for static element templates.

## Installation

Install the plugin along with its peer dependency, `@joist/ssr`:

```bash
npm i @joist/plugin-vite @joist/ssr -D
```

## Usage

Configure the plugin in your `vite.config.ts` by instantiating an `Applicator` from `@joist/ssr` and passing it to the `@joist/plugin-vite` default export.

```typescript
import { Applicator, NoopTemplateCache, FileSysTemplateLoader } from "@joist/ssr";
import joistPlugin from "@joist/plugin-vite";
import { defineConfig } from "vite";

// Configure the SSR Applicator
const applicator = new Applicator(
  new NoopTemplateCache(),
  new FileSysTemplateLoader(
    (tag) => `elements/${tag}/${tag}.html`,
    (tag) => `elements/${tag}/${tag}.css`,
  ),
);

export default defineConfig({
  plugins: [
    // Registers the Joist SSR Vite plugin
    joistPlugin(applicator),
  ],
});
```

## Features

- **Declarative Shadow DOM SSR**: Pre-renders custom element shadow roots on the server-side, reducing layout shifts and speeding up initial paint.
- **HMR for HTML/CSS Templates**: Automatically triggers full-reloads when template files under your elements directories are modified, speeding up development.
