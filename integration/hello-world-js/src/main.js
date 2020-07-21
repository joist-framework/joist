import { defineElement, State } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

class AppComponent {
  static get componentDef() {
    return {
      state: '',
      render: template(({ state, run }) => {
        return html`
          <h1>${state}</h1>

          <button @click=${run('TEST_HANDER')}>Click Me!</button>
        `;
      }),
    };
  }

  static get props() {
    return [];
  }

  static get handlers() {
    return {
      TEST_HANDLER: ['foo', 'bar'],
    };
  }

  static get deps() {
    return [State];
  }

  constructor(state) {
    this.state = state;
  }

  connectedCallback() {
    this.state.setValue('Hello World');
  }

  foo() {
    console.log('FOO CALLED');
  }

  bar() {
    console.log('BAR CALLED');
  }
}

customElements.define('app-root', defineElement(AppComponent));
