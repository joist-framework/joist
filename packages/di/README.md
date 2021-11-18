# Di

Dependency Injection in ~800 bytes. Can be used with and without decorators.

#### Installation:

```BASH
npm i @joist/di
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
  static deps = [FooService];

  constructor(private foo: FooService) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo.sayHello();
  }
}

const app = new Injector();

app.get(BarService).sayHello(); // Hello from BarService and Hello from FooService
```

```TS
import { Injector } from '@joist/di';
import { inject } from '@joist/di/decorators';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  constructor(@inject(FooService) private foo: FooService) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo.sayHello();
  }
}

const app = new Injector();

app.get(BarService).sayHello(); // Hello from BarService and Hello from FooService
```

#### Override A Service:

```TS
import { Injector } from '@joist/di';
import { inject } from '@joist/di/decorators';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  constructor(@inject(FooService) private foo: FooService) {}

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

If you have nested injectors and you still want singleton instances mark your service as shown or decorate with `@service()`

```TS
class FooService {
  static providedInRoot = true;

  sayHello() {
    return 'Hello From FooService';
  }
}
```

```TS
import { service } from '@joist/di/decorators';

@service()
class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}
```
