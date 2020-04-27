import { html } from 'lit-html';

import { withReducer, ReducerState, ReducerStateRef } from './reducer';
import { defineElement, ElementInstance } from '../src/lib/define_element';
import { Component } from '../src/lib/component';

describe('Reducer', () => {
  @Component({
    initialState: 0,
    template: ({ state }) => html` ${state} `,
    use: [
      withReducer<number>((action, state) => {
        switch (action.type) {
          case 'INCREMENT':
            return state + 1;

          case 'DECREMENT':
            return state - 1;
        }

        return state;
      }),
    ],
  })
  class MyComponent {
    constructor(@ReducerStateRef public state: ReducerState<number>) {}

    increment() {
      return this.state.dispatch({ type: 'INCREMENT' });
    }

    decrement() {
      return this.state.dispatch({ type: 'DECREMENT' });
    }
  }

  customElements.define('reducer-test-1', defineElement(MyComponent));

  it('should increment the state by 1', (done) => {
    const el = document.createElement('reducer-test-1') as ElementInstance<MyComponent>;
    const component = el.componentInstance;

    component.increment().then(() => {
      expect(component.state.value).toBe(1);

      done();
    });
  });

  it('should decrement the state by 1', (done) => {
    const el = document.createElement('reducer-test-1') as ElementInstance<MyComponent>;
    const component = el.componentInstance;

    component.decrement().then(() => {
      expect(component.state.value).toBe(-1);

      done();
    });
  });
});
