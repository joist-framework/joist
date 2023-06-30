# Element

Create a shadow root and apply styles and html as defined

## NOTE: This lastest version uses the stage-3 decorator proposal. This requires typescript >= 5.0 and many other tools do not yet support this latest syntax.

#### Installation:

```BASH
npm i @joist/element@rc
```

#### Example:

```TS
import { tagName, shadow, css, html, attr, listen } from '@joist/element';

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
