# Di

Dependency Injection in ~800 bytes

#### Installation:

```BASH
npm i @joist/di
```

#### Example:

```TS
import { Injector, inject } from '@joist/di';

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
import { Injector, inject } from '@joist/di';

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

If you have nested injectors and you still want singleton instances decorator your services with `@service()`

```TS
import { service } from '@joist/di';

@service()
class FooService {
  sayHello() {
    return 'Hello From FooService';
  }
}
```

#### Custom Elements

Joist DI was built with custom elements in mind. When you install `@joist/di` you also get the dom library.

```TS
import { JoistDi, get } from '@joist/di/dom';

class MyElement extends JoistDi(HTMlElement) {
  @get(FooService)
  myService!: MyService;
}

customElements.define('my-element', MyElement);
```

#### Hierarchy

The JoistDi mixin is hierarchical, meaing a component will inherit from it's parent if it has one.
For example:

```TS
import { JoistDi, get } from '@joist/di/dom';

class Config {
  name = 'Foo Bar'
}

const CustomRoot = JoistDi(HTMLElement, { 
  providers: [
    { provide: Config, use: class { name = 'Danny Blue' } }
  ] 
});

class Parent extends CustomRoot {}

class Child extends JoistDi(HTMLElement) {
  @get(Config)
  public config!: Config;
}

customElements.define('my-parent', Parent);
customElements.define('my-child', Child);
```

```HTML
<my-child id="child-1"></my-child>

<my-parent>
  <my-child id="child-2"></my-child>
</my-parent>

<script type="module">
  const child1 = document.getElementById("child-1");
  const child2 = document.getElementById("child-2");

  console.log(child1.config.name); // Foo Bar
  console.log(child2.config.name); // Danny Blue
</script>
```
