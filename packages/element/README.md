# Element

Create a shadow root and apply styles and html as defined

#### Installation:

```BASH
npm i @joist/element
```

#### Example:

```TS
import { styles, template, css, html, define, listen, attr } from '@joist/element';

export class MyElement extends HTMLElement {
  @define static tagName = 'my-element';
  
  @styles styles = css`
    :host {
      display: block;
      color: red;
    }
  `;

  @template template = html`
    <slot></slot>
  `;
  
  @attr value = 0;
  
  @listen('click') onClick() {
    console.log('clicked!')
  }
}
```
