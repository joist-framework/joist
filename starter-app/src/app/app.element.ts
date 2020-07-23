import { Component, State, Handle, JoistElement, Get } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

@Component<number>({
  state: 0,
  render: template(({ state, run }) => {
    return html`
      <button @click=${run('DECREMENT')}>Decrement</button>

      <span>${state}</span>

      <button @click=${run('INCREMENT')}>Increment</button>
    `;
  }),
})
export class AppElement extends JoistElement {
  @Get(State)
  public state!: State<number>;

  @Handle('DECREMENT') onDecrement() {
    return this.state.setValue(this.state.value - 1);
  }

  @Handle('INCREMENT') onIncrement() {
    return this.state.setValue(this.state.value + 1);
  }
}

customElements.define('app-root', AppElement);
