# Element

Create a shadow root and apply styles and html as defined

#### Installation:

```BASH
npm i @joist/element@next
```

#### Example:

```TS
import { shadow, css, html, define, listen, attr } from '@joist/element';

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
