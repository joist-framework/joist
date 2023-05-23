# Di

Dependency Injection in ~800 bytes. This allows you to inject services into other class instances (including custom elements).

#### Installation:

```BASH
npm i @joist/di
```

#### Example:

```TS
import { Injector, Inject, injectable, inject } from '@joist/di';

// Any class can be injected
class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

// classes must be decorated with @injectable to use the inject function
@injectable
class BarService {
  foo = inject(FooService);

  sayHello() {
    return this.foo().sayHello();
  }
}

@injectable
class BazService {
  // to access services in the constructor you need to use the provided inject function
  constructor(inject: Inject) {
    const bar = inject(BarService)();

    console.log(bar.sayHello())
  }
}


const app = new Injector();

app.get(BarService).sayHello(); // Hello from BarService and Hello from FooService
```
