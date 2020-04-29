import { Component, defineElement, State } from '@joist/component';

const AppElement = defineElement(
  Component({
    initialState: '',
    template({ state }) {
      const title = document.createElement('h1');

      title.innerHTML = state;

      return ul;
    },
  })(
    class {
      static get joistProvider() {
        return {
          deps: [State],
        };
      }

      constructor(state) {
        this.state = state;
      }

      connectedCallback() {
        this.state.setValue('Hello World');
      }
    }
  )
);

customElements.define('app-root', AppElement);
