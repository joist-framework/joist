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

`@injectable` is on required when you will not be able to manually create instances via an injector.

#### Inject dependency into your custom element constructor

```TS
import { inject, service, injectable } from '@joist/di';

@service
class MyService {}

@injectable
class MyElement extends HTMLElement {
  static inject = [MyService];

  constructor(public myService: MyService) {}
}

customElements.define('my-element', MyElement);
```

#### Define providers and overrides

This allows your to override services for different environments or scenarios

```TS
import { defineEnvironment, injectable } from '@joist/di';

class Config {
  apiUrl = 'http://localhost:4000/api/'
}

defineEnvironment([
  {
    provide: Config,
    use: class extends Config {
      apiUrl = 'http://real-api/api/'
    }
  }
]);

@injectable
class MyElement extends HTMLElement {
  static inject = [Config];

  constructor(config: Config) {
    console.log(config.apiUrl); // http://real-api/api/
  }
}

customElements.define('my-element', MyElement);
```
