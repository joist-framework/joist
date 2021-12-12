# Control

Makes a custom element behave like a form control.

#### Installation:

```BASH
npm i @joist/control@beta
```

#### Example:

```TS
import { control } from '@joist/control';

@control
class NameInput extends HTMLElement {
  name = "fname"
  value = 'Danny';
}

customElements.define('name-input', NameInput);
```

```HTML
<!-- /submit?fname=Danny -->
<form action="/submit">
  <name-input></name-input>
</form>
```
