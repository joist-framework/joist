# @joist/component

### Installation

```BASH
npm i @joist/component @joist/di
```

### Component

Components are created via the "Component" decorator and defining a custom element.
The render function will be called whenver a components [state](#component-state) is updated.
You can register your custom element either by passing in a `tagName` or my manually calling `customElements.define`

```TS
import { Component, JoistElement } from '@joist/component';

@Component<string>({
  tagName: 'app-root', // register immediatly
  state: {
    title: 'Hello World'
  },
  render({ state, host }) {
    const h1 = document.createElement('h1');
    h1.innerHTML = state.title;

    host.append(h1);
  }
})
class AppElement extends JoistElement {}

// register later
customElements.define('app-root', AppElement);
```

Once your component templates become more complicated you will probably reach for a view library.
Joist ships with out of the box support for lit-html.

```TS
import { Component, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@Component<string>({
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

### Dependency Injection (DI)

Sometimes you have code that you want to share between elements.
One method of doing this is with Joist's built in dependency injector.
The `@Get` decorator will map a class property to an instance of a service.
One service can also inject another as an argument via the `@Inject` decorator.
The `@Service` decorator ensures that your class will be treated as a global singleton.

Property based DI with `@Get` is "lazy", meaning that the service won't be instantiated until the first time it is requested.

```TS
import { Component, JoistElement, Get } from '@joist/component';
import { Service, Inject } from '@joist/di'

@Service()
class FooService {
  sayHello() {
    return 'Hello World';
  }
}

@Service()
class BarService {
  constructor(@Inject(FooService) private foo: FooService) {}

  sayHello() {
    return this.foo.sayHello();
  }
}

@Component({
  tagName: 'app-root',
})
class AppElement extends JoistComponent {
  @Get(MyService)
  private myService!: MyService;

  connectedCallback() {
    console.log(this.myService.sayHello());
  }
}
```

### Component State

A component view can ONLY be updated by updating the component's state.
A component's state can be accessed and updated via it's `State` instance which is available via `@Get`

```TS
import { Component, State, JoistElement } from '@joist/component';

@Component<number>({
  tagName: 'app-root',
  state: 0,
  render({ state, host }) {
    host.innerHTML = state.toString();
  }
})
class AppElement extends JoistElement {
  @Get(State)
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

Component state can be set asynchronously.

```TS
import { Component, State, JoistElement } from '@joist/component';
import { Service } from '@joist/di';

@Service()
class UserService {
  fetchUsers() {
    return fetch('https://reqres.in/api/users').then(res => res.json());
  }
}

interface AppState {
  loading: boolean;
  data: any[];
}

@Component<AppState>({
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
  @Get(State)
  private state!: State<AppState>;

  @Get(UserService)
  private user!: UserService;

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

### Reducer Component State

You can optionally use reducers to manage your state.
Using the joist dependency injector you can use whatever sort of state management you would like.

```TS
import { Component, State, JoistElement } from '@joist/component';
import { reducer, ReducerState } from '@joist/component/extras';

@Component({
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
  @Get(ReducerState)
  private state!: ReducerState<AppState>;

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
Below is an example of using properties to set state.

```TS
import { Component, State, JoistElement } from '@joist/component';

@Component({
  tagName: 'app-root',
  state: {
    title: ''
  },
  render({ state, host }) {
    host.innerHTML = state.tit;le;
  },
})
class AppElement extends JoistElement {
  @Get(State)
  private state!: State<AppState>;

  set title(value: string) {
    this.state.setValue(value);
  }
}
```

### Component Handlers

In order to trigger methods in a component you can use the `run` function that is provided by RenderCtx
Decorate component methods with `@Handle('NAME')` to handle whatever is run.
Multiple methods can be mapped to the same key. And a single method can be mappped to multiple 'actions'.

```TS
import { Component, State, Handle, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@Component<number>({
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
  @Get(State)
  private state!: State<AppState>;

  @Handle('INCREMENT') onIncrement(_: Event) {
    this.state.setValue(this.state.value + 1);
  }

  @Handle('DECREMENT') onDecrement(_: Event) {
    this.state.setValue(this.state.value - 1);
  }
}
```

### Dispatching Events

IN addition to calling HTMLElement.dispatchEvent you can also use the dispatch function passed to your render function.

```TS
import { Component, Handle, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@Component({
  tagName: 'app-root',
  render: template(({ state, run, dispatch }) => {
    return html`
      <button @click=${dispatch('FIRST_EVENT')}>First</button>

      <button @click=${run('SECOND')}>Second</button>
    `
  })
})
class AppElement extends JoistElement {
  @Handle('SECOND') onSecond() {
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
import { bootstrapEnvironment, clearEnvironment } from '@joist/component';

import { AppElement } from './app.element';
import { MyService } from './my.service'

describe('AppElement', () => {
  class MockMyService implements MyService {
    sayHello() {
      return 'GOTCHA!';
    }
  }

  beforeEach(() => {
    bootstrapEnvironment([{ provide: MyService, use: MockMyService }]);
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

If you want to use the Joist DI system by don't want to use JoistElement it is easy enough to into something like LitElement.

```TS
import { InjectorBase, getEnvironmentRef, Get } from '@joist/component';
import { Injector, Service } from '@joist/di';
import { LitElement, html, property, customElement } from 'lit-element';

class LitElementDi extends LitElement implements InjectorBase {
  public injector = new Injector({}, getEnvironmentRef());
}

@Service()
class FooService {
  sayHello(name: string) {
    return `Hello, ${name}`;
  }
}

@customElement('simple-greeting')
export class SimpleGreeting extends LitElementDi {
  @Get(FooService) private foo: FooService;

  @property() name = 'World';

  render() {
    return html`<p>${this.foo.sayHello(this.name)}!</p>`;
  }
}
```
