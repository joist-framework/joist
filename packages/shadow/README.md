# Styled

Create a shadow root and apply styles and html as defined

#### Installation:

```BASH
npm i @joist/shadow
```

#### Example:

```TS
import { shadow, css, html} from '@joist/shadow';

@shadow
export class MyElement extends HTMLElement {
  static styles = css`
    :host {
      display: block;
      color: red;
    }
  `;

  static template = html`
    <slot></slot>
  `
}
```
