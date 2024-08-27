# Element

Create a shadow root and apply styles and html as defined

#### Installation:

```BASH
npm i @joist/element
```

#### Example:

```TS
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
      <h1 #:bind="greeting" #:hidden="!greeting"></h1>

      <ul>
        <li #:bind="items.0"></li>
        <li #:bind="items.1"></li>
        <li #:bind="items.2"></li>
        <li #:bind="items.3"></li>
        <li #:bind="items.4"></li>
      </ul>
    `
  ]
})
export class MyElement extends HTMLElement {
  @attr()
  accessor greeting = "Hello World";

  items = ["first", "second", "third", "fourth", "fifth"];

  #render = template();

  @ready()
  onReady() {
    this.#render();
  }
}
```
