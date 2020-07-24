import { State, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

export class AppElement extends JoistElement {
  static get componentDef() {
    return {
      tagName: 'app-root',
      state: '',
      render: template(({ state, run }) => {
        return html`
          <h1>${state}</h1>

          <button @click=${run('test_handler')}>Click Me!</button>
        `;
      }),
    };
  }

  static get handlers() {
    return {
      test_handler: ['foo', 'bar'],
    };
  }

  get state() {
    return this.injector.get(State);
  }

  connectedCallback() {
    super.connectedCallback();

    this.state.setValue('Hello World');
  }

  foo() {
    console.log('FOO CALLED');
  }

  bar() {
    console.log('BAR CALLED');
  }
}
