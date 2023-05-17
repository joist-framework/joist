# Element

Create a shadow root and apply styles and html as defined

#### Installation:

```BASH
npm i @joist/element
```

#### Example:

```TS
import { shadow, css, html, define, listen, attr } from '@joist/element';

export class MyElement extends HTMLElement {
  @tagName static tagName = 'my-element';
  
  @shadow styles = css`
    :host {
      display: block;
      color: red;
    }
  `;

  @shadow template = html`
    <slot></slot>
  `;
  
  @attr accessor value = 0;
  
  @listen('click') onClick() {
    console.log('clicked!')
  }
}
```
