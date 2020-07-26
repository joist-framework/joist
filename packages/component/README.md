# @joist/component

### Installation

```BASH
npm i @joist/component @joist/di
```

### Component

Components are created via the "component" decorator and defining a custom element.
The render function will be called whenver a components [state](#component-state) is updated.
You can register your custom element either by passing in a `tagName` or my manually calling `customElements.define`

```TS
import { component, JoistElement } from '@joist/component';

@component({
  tagName: 'app-root', // register now
  state: {
    title: 'Hello World'
  },
  render({ state, host }) {
    host.innerHTML = state.title;
  }
})
class AppElement extends JoistElement {}

// register later: customElements.define('app-root', AppElement);
```

Once your component templates become more complicated you will probably reach for a view library.
Joist ships with out of the box support for lit-html.

```BASH
npm i lit-html
```

```TS
import { component, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@component({
  tagName: 'app-root',
  state: {
    title: 'Hello World'
  },
  render: template(({ state }) => {
    return html`<h1>${state.title}</h1>`
  })
})
class AppElement extends JoistElement {}
```

### Dependency injection (DI)

Sometimes you have code that you want to share between elements.
One method of doing this is with Joist's built in dependency injector.
The `@get` decorator will map a class property to an instance of a service.
One service can also inject another as an argument via the `@inject` decorator.
The `@service` decorator ensures that your class will be treated as a global singleton.

Property based DI with `@get` is "lazy", meaning that the service won't be instantiated until the first time it is requested.

```TS
import { component, JoistElement, get } from '@joist/component';
import { service, inject } from '@joist/di'

@service()
class Fooservice {
  sayHello() {
    return 'Hello World';
  }
}

@service()
class Barservice {
  constructor(@inject(Fooservice) private foo: Fooservice) {}

  sayHello() {
    return this.foo.sayHello();
  }
}

@component({
  tagName: 'app-root',
})
class AppElement extends Joistcomponent {
  @get(Myservice) private myservice!: Myservice;

  connectedCallback() {
    super.connectedCallback();

    console.log(this.myservice.sayHello());
  }
}
```

### Component State

A component view can ONLY be updated by updating the component's state.
A component's state can be accessed and updated via it's `State` instance which is available via `@get`

```TS
import { component, State, JoistElement } from '@joist/component';

@component<number>({
  tagName: 'app-root',
  state: 0,
  render({ state, host }) {
    host.innerHTML = state.toString();
  }
})
class AppElement extends JoistElement {
  @get(State) private state!: State<number>;

  connectedCallback() {
    super.connectedCallback();

    setInterval(() => this.update(), 1000);
  }

  private update() {
    const { value } = this.state;

    this.state.setValue(value + 1);
  }
}
```

### Async Component State

component state can be set asynchronously.

```TS
import { component, State, JoistElement } from '@joist/component';
import { service } from '@joist/di';

@service()
class Userservice {
  fetchUsers() {
    return fetch('https://reqres.in/api/users').then(res => res.json());
  }
}

interface AppState {
  loading: boolean;
  data: any[];
}

@component<AppState>({
  tagName: 'app-root',
  state: {
    loading: false,
    data: []
  },
  render({ state, host }) {
    host.innerHTML = JSON.stringify(state);
  }
})
class AppElement extends JoistElement {
  @get(State)
  private state!: State<AppState>;

  @get(Userservice)
  private user!: Userservice;

  connectedCallback() {
    super.connectedCallback();

    this.state.setValue({ data: [], loading: true });

    const res: Promise<AppState> = this.user.fetchUsers().then(data => {
      return { loading: false, data }
    });

    this.state.setValue(data);
  }
}
```

### Reducer component State

You can optionally use reducers to manage your state.
Using the joist dependency injector you can use whatever sort of state management you would like.

```TS
import { component, JoistElement } from '@joist/component';
import { reducer, ReducerState } from '@joist/component/extras';

@component({
  tagName: 'app-root',
  state: 0,
  render({ state, host }) {
    host.innerHTML = state.toString();
  },
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
class AppElement extends JoistElement {
  @get(ReducerState) private state!: ReducerState<number>;

  increment() {
    return this.state.dispatch({ type: 'INCREMENT' });
  }

  decrement() {
    return this.state.dispatch({ type: 'DECREMENT' });
  }
}
```

### Component Props

Since joist just uses custom elements any properties on your element will work.
You can use custom getters and setters or decorate your props with `@property` which will cause `onPropChanges` to be called.

```TS
import { component, State, JoistElement, property, OnPropChanges } from '@joist/component';

@component({
  tagName: 'app-root',
  state: ''
  render({ state, host }) {
    host.innerHTML = state;
  },
})
class AppElement extends JoistElement implements OnPropChanges {
  @get(State) private state!: State<string>;

  @property() greeting = '';

  onPropChanges(_name: string, _oldVal: string, _newVal: string) {
    this.state.setValue(this.greeting);
  }
}
```

### Component Handlers

In order to trigger methods in a component you can use the `run` function that is provided by RenderCtx
Decorate component methods with `@handle('NAME')` to handle whatever is run.
Multiple methods can be mapped to the same key. And a single method can be mappped to multiple 'actions'.

```TS
import { component, State, handle, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@component<number>({
  tagName: 'app-root',
  state: 0,
  render: template(({ state, run }) => {
    return html`
      <button @click=${run('DECREMENT')}>Decrement</button>

      ${state}

      <button @click=${run('INCREMENT')}>Increment</button>
    `
  })
})
class AppElement extends JoistElement {
  @get(State) private state!: State<number>;

  @handle('INCREMENT') onIncrement(_: Event) {
    this.state.setValue(this.state.value + 1);
  }

  @handle('DECREMENT') onDecrement(_: Event) {
    this.state.setValue(this.state.value - 1);
  }
}
```

### Dispatching Events

IN addition to calling HTMLElement.dispatchEvent you can also use the dispatch function passed to your render function.

```TS
import { component, handle, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@component({
  tagName: 'app-root',
  render: template(({ run, dispatch }) => {
    return html`
      <button @click=${dispatch('FIRST_EVENT')}>First</button>

      <button @click=${run('SECOND')}>Second</button>
    `
  })
})
class AppElement extends JoistElement {
  @handle('SECOND') onSecond() {
    this.dispatchEvent(new CustomEvent('SECOND_EVENT'));
  }
}
```

### Testing

The simplest way to test your components is to just create a new instance using `document.createElement`

```TS
import { AppElement } from './app.element';

describe('AppElement', () => {
  let el: AppElement;

  beforeEach(() => {
    el = document.createElement('app-root') as AppElement;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
```

If you want to make use of mock providers you can manually bootstrap your environment.

```TS
import { defineEnvironment, clearEnvironment } from '@joist/component';

import { AppElement } from './app.element';
import { Myservice } from './my.service'

describe('AppElement', () => {
  class MockMyservice implements Myservice {
    sayHello() {
      return 'GOTCHA!';
    }
  }

  beforeEach(() => {
    defineEnvironment([{ provide: Myservice, use: MockMyservice }]);
  });

  afterEach(() => {
    clearEnvironment();
  });

  it('should work', () => {
    const el = new AppElement();

    expect(el.service.sayHello()).toBe('GOTCHA!');
  });
});

```

### Use with LitElement

Joist components are an opinionated way to writing elements,
If you want to use the Joist DI system by don't want to use Joist components it is easy enough to use something like LitElement instead.

```TS
import { injectorBase, getEnvironmentRef, get } from '@joist/component';
import { injector, service } from '@joist/di';
import { LitElement as LitElementOg, html, property, customElement } from 'lit-element';

class LitElement extends LitElementOg implements injectorBase {
  public injector = new injector({}, getEnvironmentRef());
}

@service()
class Fooservice {
  sayHello(name: string) {
    return `Hello, ${name}`;
  }
}

@customElement('simple-greeting')
export class SimpleGreeting extends LitElementDi {
  @get(Fooservice) private foo: Fooservice;

  @property() name = 'World';

  render() {
    return html`<p>${this.foo.sayHello(this.name)}!</p>`;
  }
}
```
