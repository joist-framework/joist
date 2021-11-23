# Di DOM

Dependency Injection for custom elements

#### Installation:

```BASH
npm i @joist/di @joist/di-dom
```

#### Custom Elements

```TS
import { inject } from '@joist/di';
import { injectable } from '@joist/di-dom';

class MyService {}

@injectable()
class MyElement extends HTMLElement {
  constructor(@inject(MyService) public myService: MyService) {}
}

customElements.define('my-element', MyElement);
```
