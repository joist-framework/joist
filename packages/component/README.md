# lit-framework

A small frameworking for building web components using lit-html

Goals
* [X] Small (~7k for todo app)
* [X] uses standards (custom elements and shadow dom)
* [X] component template can ONLY be updated by calling set state. no exceptions
* [X] Uses dependency Injection 
* [X] Component and Custom Element are Separate. (Your should be able to test component code without creating the custom element)

#### Installation:

```BASH
npm i @ts-kit/lit-framework @ts-kit/di lit-html
```

#### Example:

```TS
import { Component, State, ComponentState, Handle } from '@ts-kit/lit-framework';
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
    this.state.setState(state => state + 1);
  }
  
  @Handle('DECREMENT') onDecrement() {
    this.state.setState(state => state - 1);
  }
}
