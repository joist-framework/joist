# Migration Guide: `@joist/di` v3 ➜ v4

Version 4 of `@joist/di` introduces several important changes that modernize its API and align it with the latest JavaScript and TypeScript standards. This includes:

- Support for **standard decorators**
- Removal of legacy `emitDecoratorMetadata` support
- Tuple-based **provider definitions**
- Renamed `inject()` method for service retrieval
- A new `DOMInjector` for DOM-based DI

Follow this guide to upgrade your project from v3 to v4 smoothly.

## 0. TypeScript Configuration

`@joist/di` v4 is built around [standard decorators](https://github.com/tc39/proposal-decorators). You'll need to disable legacy decorator options in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": false,
    "emitDecoratorMetadata": false
  }
}
```

Make sure your build setup supports standard decorators (e.g., TypeScript 5.3+, Vite, SWC, or Babel with the correct plugins).

## 1. Provider Definition Syntax

Providers are now defined using a tuple-based format rather than an object literal.

Before:

```ts
const myProvider = {
  provide: MyService,
  factory() {
    return new MyService();
  },
} as const;
```

After:

```ts
import type { Provider } from "@joist/di";

const myProvider: Provider<MyService> = [
  MyService,
  {
    factory() {
      return new MyService();
    },
  },
] as const;
```

## 2. Standard Decorator Usage

All decorators (such as @injectable) must now be called explicitly, even with no arguments.

Before (legacy syntax):

```ts
@injectable
class MyService {
  static providers: [{ provide: Debug; use: ConsoleDebug }];
}
```

After (decorator takes optional arguments):

```ts
@injectable({ providers: [[Debug, { use: ConsoleDebug }]] })
class MyService {}
```

## 3. Injection API Change

The method for retrieving injected services has changed from .get() to .inject() for clarity and consistency.

Before:

```ts
const service = injector.get(MyService);
```

After:

```ts
const service = injector.inject(MyService);
```

## 4. DOM Injection with DOMInjector

If you're injecting services into DOM-attached elements (e.g. custom elements, client-side entry points), use the new DOMInjector:

```ts
import { DOMInjector } from "@joist/di";

const app = new DOMInjector();
app.attach(document.body);
```

Be sure to also checkout the `@joist/element` package, it can help you with [custom element definition order](https://github.com/joist-framework/joist/tree/main/packages/element#dependencies)!
