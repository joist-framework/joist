# @joist/component

Broadly speaking a "joist" component acts as the state manager for your custom element meaing that it controls the data and the view. The examples in this doc will be using lit-html but any view library can be used.

### Installation

```BASH
npm i @joist/component @joist/di lit-html
```

### Component

Components are created via the "Component" decorator and defining a custom element.

```TS
import { Component, defineElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@Component<string>({
  state: 'Hello World',
  render: template(({ state }) => html`<h1>${state}</h1>`)
})
class AppComponent {}

customElements.define('app-root', defineElement(AppComponent));
```

### Component State

A component view can ONLY be updated by updating the component's state.
A component's state can be accessed and updated via it's `State` instance which is available via `@StateRef`

```TS
import { Component, StateRef, State, defineElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@Component<number>({
  state: 0,
  render: template({ state }) => html`${state}`)
})
class AppComponent extends JoistComponent {
  constructor(@StateRef private state: State<number>) {}

  connectedCallback() {
    setInterval(() => this.update(), 1000);
  }

  private update() {
    const { value } = this.state;

    this.state.setValue(value + 1);
  }
}

customElements.define('app-root', defineElement(AppComponent));
```

### Async Component State

Component state can be set asynchronously.

```TS
import { Component, StateRef, State, defineElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

interface AppState {
  loading: boolean;
  data: any[];
}

@Component<AppState>({
  state: {
    loading: false,
    data: []
  },
  render: template({ state }) => html`${JSON.stringify(state)}`)
})
class AppComponent {
  constructor(@StateRef private state: State<AppState>) {}

  connectedCallback() {
    this.state.setValue({ data: [], loading: true });

    const res: Promise<AppState> = this.fetchUsers().then(data => {
      return { loading: false, data }
    });

    this.state.setValue(data);
  }

  private fetchUsers() {
    return fetch('https://reqres.in/api/users').then(res => res.json());
  }
}

customElements.define('app-root', defineElement(AppComponent));
```

### Reducer Component State

You can optionally use reducers to manage your state.
Using the joist dependency injector you can use whatever sort of state management you would like.

```TS
import { Component, StateRef, State, defineElement } from '@joist/component';
import { reducer, StateRef, ReducerState } from '@joist/component/extras';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@Component({
  state: 0,
  render: template({ state }) => html`${state}`)
  providers: [
    reducer<number>((action, state) => {
      switch (action.type) {
        case 'INCREMENT': return state + 1;
        case 'DECREMENT': return state - 1;
      }

      return state;
    })
  ]
})
class AppComponent {
  constructor(@StateRef public state: ReducerState<number>) {}

  increment() {
    return this.state.dispatch({ type: 'INCREMENT' });
  }

  decrement() {
    return this.state.dispatch({ type: 'DECREMENT' });
  }
}

customElements.define('app-root', defineElement(AppComponent));
```

### Component Props

Component props are defined via the `@Prop()` decorator. This creates a property that is available via the custom element.
Prop changes to not trigger template updates. Use custom setters or `onPropChanges` to set new state and update the template.

```TS
import { Component, StateRef, State, Prop, OnPropChanges, defineElement } from '@joist/component';
import { html } from 'lit-html';

@Component<string>({
  state: '',
  render({ state }) {
    return html`<h1>${state}</h1>`
  }
})
class AppTitleComponent implements OnPropChanges {
  @Prop() title: string = '';

  constructor(@StateRef private state: State<string>) {}

  onPropChanges(_prop: string, _oldVal: any, newValue: any) {
    this.state.setValue(newVal);
  }
}

customElements.define('app-title', defineElement(AppTitleComponent));

```

### Component Handlers

In order to trigger methods in a component you can use the `run` function that is provided by the template function.
Decorate component methods with `@Handle('NAME')` to handle whatever is run.

```TS
import { Component, StateRef, State, Handle, defineElement } from '@joist/component';
import { html } from 'lit-html';

@Component<number>({
  state: 0,
  render: template(({ state, run }) => {
    return html`
      <button @click=${run('DECREMENT')}>Decrement</button>

      ${state}

      <button @click=${run('INCREMENT')}>Increment</button>
    `
  })
})
class AppComponent {
  constructor(@StateRef private state: State<number>) {}

  @Handle('INCREMENT') onIncrement(_: Event) {
    this.state.setValue(this.state.value + 1);
  }

  @Handle('DECREMENT') onDecrement(_: Event) {
    this.state.setValue(this.state.value - 1);
  }
}

customElements.define('app-root', defineElement(AppComponent));
```

### Dispatching Events

There are two ways to dispatch events from a component.
You can either:

1. Use the dispatch method passed to your template function
2. Inject the element reference with the @ElRef decorator

```TS
import { Component, Handle, ElRef, defineElement } from '@joist/component';
import { html } from 'lit-html';

@Component<number>({
  state: 0,
  render({ state, run, dispatch }) {
    return html`
      <button @click=${dispatch('DECREMENT')}>Decrement</button>

      ${state}

      <button @click=${run('INCREMENT')}>Increment</button>
    `
  }
})
class AppComponent {
  constructor(@ElRef private elRef: HTMLElement) {}

  @Handle('DECREMENT') onDecrement() {
    this.elRef.dispatchEvent(new CustomEvent('DECREMENT'));
  }
}

customElements.define('app-root', defineElement(AppComponent));
```

### Extending native elements

By default joist extends HTMLElement but there are times when you want to extend another native element,

```TS
import { Component, StateRef, State, defineElement } from '@joist/component';


@Component({
  state: 'Hello World',
  render: ({ state }) => html`<h1>${state}</h1>`
})
class CustomAnchor { }

customElements.define(
  'custom-anchor',
  defineElement(CustomAnchor, { extends: HTMLAnchorElement }),
  { extends: 'a' }
);
```

### Testing

Testing can be handled in a couple of ways. The most straight forward way is to define your element in your test and use document.createElement. When testing elements this way it can also be beneficial to provide your own root provider.

```TS
import { defineElement } from '@joist/component';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let el: HTMLElement;

  customElements.define('test-app-component-1', defineElement(AppComponent, { root: new Injector() }));

  beforeEach(() => {
    el = document.createElement('test-app-component-1');

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  }))

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
```

Joist has been specifically designed so that you can test your component code without the need to create an HTMLElement itself.
This means you can manually create instances of your component and test them independently of joist

```TS
import { AppComponent, AppState } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent(new State(null));
  });

  it('should work', () => {
    expect(component).toBeTruthy();
  });
});
```
