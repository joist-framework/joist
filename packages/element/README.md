# Element

Create a shadow root and apply styles and html as defined

#### Installation:

```BASH
npm i @joist/element
```

## Example:

```TS
import { tagName, shadow, css, html, attr, listen, element } from '@joist/element';

@element
export class MyElement extends HTMLElement {
  // define a custom element
  @tagName static tagName = 'my-element';

  // apply styles to shadow dom
  @shadow styles = css`
    :host {
      display: block;
      color: red;
    }
  `;

  // apply html to shadow dom
  @shadow template = html`
    <slot></slot>
  `;

  // define attributes
  @attr accessor value = 0;

  // listen for events
  @listen('click') onClick() {
    console.log('clicked!')
  }
}
```

## Dependency Injection:

Joist dependency injejection is built to work with custom elements. Any custom element class that is decorated with `@element` will be allowed to use the `inject()` function.

```TS
import { element } from "@joist/element";
import { injectable, inject } from '@joist/di';

class Colors {
  primary = 'red';
  secodnary = 'green';
}

@element
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

@element
class MyElement extends HTMLElement {
  #colors = inject(Colors);

  connectedCallback() {
    const { primary } = this.#colors();

    this.style.background = primary;
  }
}

// Note: To use parent providers, the parent elements need to be defined first in correct order!
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

## Environment

When using @joist/di with custom elements a default root injector is created dubbed 'environment'. This is the injector that all other injectors will eventually stop at.
If you need to define something in this environment you can do so with the `defineEnvironment` method.

```ts
import { defineEnvironment } from '@joist/di';

defineEnvironment([{ provide: MyService, use: SomeOtherService }]);
```
