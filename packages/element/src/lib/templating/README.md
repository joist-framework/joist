# Joist Templating System

The Joist templating system provides a powerful and flexible way to handle data binding and templating in web components. This documentation covers the core components and their usage.

## Core Components

### Bind Decorator (`bind.ts`)

The `bind` decorator enables reactive data binding for web component properties. It integrates with Joist's observable system to automatically track and propagate changes.

```typescript
import { bind } from '@joist/element/templating.js';

class MyElement extends HTMLElement {
  @bind()
  myProperty: string;
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
const token = new JToken('user.name');
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

### Property Binding (`j-props`)

Binds values to element properties (rather than attributes). This is particularly useful for boolean properties, form inputs, and other cases where attribute binding isn't sufficient:

```html
<j-props>
  <!-- Bind to boolean properties -->
  <input type="checkbox" $.checked="isComplete">
  
  <!-- Bind to form input values -->
  <input type="text" $.value="userName">
  
  <!-- Bind to custom element properties -->
  <my-element $.data="complexObject">
</j-props>
```

Note the `$.` prefix for property bindings. This distinguishes property bindings from attribute bindings.

Common use cases:
- Form input states (`checked`, `value`, `disabled`)
- Boolean properties that don't work well as attributes
- Complex objects that need to be passed as properties
- Custom element properties

### List Rendering (`j-for`)

Renders lists of items with support for keyed updates:

```html
<j-for bind="todos" key="id">
  <template>
    <j-props>
      <div 
        class="todo-item" 
        $.dataset.id="each.value.id"
        $.dataset.completed="each.value.completed"
      >
        <j-props>
          <input type="checkbox" $.checked="each.value.completed">
        </j-props>

        <j-value bind="each.value.text"></j-value>

        <j-props>
          <button $.disabled="!each.value.text">×</button>
        </j-props>
      </div>
    </j-props>
  </template>
</j-for>
```

The `j-for` element provides context variables:
- `each.value`: The current item
- `each.index`: Zero-based index
- `each.position`: One-based position

### Value Display (`j-value`)

Displays a bound value as text content:

```html
<j-value bind="user.name"></j-value>
<j-value bind="formattedPrice"></j-value>
```

### Async State Handling (`j-async`)

Handles asynchronous operations and state management with loading, success, and error states:

```html
<j-async bind="userPromise">
  <template loading>Loading user data...</template>
  <template success>
    <div>Welcome, <j-value bind="data.name"></j-value>!</div>
  </template>
  <template error>
    <div>Error loading user data: <j-value bind="error"></j-value></div>
  </template>
</j-async>
```

The `j-async` element supports:
- Promise handling with automatic state transitions
- Loading, success, and error templates
- Automatic cleanup on disconnection

Example usage:
```typescript
// In your component
@bind()
accessor userPromise = fetch('/api/user').then(r => r.json());
```

```html
<j-async bind="userPromise">
  <template loading>Loading...</template>
  <template success>
    <div>Welcome, <j-value bind="state.data.name"></j-value>!</div>
  </template>
  <template error>
    <div>Error: <j-value bind="state.error"></j-value></div>
  </template>
</j-async>
```

## Complete Example

Here's a complete todo application in a single component:

```typescript
import { bind } from '@joist/element/templating.js';
import { element, html, css, listen, query } from '@joist/element';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

@element({
  tagName: 'todo-list',
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
      [data-completed="true"] .todo-text {
        text-decoration: line-through;
        opacity: 0.6;
      }
    `,
    html`
      <form class="form">
        <input type="text" placeholder="What needs to be done?">
        <button type="submit">Add</button>
      </form>

      <j-if bind="!todos.length">
        <template>
          <p>No todos yet!</p>
        </template>
      </j-if>

      <j-for id="todos" bind="todos" key="id">
        <template>
          <j-props class="todo-item" $.dataset.completed="each.value.completed">
            <j-props>
              <input type="checkbox" $.id="each.value.id" $.checked="each.value.completed">
              <j-value class="todo-text" bind="each.value.text"></j-value>
              <button $.id="each.value.id" $.disabled="!each.value.text">×</button>
            </j-props>
          </j-props>
        </template>
      </j-for>

      <j-value bind="stats.remaining"></j-value> remaining
    `
  ]
})
export class TodoList extends HTMLElement {
  @bind()
  accessor todos: Todo[] = [];

  @bind()
  accessor stats = {
    remaining: 0,
    completed: 0
  };

  #nextId = 1;
  #input = query('input');

  #updateStats() {
    this.stats = {
      completed: this.todos.filter(todo => todo.completed).length,
      remaining: this.todos.length - this.stats.completed
    };
  }

  @listen('submit', 'form')
  onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const input = this.#input();
    const text = input.value.trim();
    
    if (text) {
      this.todos = [
        ...this.todos,
        { id: this.#nextId++, text, completed: false }
      ];
      
      input.value = '';
      
      this.#updateStats();
    }
  }

  @listen('change', '#todos')
  onToggle(e: Event) {
    if(e.target instanceof HTMLInputElement) {
      const id = Number(e.target.id);
      
      this.todos = this.todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: checkbox.checked };
        }
      
        return todo;
      });
      
      this.#updateStats();
    }
  }

  @listen('click', '#todos')
  onDelete(e: Event) {
    if(e.target instanceof HTMLElement) {
      const id = Number(e.target.id);

      this.todos = this.todos.filter(todo => todo.id !== id);
        
      this.#updateStats();
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