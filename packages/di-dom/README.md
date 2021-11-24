# Di DOM

Dependency Injection for custom elements.

The `@injectable()` decorator allows the Joist Dependency Injector to pass arguments to your custom element.

#### Installation:

```BASH
npm i @joist/di @joist/di-dom
```

#### Inject provider into your custom element constructor

```TS
import { inject, service } from '@joist/di';
import { injectable } from '@joist/di-dom';

@service()
class MyService {}

@injectable()
class MyElement extends HTMLElement {
  constructor(@inject(MyService) public myService: MyService) {}
}

customElements.define('my-element', MyElement);
```

#### Define providers and overrides

This allows your to override services for different environments or scenarios

```TS
import { defineEnvironment, injectable } from '@joist/di-dom';

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

@injectable()
class MyElement extends HTMLElement {
  constructor(@inject(Config) config: Config) {
    console.log(config.apiUrl); // http://real-api/api/
  }
}

customElements.define('my-element', MyElement);
```
