# Query

Allows user to query the light dom or shadow dom (if attached) for

#### Installation:

```BASH
npm i @joist/query
```

```TS
const template = document.createElement('template');
template.innerHTML = `
  <input name="fname" />
`;

class MyElement extends HTMLElement {
  @query('input') input!: HTMLInputElement;

  constructor() {
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.appendChild(template.content.clone(true));
  }
}
```
