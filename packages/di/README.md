# Di

Dependency Injection in ~800 bytes.

#### Installation:

```BASH
npm i @joist/di@beta
```

#### Example:

```TS
import { Injector } from '@joist/di';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  static inject = [FooService];

  constructor(private foo: FooService) {}

  sayHello() {
    return this.foo.sayHello();
  }
}

const app = new Injector();

app.get(BarService).sayHello(); // Hello from BarService and Hello from FooService
```

#### Override A Service:

```TS
import { Injector, inject } from '@joist/di';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  static inject = [FooService];

  constructor(private foo: FooService) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo.sayHello();
  }
}

// Override FooService with an alternate implementation
const app = new Injector({
  providers: [
    {
      provide: FooService,
      use: class extends FooService {
        sayHello() {
          return 'IT HAS BEEN OVERRIDEN'
        }
      }
    }
  ]
});

app.get(BarService).sayHello(); // Hello from BarService and IT HAS BEEN OVERRIDEN
```

#### Root Service

If you have nested injectors and you want to make sure the same instance is provided to all decorate your service with `@service()`.

```TS
import { service } from '@joist/di';

@service
class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}
```

## Custom Elements

Joist DI was built with custom elements in mind. Custom elements are an example where you do not have direct control over how your classes are instantiated.

Since the browser will be what initializes your custom elements we need to be able to tell the browser how to pass arguments.

The `@injectable` decorator allows the Joist Dependency Injector to pass arguments to your custom element when instances of your element is created.

`@injectable` also injects your services in a lazy way. Instead of passing direct instances of your services it passes a function that be called when you need your service instance. This allows the injector to look for parent injectors which are only availabel after connectedCallback.

#### Inject dependency into your custom element constructor

```TS
import { injectable, Injected } from '@joist/di/dom';

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
import { defineEnvironment, injectable, Injected } from '@joist/di/dom';

class Config {
  apiUrl = 'http://localhost:4000/api/'
}

defineEnvironment([
  {
    provide: Config,
    use: class {
      apiUrl = 'http://real-api/api/'
    }
  }
]);

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

```TS]
import { injectable, Injected } from '@joist/di/dom';

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
    const { primary } = this.colors();

    this.style.background = primary;
  }
}

customElements.define('color-ctx', ColorCtx);
customElements.define('my-element', ChMyElementild);
```

```HTML
<!-- Default Colors -->
<my-element></my-element>

<!-- Special color ctx -->
<color-ctx>
  <my-element></my-element>
</color-ctx>
```
