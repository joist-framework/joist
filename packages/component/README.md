# @lit-kit/component

Create web components using [lit-html](https://lit-html.polymer-project.org/)

### Installation

```BASH
npm i @lit-kit/component @lit-kit/di lit-html
```

### Bootstrap Environment

If you plan on using lit-kit to create an application you will probably want to use services.
To make sure you have singletons you need to bootstrap.

```TS
import { bootstrapEnvironment } from '@lit-kit/component';

bootstrapEnvironment()
```

### Bootstrap Shady Application

If you need to support older browsers (IE11) you will need to use the web components polyfills and enable shady css rendering.

```TS
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js'

import { bootstrapEnvironment } from '@lit-kit/component';
import { withShadyRenderer } from '@lit-kit/component/lib/shady-renderer';

bootstrapEnvironment([withShadyRenderer()]);
```

### Component

Components are created via the "Component" decorator and a custom element is defined.

```TS
import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<string>({
  tag: 'app-root',
  initialState: 'Hello World',
  template(state) {
    return html`<h1>${state}</h1>`
  }
})
class AppComponent {}
```

### Component Styles

Styles can either be placed in the "styles" array.
Scoped styles are enabled when using shadow dom.
If you want to use a css preprocessor look at things like webpack's scss-loader.

```TS
import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<string>({
  tag: 'app-root',
  initialState: 'Hello World',
  useShadowDom: true,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  template(state) {
    return html`
      <h1>${state}</h1>
    `
  }
})
class AppComponent {}
```

### Component State

A component template can ONLY be updated by updating the component's state.
A component's state can be accessed and updated via it's `State` instance which is available via `@StateRef`

```TS
import { Component, StateRef, State } from '@lit-kit/component';

@Component<number>({
  tag: 'app-root',
  initialState: 0,
  template: state => state.toString()
})
class AppComponent {
  constructor(@StateRef private state: State<number>) {}

  connectedCallback() {
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
  initialState: '',
  template(state) {
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
```

### Component Handlers

In order to trigger methods in a component you can use the `run` function that is provided the the template function.
Decorate component methods with `@Handle('NAME')` to handle whatever is run.

```TS
import { Component, StateRef, State, Handle } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<number>({
  tag: 'app-root',
  initialState: 0,
  template(state, run) {
    return html`
      <button @click=${run('DECREMENT')}>Decrement</button>

      ${state}

      <button @click=${run('INCREMENT')}>Increment</button>
    `
  }
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
```

### Dispatching Events

There are two ways to dispatch events from a component.
You can either:

1. Use the dispatch method passed to your template function
2. Inject the element reference with the @ElRef decorator

```TS
import { Component, Handle, ElRef } from '@lit-kit/component';
import { html } from 'lit-html';

@Component<number>({
  tag: 'app-root',
  initialState: 0,
  template(state, run, dispatch) {
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
    this.elRef.dispatchEvent(new CustomEvent('INCREMENT'));
  }
}
```

### Async State

Component state can be set asynchronously.

```TS
import { Component, StateRef, State } from '@lit-kit/component';

interface AppState {
  loading: boolean;
  data: string[];
}

@Component<AppState>({
  tag: 'app-root',
  initialState: { loading: false, data: [] },
  template: state => JSON.stringify(state)
})
class AppComponent {
  constructor(@StateRef private state: State<AppState>) {}

  connectedCallback() {
    this.state.setValue({ data: [], loading: true });

    const data = fetch('/data').then(res => res.json()).then(data => ({ loading: false, data }));

    this.state.setValue(data);
  }
}
```

### Reducer State

You can optionally use reducers to manage your state.
Using the lit kit dependency injector you can use whatever sort of state management you would like.

```TS
import { Component, StateRef, State } from '@lit-kit/component';
import { withReducer, ReducerStateRef, ReducerState } from '@lit-kit/component/lib/reducer'

@Component({
  tag: 'app-counter',
  initialState: 0,
  template: state => state.toString(),
  use: [
    withReducer<number>((action, state) => {
      switch (action.type) {
        case 'INCREMENT': return state + 1;
        case 'DECREMENT': return state - 1;
      }

      return state;
    })
  ]
})
class AppComponent {
  constructor(@ReducerStateRef public state: ReducerState<number>) {}

  increment() {
    return this.state.dispatch({ type: 'INCREMENT' });
  }

  decrement() {
    return this.state.dispatch({ type: 'DECREMENT' });
  }
}
```

### Testing

Testing can be handled in a couple of ways. The most straight forward way is to use the available "createComponent" function. All that createComponent does is grab the metadata from a component class and run document.createElement.

```TS
import { createComponent, ElementInstance } from '@lit-kit/component';

import { AppComponent, AppState } from './app.component';

describe('AppComponent', () => {
  let el: ElementInstance<AppComponent, AppState>;

  beforeEach(() => {
    el = createComponent(AppComponent);

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

If you want to test your component code without creating an instance of an HTMLElement you can manually create instances yourself.

```TS
import { createComponent, ElementInstance, State } from '@lit-kit/component';

import { AppComponent, AppState } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent(new State({}));
  });

  it('should work', () => {
    expect(component).toBeTruthy();
  });
});
```

And of course you can manually create the element yourself

```TS
import './app.component';

describe('AppComponent', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('app-root');

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
