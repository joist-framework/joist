# Joist Templating System

The Joist templating system provides a powerful and flexible way to handle data binding and templating in web components. This documentation covers the core components and their usage.

## Table of Contents

- [Core Components](#core-components)
- [Built-in Template Elements](#built-in-template-elements)
- [Complete Example](#complete-example)
- [Troubleshooting](#troubleshooting)

## Core Components

### Bind Decorator (`bind.ts`)

The `bind` decorator enables reactive data binding for web component properties. It integrates with Joist's observable system to automatically track and propagate changes.

```typescript
import { bind } from "@joist/templating";

class MyElement extends HTMLElement {
  @bind()
  accessor myProperty: string;
}
```

The decorator:

- Creates a one-way binding between component properties and templates
- Automatically handles value propagation through the `joist::value` event
- Integrates with Joist's observable system for efficient change detection
- Supports computed properties

```typescript
class MyElement extends HTMLElement {
  @observe()
  assessor value = "Hello World";

  @bind((instance) => instance.value.toUpperCase())
  accessor formattedValue = "";
}
```

### Token System (`token.ts`)

The `JToken` class handles parsing and evaluation of binding expressions. It supports:

NOTE: Most of the time you will not be using this yourself.

- Simple property bindings: `propertyName`
- Nested property access: `user.profile.name`
- Negation operator: `!isVisible`
- Array access: `items.0.name`

Example usage:

```typescript
const token = new JToken("user.name");
const value = token.readTokenValueFrom(context);

// With negation
const negatedToken = new JToken("!isVisible");
const isHidden = negatedToken.readTokenValueFrom(context);
```

## Built-in Template Elements

Joist provides several built-in template elements for common templating needs:

### Value Display (`j-val`)

Displays a bound value as text content:

```html
<!-- Basic usage -->
<j-val bind="user.name"></j-val>

<!-- With formatting -->
<j-val bind="formattedPrice"></j-val>

<!-- With nested properties -->
<j-val bind="user.profile.address.city"></j-val>

<!-- With array access -->
<j-val bind="items[0].name"></j-val>
```

### Conditional Rendering (`j-if`)

Conditionally renders content based on a boolean expression:

```html
<!-- Basic usage -->
<j-if bind="isVisible">
  <template>
    <div>This content is only shown when isVisible is true</div>
  </template>
</j-if>

<!-- With negation -->
<j-if bind="!isHidden">
  <template>
    <div>This content is shown when isHidden is false</div>
  </template>
</j-if>

<!-- With else template -->
<j-if bind="isLoggedIn">
  <template>
    <div>Welcome back!</div>
  </template>
  <template else>
    <div>Please log in</div>
  </template>
</j-if>
```

The `j-if` element supports:

- Boolean expressions for conditional rendering
- Negation operator (`!`) for inverse conditions
- Optional `else` template for fallback content
- Automatic cleanup of removed content

### Property Binding (`j-bind`)

Binds values to element properties and attributes. By default it will bind values to the first child element of `j-bind`

- `props` Binds to element properties
- `attrs` prefix: Binds to element attributes

#### Binding Syntax

The binding syntax follows the format `target:source` where:

- `target` is the property/attribute name to bind to
- `source` is the value to bind from

```html
<!-- Basic attribute binding -->
<j-bind attrs="href:href">
  <a>Link</a>
</j-bind>

<!-- Property binding -->
<j-bind props="target:some.value">
  <a>Link</a>
</j-bind>

<!-- Multiple bindings -->
<j-bind props="selectionStart:foo, selectionEnd:foo">
  <input value="1234567890" />
</j-bind>

<!-- Style binding -->
<j-bind props="style.color:color, style.backgroundColor:bgColor">
  <div>Styled content</div>
</j-bind>
```

#### Targeting Specific Elements

You can target a specific child element using the `target` attribute:

```html
<j-bind attrs="href:href" target="#test">
  <a>Default</a>
  <a id="test">Target</a>
</j-bind>
```

#### Boolean Attributes

Boolean attributes are handled specially:

- `true` values set the attribute
- `false` values remove the attribute

```html
<j-bind attrs="disabled:isDisabled">
  <button>Click me</button>
</j-bind>
```

### List Rendering (`j-for`)

Renders lists of items with support for keyed updates:

```html
<!-- Basic list rendering -->
<j-for bind="todos" key="id">
  <template>
    <div class="todo-item">
      <j-val bind="each.value.text"></j-val>
    </div>
  </template>
</j-for>

<!-- With complex item structure -->
<j-for bind="users" key="id">
  <template>
    <div class="user-card">
      <j-bind>
        <img props="src:each.value.avatar" />
      </j-bind>

      <h3><j-val bind="each.value.name"></j-val></h3>
      <p><j-val bind="each.value.bio"></j-val></p>
    </div>
  </template>
</j-for>
```

The `j-for` element provides context variables:

- `each.value`: The current item in the iteration
- `each.index`: The zero-based index of the current item
- `each.position`: The one-based position of the current item

### Async State Handling (`j-async`)

Handles asynchronous operations and state management with loading, success, and error states:

```typescript
// AsyncState type
type AsyncState<T = unknown, E = unknown> = {
  status: "loading" | "error" | "success";
  data?: T;
  error?: E;
};
```

Example usage with a Promise:

```typescript
// In your component
@bind()
accessor userPromise = fetch('/api/user').then(r => r.json());
```

```html
<!-- Basic async handling -->
<j-async bind="userPromise">
  <template loading>Loading...</template>

  <template success>
    <div>Welcome, <j-val bind="state.data.name"></j-val>!</div>
  </template>

  <template error>
    <div>Error: <j-val bind="state.error"></j-val></div>
  </template>
</j-async>
```

The `j-async` element supports:

- Promise handling with automatic state transitions
- Loading, success, and error templates
- State object with typed data and error fields

## Troubleshooting

### Common Issues

1. **Binding Not Updating**

   - Check if the property is decorated with `@bind()`
   - Verify the binding expression is correct
   - Ensure the property is being updated correctly

2. **List Rendering Issues**

   - Verify the `key` attribute is unique and stable
   - Check if the list items are properly structured
   - Ensure the binding expression matches the data structure

3. **Async State Problems**
   - Verify the Promise is properly resolved/rejected
   - Check if all required templates are present
   - Ensure error handling is implemented

## Manual Value Handling

You can manually handle value requests and updates by listening for the `joist::value` event. This is useful when you need more control over the binding process or want to implement custom binding logic:

```typescript
class MyElement extends HTMLElement {
  connectedCallback() {
    // Listen for value requests
    this.addEventListener("joist::value", (e) => {
      const token = e.token;

      // Handle the value request
      if (token.bindTo === "myValue") {
        // Update the value
        e.update({
          oldValue: this.myValue,
          newValue: this.myValue,
        });
      }
    });
  }
}
```

## Complete Example

Here's a complete todo application in a single component:

```typescript
import { bind } from "@joist/templating";
import { element, html, css, listen, query } from "@joist/element";

interface Todo {
  id: string;
  text: string;
}

@element({
  tagName: "todo-list",
  shadowDom: [
    css`
      :host {
        display: block;
        max-width: 600px;
        margin: 2rem auto;
      }
      .form {
        display: flex;
        gap: 1rem;
      }
      .todo-item {
        align-items: center;
        display: flex;
        gap: 0.5rem;
        margin: 0.5rem 0;
      }
      .todo-text {
        flex: 1;
      }
    `,
    html`
      <form class="form">
        <input type="text" placeholder="What needs to be done?" />
        <button type="submit">Add</button>
      </form>

      <j-if bind="!todos.length">
        <template>
          <p>No todos yet!</p>
        </template>
      </j-if>

      <j-for id="todos" bind="todos" key="id">
        <template>
          <div class="todo-item">
            <j-val class="todo-text" bind="each.value.text"></j-val>

            <j-bind attrs="data-id:each.value.id">
              <button>×</button>
            </j-bind>
          </div>
        </template>
      </j-for>

      <j-val bind="todos.length"></j-val> remaining
    `,
  ],
})
export class TodoList extends HTMLElement {
  @bind()
  accessor todos: Todo[] = [];

  #nextId = 1;
  #input = query("input");

  @listen("submit", "form")
  onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const input = this.#input();

    this.todos = [...this.todos, { id: String(this.#nextId++), text: input.value.trim() }];

    input.value = "";
  }

  @listen("click", "#todos")
  onDelete(e: Event) {
    if (e.target instanceof HTMLButtonElement) {
      const id = Number(e.target.dataset.id);

      this.todos = this.todos.filter((todo) => todo.id !== id);
    }
  }
}
```
