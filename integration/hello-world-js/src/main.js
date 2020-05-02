import { defineElement, State } from '@joist/component';

class AppComponent {
  static get componentDef() {
    return {
      state: '',
      render({ state, run }) {
        const div = document.createElement('div');

        const title = document.createElement('h1');
        title.innerHTML = state;

        const button = document.createElement('button');
        button.innerHTML = 'Click Me!';
        button.addEventListener('click', run('TEST_HANDLER'));

        div.append(title, button);

        return div;
      },
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
