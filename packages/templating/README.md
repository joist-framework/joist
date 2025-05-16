# Joist Templating System

The Joist templating system provides a powerful and flexible way to handle data binding and templating in web components. This documentation covers the core components and their usage.

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

- Creates a two-way binding between component properties and templates
- Automatically handles value propagation through the `joist::value` event
- Integrates with Joist's observable system for efficient change detection

### Token System (`token.ts`)

The `JToken` class handles parsing and evaluation of binding expressions. It supports:

- Simple property bindings: `propertyName`
- Nested property access: `user.profile.name`
- Negation operator: `!isVisible`

Example usage:

```typescript
const token = new JToken("user.name");
const value = token.readTokenValueFrom(context);
```

### Events (`events.ts`)

The system uses custom events for value propagation:

- `JoistValueEvent`: A custom event that handles value updates in the templating system
- Bubbles through the DOM tree
- Carries both the token and update mechanism

## Built-in Template Elements

Joist provides several built-in template elements for common templating needs:

### Conditional Rendering (`j-if`)

Conditionally renders content based on a boolean expression:

```html
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

Common use cases:

- Toggling visibility of UI elements
- Conditional form fields
- Feature flags
- Authentication states
- Loading states

### Property Binding (`j-bind`)

Binds values to element properties and attributes. The prefix determines the binding type:

- `$bind.` prefix: Binds to element properties
- `$bind` prefix: Binds to element attributes

#### Binding Syntax

The binding syntax follows the format `target:source` where:

- `target` is the property/attribute name to bind to
- `source` is the value to bind from

```html
<!-- Bind href attribute to href value -->
<j-bind $bind="href:href">
  <a>Link</a>
</j-bind>

<!-- Bind target property to nested value -->
<j-bind $.bind="target:some.value">
  <a>Link</a>
</j-bind>

<!-- Multiple bindings -->
<j-bind $.bind="selectionStart:foo, selectionEnd:foo">
  <input value="1234567890" />
</j-bind>
```

#### Targeting Specific Elements

You can target a specific child element using the `target` attribute:

```html
<j-bind $bind="href:href" target="#test">
  <a>Default</a>
  <a id="test">Target</a>
</j-bind>
```

#### Boolean Attributes

Boolean attributes are handled specially:

- `true` values set the attribute
- `false` values remove the attribute

```html
<j-bind $bind="disabled:isDisabled">
  <button>Click me</button>
</j-bind>
```

#### Nested Property Access

You can access nested properties using dot notation:

```html
<j-bind $.bind="target:target.value">
  <a>Link</a>
</j-bind>
```

### List Rendering (`j-for`)

Renders lists of items with support for keyed updates:

```html
<j-for bind="todos" key="id">
  <template>
    <j-bind>
      <div
        class="todo-item"
        $.dataset.id="each.value.id"
        $.dataset.completed="each.value.completed"
      >
        <j-bind>
          <input type="checkbox" $.checked="each.value.completed" />
        </j-bind>

        <j-val bind="each.value.text"></j-val>

        <j-bind>
          <button $.disabled="!each.value.text">×</button>
        </j-bind>
      </div>
    </j-bind>
  </template>
</j-for>
```

The `j-for` element provides context variables:

- `each.value`: The current item in the iteration
- `each.index`: The zero-based index of the current item
- `each.position`: The one-based position of the current item

### Value Display (`j-val`)

Displays a bound value as text content:

```html
<j-val bind="user.name"></j-val> <j-val bind="formattedPrice"></j-val>
```

### Async State Handling (`j-async`)

Handles asynchronous operations and state management with loading, success, and error states. The element accepts either a Promise or an AsyncState object:

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
- Automatic cleanup on disconnection
- State object with typed data and error fields

## Complete Example

Here's a complete todo application in a single component:

```typescript
import { bind } from "@joist/templating";
import { element, html, css, listen, query } from "@joist/element";

interface Todo {
  id: number;
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
          <j-bind class="todo-item">
            <j-val class="todo-text" bind="each.value.text"></j-val>
            <button $.id="each.value.id" $.disabled="!each.value.text">×</button>
          </j-bind>
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

    this.todos = [...this.todos, { id: this.#nextId++, text: input.value.trim() }];

    input.value = "";
  }

  @listen("click", "#todos")
  onDelete(e: Event) {
    if (e.target instanceof HTMLButtonElement) {
      const id = Number(e.target.id);

      this.todos = this.todos.filter((todo) => todo.id !== id);
    }
  }
}
```

## Usage

1. Use the `@bind()` decorator on properties you want to make bindable
2. Properties will automatically integrate with the templating system
3. Changes are propagated through the component tree using the custom event system

## Integration with Observable

The templating system is built on top of Joist's observable system (`@joist/observable`), providing:

- Automatic change detection
- Efficient updates
- Integration with the component lifecycle

## Best Practices

1. Use the `@bind()` decorator only on properties that need reactivity
2. Keep binding expressions simple and avoid deep nesting
3. Consider performance implications when binding to frequently changing values
4. Always use a `key` attribute with `j-for` when items can be reordered
5. Place template content directly inside `j-if` and `j-for` elements

## Manual Value Handling

You can manually handle value requests and updates by listening for the `joist::value` event. This is useful when you need more control over the binding process or want to implement custom binding logic:

```typescript
import { JoistValueEvent } from "@joist/templating";

class MyElement extends HTMLElement {
  connectedCallback() {
    // Listen for value requests
    this.addEventListener("joist::value", (e: JoistValueEvent) => {
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

Example with async value handling:

```typescript
import { JoistValueEvent } from "@joist/templating";

class MyElement extends HTMLElement {
  connectedCallback() {
    this.addEventListener("joist::value", (e: JoistValueEvent) => {
      const token = e.token;

      if (token.bindTo === "userData") {
        e.update({
          oldValue: this.userData,
          newValue: data,
        });
      }
    });
  }
}
```

Common use cases for manual value handling:

- Custom data transformation before binding
- Async data loading and caching
- Complex state management
- Integration with external data sources
- Custom validation or error handling
