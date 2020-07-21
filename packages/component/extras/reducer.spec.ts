import { JoistElement, Component } from '@joist/component';

import { reducer, ReducerState } from './reducer';
import { Get } from 'lib/element';

describe('Reducer', () => {
  @Component({
    state: 0,
    providers: [
      reducer<number>((action, state) => {
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
  class MyComponent extends JoistElement {
    @Get(ReducerState) public state!: ReducerState<number>;

    increment() {
      return this.state.dispatch({ type: 'INCREMENT' });
    }

    decrement() {
      return this.state.dispatch({ type: 'DECREMENT' });
    }
  }

  customElements.define('reducer-test-1', MyComponent);

  it('should increment the state by 1', async () => {
    const el = document.createElement('reducer-test-1') as MyComponent;

    await el.increment();

    expect(el.state.value).toBe(1);
  });

  it('should decrement the state by 1', async () => {
    const el = document.createElement('reducer-test-1') as MyComponent;

    await el.decrement();

    expect(el.state.value).toBe(-1);
  });
});
