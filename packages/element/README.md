# Element

Utilities for building web compnennts. Especially targeted at

## Table of Contents

- [Installation](#installation)
- [Custom Element](#custom-element)
- [Attributes](#attributes)
- [Template](#template)
- [Styles](#styles)
- [Listeners](#listeners)
- [Queries](#queries)

## Installation

```BASH
npm i @joist/element
```

## Custom Element

To define a custom element decorate your custom element class and add a tagName

```ts
@element({
  tagName: 'my-element'
})
export class MyElement extends HTMLElement {}
```

## Attributes

Attributes can be managed using the `@attr` decorator. This decorator will read attribute values and and write properties back to attributes;

```ts
@element({
  tagName: 'my-element'
})
export class MyElement extends HTMLElement {
  @attr()
  accessor greeting = 'Hello World';
}
```

## Template

Joist ships with a very simple template library. It is designed to be very small and is only responsible for updating text in different DOM nodes.

```ts
@element({
  tagName: 'my-element',
  shadow: [
    html`
      <h1 #:bind="greeting" #:hidden="!greeting"></h1>

      <ul">
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
  accessor greeting = 'Hello World';

  items = ['first', 'second', 'third', 'fourth', 'fifth'];
}
```
