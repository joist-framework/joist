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
npm i @joist/element@next
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
  greeting = 'Hello World';

  items = ['first', 'second', 'third', 'fourth', 'fifth'];

  // initialize renderer
  #render = template();

  @ready()
  onReady() {
    // called once element is ready

    this.#render();
  }
}
```

## Styles

To apply styles simply pass the result of the `css` tag to the `shadow` array.

```ts
@element({
  tagName: 'my-element',
  shadow: [
    css`
      h1 {
        color: red;
      }
    `,
    html`<h1>Hello World</h1>`
  ]
})
export class MyElement extends HTMLElement {}
```

## Listeners

The `@listen` decorator allows you to easy setup event listeners. By default the listener will be attached to the shadow root if it exists or the host element if it doesn't. This can be customized by pass a selector function to the decorator

```ts
@element({
  tagName: 'my-element',
  shadow: []
})
export class MyElement extends HTMLElement {
  @listen('eventname')
  onEventName1() {
    // all listener to the shadow root
  }

  @listen('eventname', (host) => host)
  onEventName2() {
    // all listener to the host element
  }

  @listen(
    'eventname',
    (host) => host.querySelector('button')
  )
  onEventName3() {
    // add listener to a button found in the light dom
  }

  @listen('eventname', '#test')
  onEventName4() {
    // add listener to element with the id of "test" that is found in the shadow dom
  }
}
```
