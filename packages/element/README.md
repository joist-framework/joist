# Element

Utilities for building web components using modern decorators, with seamless integration with standard HTMLElement APIs, shadow DOM, event listeners, query helpers, property/attribute reflection, and component dependency management.

## Table of Contents

- [Element](#element)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Custom Element](#custom-element)
    - [Dependencies](#dependencies)
  - [Attributes](#attributes)
  - [HTML and CSS](#html-and-css)
  - [Listeners](#listeners)
  - [Query](#query)
  - [QueryAll](#queryall)
  - [Ready Decorator](#ready-decorator)
  - [AttrChanged Decorator](#attrchanged-decorator)

## Installation

```BASH
npm i @joist/element
```

## Custom Element

To define a custom element decorate your custom element class and add a tagName

```ts
@element({
  tagName: "my-element",
})
export class MyElement extends HTMLElement {}
```

### Dependencies

If your custom elements needs to wait to be registered until other elements have been registered.

```ts
@element({
  tagName: "my-element",
  dependsOn: ["element-2", "element-7"],
})
export class MyElement extends HTMLElement {}
```

If there are more complicated needs or if the logic needs to be more dynamic, `dependsOn` can be an async function. The element would be registered when the Promise resolves. Below is an example that would be the equivalent to the previous example.

```ts
@element({
  tagName: "my-element",
  dependsOn() {
    return Promise.all([
      customElements.whenDefined("element-2"),
      customElements.whenDefined("element-7"),
    ]);
  },
})
export class MyElement extends HTMLElement {}
```

## Attributes

Attributes can be managed using the `@attr` decorator. This decorator will read attribute values and write properties back to attributes automatically.

```ts
@element({
  tagName: "my-element",
})
export class MyElement extends HTMLElement {
  @attr()
  accessor greeting = "Hello World";
}
```

## HTML and CSS

HTML templates can be applied by passing the result of the `html` tag to the shadow list.
CSS can be applied by passing the result of the `css` tag to the shadow list.
Any new tagged template literal that returns a `ShadowResult` can be used.

```ts
@element({
  tagName: "my-element",
  shadowDom: [
    css`
      h1 {
        color: red;
      }
    `,
    html`<h1>Hello World</h1>`,
  ],
})
export class MyElement extends HTMLElement {}
```

## Listeners

The `@listen` decorator allows you to easily set up event listeners. By default, the listener will be attached to the shadow root if it exists or the host element if it doesn't. This can be customized by passing a selector function or CSS selector string to the decorator.

```ts
@element({
  tagName: "my-element",
  shadowDom: [],
})
export class MyElement extends HTMLElement {
  @listen("eventname")
  onEventName1() {
    // adds listener to the shadow root
  }

  @listen("eventname", (host) => host)
  onEventName2() {
    // adds listener to the host element
  }

  @listen("eventname", (host) => host.querySelector("button"))
  onEventName3() {
    // adds listener to a button found in the light dom
  }

  @listen("eventname", "#test")
  onEventName4() {
    // adds listener to element with the id of "test" that is found in the shadow dom
  }
}
```

## Query

The `query` function will query for a particular element and allow you to easily patch that element with new properties.

```ts
import { element, query } from "@joist/element";
import { observe, effect } from "@joist/observable";

@element({
  tagName: "my-element",
  shadowDom: [
    html`
      <label for="my-input">
        <slot></slot>
      </label>

      <input id="my-input" />
    `,
  ],
})
export class MyElement extends HTMLElement {
  @observe()
  accessor value: string = "";

  #input = query("input");

  @effect()
  onChange() {
    const input = this.#input({ value: this.value });
  }
}
```

## QueryAll

The `queryAll` function will get all elements that match the given query. A patching function can be passed to update any or all items in the list.

```ts
import { element, queryAll } from "@joist/element";
import { observe, effect } from "@joist/observable";

@element({
  tagName: "my-element",
  shadowDom: [
    html`
      <input id="first" />
      <input id="second" />
    `,
  ],
})
export class MyElement extends HTMLElement {
  @observe()
  accessor value: string = "";

  #inputs = queryAll("input");

  @effect()
  onChange() {
    this.#inputs(() => {
      return { value: this.value };
    });
  }
}
```

## Ready Decorator

The `@ready` decorator allows you to decorate class methods to run as callbacks immediately after the element has been constructed and the shadow DOM (if any) has been initialized and applied.

```ts
import { element, ready } from "@joist/element";

@element({
  tagName: "my-element",
})
export class MyElement extends HTMLElement {
  @ready()
  onElementReady() {
    console.log("Element has been constructed and shadow DOM is initialized!");
  }
}
```

## AttrChanged Decorator

The `@attrChanged` decorator allows you to easily register callback methods that are executed whenever specific observed attributes change. It is called during the custom element's standard `attributeChangedCallback`.

```ts
import { element, attr, attrChanged } from "@joist/element";

@element({
  tagName: "my-element",
})
export class MyElement extends HTMLElement {
  @attr()
  accessor greeting = "Hello World";

  @attrChanged("greeting")
  onGreetingChanged(name: string, oldValue: string, newValue: string) {
    console.log(`Attribute ${name} changed from "${oldValue}" to "${newValue}"`);
  }
}
```
