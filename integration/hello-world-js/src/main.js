import { Component, defineElement, State } from '@joist/component';

const AppElement = defineElement(
  Component({
    initialState: '',
    template({ state, run }) {
      const div = document.createElement('div');

      const title = document.createElement('h1');
      title.innerHTML = state;

      const button = document.createElement('button');
      button.innerHTML = 'Click Me!';
      button.addEventListener('click', run('TEST_HANDER'));

      div.append(title, button);

      return div;
    },
  })(
    class {
      static get props() {
        return [];
      }

      static get deps() {
        return [State];
      }

      static get handlers() {
        return {
          TEST_HANDER: ['foo', 'bar'],
        };
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
  )
);

customElements.define('app-root', AppElement);
