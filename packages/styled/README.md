# Styledm (deprecated)

Please note this package is deprecated. use `@joist/shadowed` instead.

Apply css to a shadow root. Will apply constructable stylesheets if available and fallback to `<style>` elements if not.

#### Installation:

```BASH
npm i @joist/styled
```

#### Example:

```TS
import { styled, css } from '@joist/styled';

@styled
export class MyElement extends HTMLElement {
  static styles = [
    css`
      :host {
        display: block;
        color: red;
      }
    `
  ]
  constructor() {
    this.attachShadow({ mode: 'open' });
  }
}
```
