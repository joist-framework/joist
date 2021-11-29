# Styled

Apply css to a shadow root. Will apply constructable stylesheets if available and fallback to `<style>` elements if not.

#### Installation:

```BASH
npm i @joist/styled
```

#### Example:

```TS
import { styled } from '@joist/styled';

@styled({
  styled: [
    `:host {
      display: block;
      color: red;
    }`
  ]
})
export class MyElement extends HTMLElement {
  constructor() {
    this.attachShadow({ mode: 'open' });
  }
}
```
