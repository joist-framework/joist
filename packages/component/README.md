# @lit-kit/component

Create web components using lit-html

Goals

- [x] Small (~7k for small application)
- [x] uses standards (custom elements and shadow dom)
- [x] component template can ONLY be updated by calling set state. no exceptions
- [x] Uses dependency Injection
- [x] Component and Custom Element are Separate. (You should be able to test component code without creating the custom element)

### Installation

```BASH
npm i @lit-kit/component @lit-kit/di lit-html
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
    return html`
      <h1>${state}</h1>
    `
  }
})
class AppComponent { }
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
    <h1>${state}</h1>
  }
})
class AppComponent { }
```

### Component State

A component template can ONLY be updated by updating the component's state.
A component's state can be accessed and updated via it's `ComState` instance which is available via `@State()` 

```TS
import { Component, State, CompState, OnInit } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<number>({
  tag: 'app-root',
  defaultState: 0,
  template(state) {
    return html`
      <h1>${state}</h1>
    `
  }
})
class AppComponent implements OnInit {
  constructor(@State() private state: CompState<number>) {}

  onInit() {
    setInterval(() => {
      this.state.setState(this.state.value + 1);
    }, 1000);
  }
}
```

### Component Props

Component props are defined via the `@Prop()` decorator. This creates a property that is available via the custom element.
Prop changes to not trigger template updates. Use custom setters or `onPropChanges` to set new state and update the template.

```TS
import { Component, State, CompState, Prop, OnPropChanges } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<string>({
  tag: 'app-title',
  defaultState: '',
  template(state) {
    return html`
      <h1>${state}</h1>
    `
  }
})
class AppTitleComponent implements OnPropChanges {
  @Prop() title?: string;

  constructor(@State() private state: CompState<number>) {}

  onPropChanges() {
    this.state.setState(this.title);
  }
}
```

### Async State

Component state can be set asynchronously.

```TS
import { Component, State, CompState } from '@lit-kit/component';
import { html } from 'lit-html';

interface ComponentModel {
  loading: boolean;
  data: string[];
}

@Component<ComponentModel>({
  tag: 'app-root',
  defaultState: { loading: false, data: [] },
  template(state, run) {
    ...
  }
})
class AppComponent implements OnInit {
  constructor(@State() private state: CompState<ComponentModel>) {}

  onInit() {
    this.state.setState({ data: [], loading: true });

    const data = fetch('/data').then(res => res.json()).then(data => ({ loading: false, data }));

    this.state.setState(data);
  }
}
```


