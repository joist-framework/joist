# Element

Create a shadow root and apply styles and html as defined

#### Installation:

```BASH
npm i @joist/element
```

#### Example:

```TS
import { css, html, attr, listen, element } from '@joist/element';

@element({
  tagName: 'my-element',
  shadow: [
    css`
      :host {
        display: block;
        color: red;
      }
    `,
    html`
      <!--#:value-->
    `
  ]
})
export class MyElement extends HTMLElement {
  @attr()
  accessor value = 0;

  @listen('click')
  onClick() {
    console.log('clicked!')
  }
}
```
