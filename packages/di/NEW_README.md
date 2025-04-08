# Di

Small and efficient dependency injection for TypeScript applications.

Allows you to inject services into other class instances (including custom elements and Node.js).

## Benefits

- 🚀 **Simple API**: Minimal boilerplate with intuitive decorators and injection
- 💪 **Type Safety**: Full TypeScript support with proper type inference
- 🌳 **Hierarchical DI**: Create scoped injectors with parent-child relationships
- ⚡️ **Lazy Loading**: Services are only instantiated when needed
- 🧪 **Testing Friendly**: Easy mocking with provider overrides
- 🧩 **Web Component Support**: Built-in integration with custom elements
- 🔄 **Context Pattern**: React-like context for web components
- 🔌 **Lifecycle Hooks**: Fine-grained control over service initialization
- ⏱️ **Async Support**: Handle asynchronous service creation
- 📦 **Zero Dependencies**: Lightweight with no external dependencies

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
  - [Injectors](#injectors)
  - [Services](#services)
  - [Providers](#providers)
  - [Lifecycle Hooks](#lifecycle-hooks)
- [Advanced Topics](#advanced-topics)
  - [Hierarchical Injectors](#hierarchical-injectors)
  - [Custom Elements](#custom-elements)
  - [Async Services](#async-services)
  - [Testing](#testing)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)

## Installation

```bash
npm i @joist/di
```

## Quick Start

Here's a simple example to get you started:

```ts
import { Injector, injectable, inject } from '@joist/di';

// Define a service
class Logger {
  log(message: string) {
    console.log(message);
  }
}

// Create an injectable service that depends on Logger
@injectable()
class UserService {
  #logger = inject(Logger);

  createUser(name: string) {
    const logger = this.#logger();

    logger.log(`Creating user: ${name}`);
    // ... user creation logic
  }
}

// Set up the injector
const app = new Injector();
const userService = app.inject(UserService);

// Use the service
userService.createUser('John');
```

## Core Concepts

### Injectors

Injectors are the core of the dependency injection system. They:
- Create and manage service instances
- Handle dependency resolution
- Maintain a hierarchy of injectors
- Cache service instances

```ts
const app = new Injector();

// Inject a service
const service = app.inject(MyService);

// Create a child injector
const child = new Injector({ parent: app });
```

### Services

Services are classes that can be injected into other services. They are typically singletons, meaning the same instance is returned for each injection.

```ts
class Counter {
  value = 0;

  inc(val: number) {
    this.value += val;
  }
}

const app = new Injector();
const counter1 = app.inject(Counter);
const counter2 = app.inject(Counter);

console.log(counter1 === counter2); // true
```

### Injectable Services

Services that depend on other services must be decorated with `@injectable()`. Dependencies are injected using the `inject()` function.

```ts
@injectable()
class UserService {
  #logger = inject(Logger);
  #db = inject(Database);

  async createUser(name: string) {
    this.#logger().log(`Creating user: ${name}`);
    return this.#db().insert({ name });
  }
}
```

### Providers

Providers define how services are created. There are several types of providers:

1. **Class Providers**: The simplest form, just a class
```ts
const app = new Injector();
app.inject(MyService); // Uses MyService class directly
```

2. **Factory Providers**: Custom creation logic
```ts
const app = new Injector({
  providers: [[
    Logger,
    {
      factory: (injector) => new CustomLogger(injector)
    }
  ]]
});
```

3. **Static Tokens**: For non-class values
```ts
const API_URL = new StaticToken<string>('api_url', () => 'https://api.example.com');

const app = new Injector({
  providers: [[API_URL, { factory: () => 'https://api.example.com' }]]
});
```

### Lifecycle Hooks

Services can implement lifecycle hooks to handle initialization and cleanup:

```ts
@injectable()
class MyService {
  @created()
  onCreated(injector: Injector) {
    // Called when the service is first created
    console.log('Service created');
  }

  @injected()
  onInjected(injector: Injector) {
    // Called every time the service is injected
    console.log('Service injected');
  }
}
```

## Advanced Topics

### Hierarchical Injectors

Injectors can form a parent-child hierarchy. Child injectors can access services from their parents, but not vice versa.

```ts
const root = new Injector();
const child = new Injector({ parent: root });

// Child can access root services
child.inject(RootService);

// Root cannot access child services
root.inject(ChildService); // Error
```

### Custom Elements

Di integrates seamlessly with web components:

```ts
@injectable()
class MyElement extends HTMLElement {
  #logger = inject(Logger);

  connectedCallback() {
    this.#logger().log('Element connected');
  }
}

customElements.define('my-element', MyElement);
```

### Async Services

Services can be asynchronous:

```ts
const DataService = new StaticToken('data', async () => {
  const response = await fetch('/api/data');
  return response.json();
});

@injectable()
class MyComponent {
  #data = inject(DataService);

  async init() {
    const data = await this.#data();
    // Use data
  }
}
```

### Testing

Easy mocking and testing support:

```ts
class MockLogger extends Logger {
  logs: string[] = [];
  
  log(message: string) {
    this.logs.push(message);
  }
}

const testInjector = new Injector({
  providers: [[Logger, { use: MockLogger }]]
});

const service = testInjector.inject(UserService);
service.createUser('Test User');

const logger = testInjector.inject(Logger);
assert(logger.logs.includes('Creating user: Test User'));
```

## API Reference

### Decorators

- `@injectable(options?: InjectableOptions)`: Marks a class as injectable
- `@created()`: Lifecycle hook called when service is created
- `@injected()`: Lifecycle hook called when service is injected

### Classes

- `Injector`: Core DI container
- `DOMInjector`: Special injector for web components
- `StaticToken`: Token for non-class values

### Types

- `InjectableOptions`: Options for @injectable decorator
- `Provider`: Service provider definition
- `InjectionToken`: Token for service injection

## Best Practices

1. **Service Design**
   - Keep services focused and single-responsibility
   - Use dependency injection for external dependencies
   - Implement lifecycle hooks for cleanup

2. **Injector Usage**
   - Create injectors at the application root
   - Use child injectors for scoped services
   - Clean up injectors when no longer needed

3. **Testing**
   - Mock external dependencies
   - Use test-specific providers
   - Test lifecycle hooks
   - Verify service interactions

## Error Handling

Common errors and how to handle them:

1. **Constructor Injection**
```ts
// ❌ Wrong
class MyService {
  constructor(private logger: Logger) {} // Don't inject in constructor
}

// ✅ Correct
@injectable()
class MyService {
  #logger = inject(Logger);
}
```
