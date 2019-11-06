# @lit-kit/component

Create web components using lit-html

Goals

- [x] Small (~7k for todo app)
- [x] uses standards (custom elements and shadow dom)
- [x] component template can ONLY be updated by calling set state. no exceptions
- [x] Uses dependency Injection
- [x] Component and Custom Element are Separate. (You should be able to test component code without creating the custom element)

#### Installation:

```BASH
npm i @lit-kit/component @lit-kit/di lit-html
```

#### Component:

```TS
import { Component, State, ComponentState, Handle } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<number>({
  tag: 'hello-world',
  defaultState: 0,
  template(state, run) {
    return html`
      <button @click=${run('DECREMENT')}>Decrement</button>

      ${state}

      <button @click=${run('INCREMENT')}>Increment</button>
    `
  }
})
class HelloWorldComponent {
  constructor(@State() private state: ComponentState<number>) {}

  @Handle('INCREMENT') onIncrement() {
    this.state.setState(state.value + 1);
  }

  @Handle('DECREMENT') onDecrement() {
    this.state.setState(state.value - 1);
  }
}
```

#### Component Props:

```TS
import { Component, State, ComponentState, Handle, Prop, OnPropChanges } from '@lit-kit/component';
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
class HelloWorldComponent implements OnPropChanges {
  @Prop() title?: string;

  constructor(@State() private state: ComponentState<number>) {}

  onPropChanges() {
    this.state.setState(this.title);
  }
}
```

#### Async State

```TS
import { Component, State, ComponentState, Handle, Prop } from '@lit-kit/component';
import { html } from 'lit-html';

interface ComponentModel {
  loading: boolean;
  data: string[];
}

@Component<ComponentModel>({
  tag: 'app-title',
  defaultState: { loading: false, data: [] },
  template(state, run) {
    ...
  }
})
class HelloWorldComponent implements OnInit {
  constructor(@State() private state: ComponentState<ComponentModel>) {}

  onInit() {
    this.state.setState({ data: [], loading: true });

    const data = fetch('/data').then(res => res.json()).then(data => ({ loading: false, data }));

    this.state.setState(data);
  }
}
```
