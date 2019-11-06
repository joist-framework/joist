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

```TS
import { Component, State, CompState, Handle } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<number>({
  tag: 'app-counter',
  defaultState: 0,
  template(state, run) {
    return html`
      <button @click=${run('DECREMENT')}>Decrement</button>

      ${state}

      <button @click=${run('INCREMENT')}>Increment</button>
    `
  }
})
class CounterComponent {
  constructor(@State() private state: CompState<number>) {}

  @Handle('INCREMENT') onIncrement() {
    this.state.setState(state.value + 1);
  }

  @Handle('DECREMENT') onDecrement() {
    this.state.setState(state.value - 1);
  }
}
```

### Component Props

```TS
import { Component, State, CompState, Prop, OnPropChanges } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<string>({
  tag: 'app-title',
  defaultState: '',
  template(state, run) {
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

### Component Styles

```TS
import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

@Component({
  tag: 'app-root',
  defaultState: null,
  style: html`
    <style>
      h1 {
        font-weight: thin;
      }
    </style>
  `
  template(state, run) {
    ...
  }
})
class AppComponent { }
```
