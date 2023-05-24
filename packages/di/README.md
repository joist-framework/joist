# Di

Dependency Injection in ~800 bytes. This allows you to inject services into other class instances (including custom elements).

#### Installation:

```BASH
npm i @joist/di@next
```

#### Example:

```TS
import { Injector, injectable, inject } from '@joist/di';

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
  #bar = inject(BarService);

  constructor() {
    // will throw error
    console.log(this.bar().sayHello())
  }

  // services cannot be accessed in the constructor.
  // the onInject callback will be called when injectors have resolved
  onInject() {
    console.log(this.bar().sayHello())
  }
}


const app = new Injector();

app.get(BazService);
```

#### Custom Elements:

```TS
import { injectable, inject } from '@joist/di';

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
  #colors = inject(Colors);

  connectedCallback() {
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
