# Di

Dependency Injection in ~800 bytes. The Joist Dependency Injector is a small inversion of control (IOC) container that resolves dependencies lazyily.
This means that it passes functions around and that dependencies are not initialized untill they are called.

#### Installation:

```BASH
npm i @joist/di
```

#### Example:

```TS
import { Injector, Injected } from '@joist/di';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  static inject = [FooService];

  constructor(public foo: Injected<FooService>) { }

  sayHello() {
    return this.foo().sayHello();
  }
}

const app = new Injector();

app.get(BarService).sayHello(); // Hello from BarService and Hello from FooService
```

#### Override A Service:

```TS
import { Injector, inject, Injected } from '@joist/di';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  static inject = [FooService];

  constructor(public foo: Injected<FooService>) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo().sayHello();
  }
}

// Override FooService with an alternate implementation
const app = new Injector([
  {
    provide: FooService,
    use: class extends FooService {
      sayHello() {
        return 'IT HAS BEEN OVERRIDEN'
      }
    }
  }
]);

app.get(BarService).sayHello(); // Hello from BarService and IT HAS BEEN OVERRIDEN
```

#### Root Service

If you have nested injectors and you want to make sure the same instance is provided to all you can mark your class as a "service".

```TS
class FooService {
  static service = true;

  sayHello() {
    return 'Hello From FooService';
  }
}
```

## Custom Elements

Joist DI was built with custom elements in mind. Custom elements are an example where you do not have direct control over how your classes are instantiated.

Since the browser will be what initializes your custom elements we need to be able to tell the browser how to pass arguments.

The `@injectable` decorator allows the Joist Dependency Injector to pass arguments to your custom element when instances of your element is created.

#### Inject dependency into your custom element constructor

```TS
import { injectable, Injected } from '@joist/di';

class MyService {}

@injectable
class MyElement extends HTMLElement {
  static inject = [MyService];

  constructor(public myService: Injected<MyService>) {}
}

customElements.define('my-element', MyElement);
```

#### Define global providers and overrides

This allows your to override services for different environments or scenarios

```TS
import { environment, injectable, Injected } from '@joist/di';

class Config {
  apiUrl = 'http://localhost:4000/api/'
}

environment().providers.push({
  provide: Config,
  use: class {
    apiUrl = 'http://real-api/api/'
  }
});

@injectable
class MyElement extends HTMLElement {
  static inject = [Config];

  constructor(config: Injected<Config>) {
    console.log(config().apiUrl); // http://real-api/api/
  }
}

customElements.define('my-element', MyElement);
```

## Context

The Joist injector is hierarchical meaning that you can define context for just one part of the DOM tree.

### NOTE:

When using context elements it is important that they are registered BEFORE your other elements.
If child elements are upgraded before the context element they won't be able to find the context scope.
If you plan on using context elements you will need to wait until the element has been attached so it can find any potential parent injectors.

```TS
import { injectable, Injected } from '@joist/di';

class Colors {
  primary = 'red';
  secodnary = 'green';
}

@injectable
class ColorCtx extends HTMLElement {
  static providers = [
    {
      provide: Colors,
      use: class implements Colors {
        primary = 'orange';
        secondary = 'purple';
      },
    },
  ];
}

@injectable
class MyElement extends HTMLElement {
  static inject = [Colors];

  constructor(public colors: Injected<Colors>) {
    super();
  }

  connectedCallback() {
    // run in connected callback so your element can check its parents
    const { primary } = this.colors();

    this.style.background = primary;
  }
}

customElements.define('color-ctx', ColorCtx);
customElements.define('my-element', MyElement);
```

```HTML
<!-- Default Colors -->
<my-element></my-element>

<!-- Special color ctx -->
<color-ctx>
  <my-element></my-element>
</color-ctx>
```
