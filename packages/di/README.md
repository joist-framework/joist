# Di

Dependency Injection in ~800 bytes.

Allows you to inject services into other class instances (including custom elements and node).

#### Installation:

```BASH
npm i @joist/di@rc
```

#### Example:

Classes that are decoratored with `@injectable` can use the `inject()` function to inject a class instance.

Different implementations can be provided for services.

```TS
import { Injector, injectable, inject } from '@joist/di';

class Engine {
  type: 'gas' | 'electric' = 'gas';

  accelerate() {
    return 'vroom';
  }
}

class Tires {
  size = 16;
}

@injectable
class Car {
  engine = inject(Engine);
  tires = inject(Tires);

  accelerate() {
    // the inject function returns a function
    // this means that services are not initalized until they are called
    return this.engine().accelerate();
  }
}

const app1 = new Injector();
const car1 = app1.get(Car);

// vroom, 16
console.log(car.accelerate(), car.tires().size);

const app2 = new Injector([
  {
    provide: Engine,
    use: class extends Engine {
      type = 'electric';

      accelerate() {
        return 'hmmmmmmmm';
      }
    }
  },
  {
    provide: Tires,
    use: class extends Tires {
      size = 20;
    }
  }
]);

const car2 = app2.get(Car);

//hmmmmmmmm, 20
console.log(car.accelerate(), car.tires().size);
```

#### Custom Elements:

Joist is built to work with custom elements. Since the document is a tree we can search up that tree for providers.

```TS
import { injectable, inject } from '@joist/di';

class Colors {
  primary = 'red';
  secodnary = 'green';
}

@injectable
class ColorCtx extends HTMLElement {
  // services can be scoped to a particular injectable
  static providers = [
    {
      provide: Colors,
      use: class implements Colors {
        primary = 'orange';
        secondary = 'purple';
      },
    },
  ]
}

@injectable
class MyElement extends HTMLElement {
  #colors = inject(Colors);

  connectedCallback() {
    const { primary } = this.#colors();

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

#### No decorators no problem:

While this library is built with decorators in mind it is designed so that it can be used without them.

```TS
import { Injector, injectable, inject } from '@joist/di';

class Engine {
  type: 'gas' | 'electric' = 'gas';
}

class Tires {
  size = 16;
}

const Car = injectable(
  class {
    engine = inject(Engine);
    tires = inject(Tires);
  }
);

const app = new Injector();
const car = app.get(Car);

// gas, 16
console.log(car.engine(), car.tires());
```
