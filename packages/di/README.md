# Di

Dependency Injection in ~800 bytes

#### Installation:

```BASH
npm i @ts-kit/di
```

#### Example:

```TS
import { Injector, Inject } from '@ts-kit/di';

// Write a plain ol JS class
class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

// Declare that class as a static dependency of another class
class BarService {
  // an instance of that class will be passed to this one;
  constructor(
    @Inject(FooService) private foo: FooService
  ) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo.sayHello();
  }
}

// create a new instance of our injector
const app = new Injector();

// Use that injector to create new instances of objects
app.get(BarService).sayHello(); // Hello from BarService and Hello from FooService
```

#### Override A Service:

```TS
import { Injector, Inject } from '@ts-kit/di';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  constructor(
    @Inject(FooService) private foo: FooService
  ) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo.sayHello();
  }
}

// Override FooService with an alternate implementation
const app = new Injector({
  providers: [
    { provide: FooService, useFactory: () => ({sayHello: () => 'IT HAS BEEN OVERRIDEN' } as FooService) }
  ]
});

app.get(BarService).sayHello(); // Hello from BarService and IT HAS BEEN OVERRIDEN
```

#### Inject services with custom decorators:

```TS
import { Injector, Inject } from '@ts-kit/di';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

const Foo = () => (c: any, k: string, i: number) => Inject(FooService)(c, k, i);

class BarService {
  // Use custom decorator to provide FooService
  constructor(
    @Foo() private foo: FooService
  ) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo.sayHello();
  }
}

// create a new instance of our injector
const app = new Injector();

app.get(BarService).sayHello(); // Hello from BarService and Hello from FooService
```
