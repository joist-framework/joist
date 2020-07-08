# Di

Dependency Injection in ~800 bytes

#### Installation:

```BASH
npm i @joist/di
```

#### Example:

```TS
import { Injector, Inject } from '@joist/di';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  constructor(@Inject(FooService) private foo: FooService) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo.sayHello();
  }
}

const app = new Injector();

app.get(BarService).sayHello(); // Hello from BarService and Hello from FooService
```

#### Override A Service:

```TS
import { Injector, Inject } from '@joist/di';

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  constructor(@Inject(FooService) private foo: FooService) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo.sayHello();
  }
}

// Override FooService with an alternate implementation
const app = new Injector({
  providers: [
    {
      provide: FooService,
      useClass: class extends FooService {
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

If you have nested injectors and you still want singleton instances decorator your services with `@Service()`

```TS
import { Service } from '@joist/di';

@Service()
class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}
```

#### Inject services with custom decorators:

```TS
import { Injector, Inject } from '@joist/di';

const FooRef = Inject(FooService);

class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}

class BarService {
  constructor(@FooRef private foo: FooService) {}

  sayHello() {
    return 'Hello From BarService and ' + this.foo.sayHello();
  }
}

// create a new instance of our injector
const app = new Injector();

app.get(BarService).sayHello(); // Hello from BarService and Hello from FooService
```
