# Element

Utilities for building web compnennts. Especially targeted at

## Table of Contents

- [Installation](#installation)
- [Custom Element](#custom-element)
- [Attributes](#attributes)
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

## HTML and CSS

HTML templates can be applied by passing the result of the `html` tag to the shaodw list.
CSS can be applied by passing the result of the `css` tag to the shadow list. 
Any new tagged template literal that returns a `ShadowResult` can be used.

```ts
@element({
  tagName: 'my-element',
  shadowDom: [
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
  shadowDom: []
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

  @listen('eventname', (host) => host.querySelector('button'))
  onEventName3() {
    // add listener to a button found in the light dom
  }

  @listen('eventname', '#test')
  onEventName4() {
    // add listener to element with the id of "test" that is found in the shadow dom
  }
}
```

## Query

The `query` function will query for a particular element and allow you to easily patch that element with new properties.

```ts
@element({
  tagName: 'my-element',
  shadowDom: [
    html`
      <label for="my-input">
        <slot></slot>
      </label>

      <input id="my-input" />
    `
  ]
})
export class MyElement extends HTMLElement {
  @observe()
  accessor value: string;

  #input = query('input');

  @effect()
  onChange() {
    const input = this.#input({ value: this.value});
  }
}
```

## QueryAll

The `queryAll` function will get all elements that match the given query. A patching function can be passed to update any or all items in the list

```ts
@element({
  tagName: 'my-element',
  shadowDom: [
    html`
      <input id="first" />
      <input id="second" />
    `
  ]
})
export class MyElement extends HTMLElement {
  @observe()
  accessor value: string;

  #inputs = queryAll('input');

  @effect()
  onChange() {
    this.#input(() => {
      return { value: this.value }
    })
  }
}
```
