# Styled

Create a shadow root and apply styles and html as defined

#### Installation:

```BASH
npm i @joist/shadowed
```

#### Example:

```TS
import { shadowed, css, html} from '@joist/shadowed';

@shadowed
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
