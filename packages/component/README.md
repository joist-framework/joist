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
class FooService {
  sayHello() {
    return 'Hello World';
  }
}

@service()
class BarService {
  constructor(@inject(FooService) private foo: FooService) {}

  sayHello() {
    return this.foo.sayHello();
  }
}

@component({
  tagName: 'app-root',
})
class AppElement extends JoistElement {
  @get(BarService)
  private myService!: BarService;

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
import { component, State, JoistElement, get } from '@joist/component';

@component<number>({
  tagName: 'app-root',
  state: 0,
  render({ state, host }) {
    host.innerHTML = state.toString();
  }
})
class AppElement extends JoistElement {
  @get(State)
  private state!: State<number>;

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
import { component, State, JoistElement, get } from '@joist/component';
import { service } from '@joist/di';

@service()
class UserService {
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

  @get(UserService)
  private user!: UserService;

  connectedCallback() {
    super.connectedCallback();

    this.state.setValue({ data: [], loading: true });

    const res: Promise<AppState> = this.user.fetchUsers().then(data => {
      return { loading: false, data }
    });

    this.state.setValue(res);
  }
}
```

### Reducer component State

You can optionally use reducers to manage your state.
Using the joist dependency injector you can use whatever sort of state management you would like.

```TS
import { component, JoistElement, get } from '@joist/component';
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
  @get(ReducerState)
  private state!: ReducerState<number>;

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
import { component, State, JoistElement, property, OnPropChanges, get, PropChange } from '@joist/component';

@component({
  tagName: 'app-root',
  state: ''
  render({ state, host }) {
    host.innerHTML = state;
  },
})
class AppElement extends JoistElement implements OnPropChanges {
  @get(State)
  private state!: State<string>;

  @property()
  public greeting = '';

  onPropChanges(_change: PropChange) {
    this.state.setValue(this.greeting);
  }
}
```

### Component Handlers

In order to trigger methods in a component you can use the `run` function that is provided by RenderCtx
Decorate component methods with `@handle('NAME')` to handle whatever is run.
Multiple methods can be mapped to the same key. And a single method can be mappped to multiple 'actions'.

```TS
import { component, State, handle, JoistElement, get } from '@joist/component';
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
  @get(State)
  private state!: State<number>;

  @handle('INCREMENT') onIncrement(_: Event) {
    this.state.setValue(this.state.value + 1);
  }

  @handle('DECREMENT') onDecrement(_: Event) {
    this.state.setValue(this.state.value - 1);
  }

  @handle('INCREMENT')
  @handle('DECREMENT')
  onEither() {
    console.log('CALLED WHEN EITHER IS RUN')
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
  beforeEach(() => {
    defineEnvironment([
      {
        provide: MyService,
        use: class implements Myservice {
          sayHello() {
            return 'GOTCHA!';
          }
        }
      },
    ]);
  });

  afterEach(clearEnvironment);

  it('should work', () => {
    const el = new AppElement();

    expect(el.service.sayHello()).toBe('GOTCHA!');
  });
});

```

### Use with Vanilla Custom ELements

Joist components are an opinionated way to write elements,
If you want to use the Joist DI system by don't want to use Joist components it is easy enough to use vanilla custom elements or whatever else you like.
As long as your element implements InjectorBase you can use Joist DI.

```TS
import { withInjector, get } from '@joist/component';
import { service } from '@joist/di';

@service()
class FooService {
  sayHello(name: string) {
    return `Hello, ${name}`;
  }
}

export class MyElement extends withInjector(HTMLElement) {
  @get(FooService)
  private foo: FooService;

  name = 'World';

  connectedCallback() {
    this.innerHTML = html`<p>${this.foo.sayHello(this.name)}!</p>`
  }
}
```
