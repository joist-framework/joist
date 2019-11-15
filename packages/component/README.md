# @lit-kit/component

Create web components using [lit-html](https://lit-html.polymer-project.org/)

Goals

- [x] ~5kb Hello World ~6kb Todo App
- [x] component template can ONLY be updated by updating state. no exceptions
- [x] Component and Custom Element are Separate. (You should be able to test component code without creating the custom element)

### Installation

```BASH
npm i @lit-kit/component @lit-kit/di lit-html
```

### Bootstrap Application

If you plan on using lit-kit to create an application you will probably want to use services. To make sure you have singletons you need to bootstrap.

```TS
import { bootstrapApplication } from '@lit-kit/component';

bootstrapApplication()
```

### Bootstrap Shady Application

If you need to support older browsers (IE11) you will need to use the web components polyfills and enable shady css rendering.

```TS
import { bootstrapApplication, Renderer } from '@lit-kit/component';
import { ShadyRenderer } from '@lit-kit/component/lib/shady-renderer';

bootstrapApplication([
  { provide: Renderer, useClass: ShadyRenderer }
]);
```

### Component

Components are created via the "Component" decorator and a custom element is defined.

```TS
import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<string>({
  tag: 'app-root',
  defaultState: 'Hello World',
  template(state) {
    return html`<h1>${state}</h1>`
  }
})
class AppComponent {}
```

### Component Styles

Styles are provided via a "style" property and do not have access to the component state

```TS
import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<string>({
  tag: 'app-root',
  defaultState: 'Hello World',
  style: html`
    <style>
      h1 {
        font-weight: thin;
      }
    </style>
  `,
  template(state) {
    return html`<h1>${state}</h1>`
  }
})
class AppComponent {}
```

### Component State

A component template can ONLY be updated by updating the component's state.
A component's state can be accessed and updated via it's `State` instance which is available via `@StateRef()`

```TS
import { Component, StateRef, State, OnInit } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<number>({
  tag: 'app-root',
  defaultState: 0,
  template(state) {
    return html`<h1>${state}</h1>`
  }
})
class AppComponent implements OnInit {
  constructor(@StateRef() private state: State<number>) {}

  onInit() {
    setInterval(() => {
      this.state.setValue(this.state.value + 1);
    }, 1000);
  }
}
```

### Component Props

Component props are defined via the `@Prop()` decorator. This creates a property that is available via the custom element.
Prop changes to not trigger template updates. Use custom setters or `onPropChanges` to set new state and update the template.

```TS
import { Component, StateRef, State, Prop, OnPropChanges } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<string>({
  tag: 'app-title',
  defaultState: '',
  template(state) {
    return html`<h1>${state}</h1>`
  }
})
class AppTitleComponent implements OnPropChanges {
  @Prop() title?: string;

  constructor(@StateRef() private state: State<string>) {}

  onPropChanges() {
    this.state.setValue(this.title);
  }
}
```

### Component Handlers

In order to trigger methods in a component you can use the `run` function that is provided the the template function.
Decorate component methods with `@Handle('NAME')` to handle whatever is run.

```TS
import { Component, StateRef, State, Handle } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<number>({
  tag: 'app-root',
  defaultState: 0,
  template(state, run) {
    return html`
      <button @click=${run('DECREMENT')}>Decrement</button>

      ${state}

      <button @click=${run('INCREMENT')}>Increment</button>
    `
  }
})
class AppComponent {
  constructor(@StateRef() private state: State<number>) {}

  @Handle('INCREMENT') onIncrement(_: Event) {
    this.state.setValue(this.state.value + 1);
  }

  @Handle('DECREMENT') onDecrement(_: Event) {
    this.state.setValue(this.state.value - 1);
  }
}
```

### Dispatching Events

To emit custom events from a component you will need to access the acutal custom element instance.
This can be accessed via the `@ElRef()` decorator.

```TS
import { Component, StateRef, State, Handle, ElRef } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<number>({
  tag: 'app-root',
  defaultState: 0,
  template(state, run) {
    return html`
      <button @click=${run('DECREMENT')}>Decrement</button>

      ${state}

      <button @click=${run('INCREMENT')}>Increment</button>
    `
  }
})
class AppComponent {
  constructor(
    @StateRef() private state: State<number>,
    @ElRef() private elRef: HTMLElement
  ) {}

  @Handle('INCREMENT') onIncrement() {
    this.state.setValue(this.state.value + 1);

    this.elRef.dispatchEvent(new CustomEvent('count_changed', { detail: this.state.value }));
  }

  @Handle('DECREMENT') onDecrement() {
    this.state.setValue(this.state.value - 1);

    this.elRef.dispatchEvent(new CustomEvent('count_changed', { detail: this.state.value }));
  }
}
```

### Async State

Component state can be set asynchronously.

```TS
import { Component, StateRef, State } from '@lit-kit/component';
import { html } from 'lit-html';

interface AppState {
  loading: boolean;
  data: string[];
}

@Component<AppState>({
  tag: 'app-root',
  defaultState: { loading: false, data: [] },
  template(state) { ... }
})
class AppComponent implements OnInit {
  constructor(@StateRef() private state: State<AppState>) {}

  onInit() {
    this.state.setValue({ data: [], loading: true });

    const data = fetch('/data').then(res => res.json()).then(data => ({ loading: false, data }));

    this.state.setValue(data);
  }
}
```
