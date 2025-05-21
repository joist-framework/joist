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
  accessor myProperty = "";
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

  @bind({
    compute: (i) => i.value.toUpperCase()
  })
  accessor formattedValue = "";
}
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
<j-val bind="items.0.name"></j-val>
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

<!-- With comparison operators -->
<j-if bind="status == active">
  <template>
    <div>Status is active</div>
  </template>
</j-if>

<j-if bind="count > 5">
  <template>
    <div>Count is greater than 5</div>
  </template>
</j-if>

<j-if bind="score < 100">
  <template>
    <div>Score is less than 100</div>
  </template>
</j-if>

<!-- With nested paths -->
<j-if bind="user.score > 100">
  <template>
    <div>User's score is above 100</div>
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
- Comparison operators:
  - Equality (`==`): `status == active`
  - Greater than (`>`): `count > 5`
  - Less than (`<`): `score < 100`
- Nested property paths: `user.score > 100`
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
