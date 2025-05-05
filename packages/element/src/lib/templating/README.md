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
```

### List Rendering (`j-for`)

Renders lists of items with support for keyed updates:

```html
<j-for bind="items" key="id">
  <template>
    <j-value bind="each.value.name"></j-value>
    Position: <j-value bind="each.position"></j-value>
    Index: <j-value bind="each.index"></j-value>
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
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-radius: 8px;
      }
      h2 {
        margin-top: 0;
        color: #333;
      }
      .form {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      input[type="text"] {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .add-btn {
        padding: 0.5rem 1rem;
        background: #0066ff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .add-btn:hover {
        background: #0052cc;
      }
      .todo-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
      }
      .todo-item.completed .todo-text {
        color: #888;
        text-decoration: line-through;
      }
      .todo-text {
        flex: 1;
      }
      .delete-btn {
        padding: 0.25rem 0.5rem;
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .todo-item:hover .delete-btn {
        opacity: 1;
      }
      .delete-btn:hover {
        background: #cc0000;
      }
      .stats {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0;
        color: #666;
        font-size: 0.9rem;
      }
    `,
    html`
      <h2>Todo List</h2>
      
      <form class="form">
        <input type="text" placeholder="What needs to be done?">
        <button type="submit" class="add-btn">Add Todo</button>
      </form>
      
      <j-if bind="!todos.length">
        <template>
          <p>No todos yet! Add one above.</p>
        </template>
      </j-if>

      <j-for bind="todos" key="id">
        <template>
          <div class="todo-item" data-id="each.value.id">
            <j-props>
              <input 
                type="checkbox" 
                $.checked="each.value.completed"
              >
            </j-props>

            <j-value class="todo-text" bind="each.value.text"></j-value>

            <button class="delete-btn">×</button>
          </div>
        </template>
      </j-for>

      <j-if bind="todos.length">
        <template>
          <div class="stats">
            <span>
              <j-value bind="stats.remaining"></j-value> items left
            </span>
            <span>
              <j-value bind="stats.completed"></j-value> completed
            </span>
          </div>
        </template>
      </j-if>
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
    const text = this.#input().value.trim();
    
    if (text) {
      this.todos = [
        ...this.todos,
        { id: this.#nextId++, text, completed: false }
      ];
      this.#input().value = '';
      this.#updateStats();
    }
  }

  @listen('change', 'input[type="checkbox"]')
  onToggle(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const todoItem = checkbox.closest('.todo-item') as HTMLElement;
    const id = Number(todoItem.dataset.id);

    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: checkbox.checked
        };
      }

      return todo;
    });
    
    this.#updateStats();
  }

  @listen('click', '.delete-btn')
  onDelete(e: Event) {
    const button = e.target as HTMLButtonElement;
    const todoItem = button.closest('.todo-item') as HTMLElement;
    const id = Number(todoItem.dataset.id);

    this.todos = this.todos.filter(todo => todo.id !== id);
    
    this.#updateStats();
  }
}
```

Usage in HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Joist Todo App</title>
</head>
<body>
  <todo-list></todo-list>
  <script type="module" src="./todo.ts"></script>
</body>
</html>
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
