import { JoistElement, component, get } from '@joist/component';

import { reducer, ReducerState } from './reducer';

describe('Reducer', () => {
  @component({
    tagName: 'reducer-test-1',
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
  class MyElement extends JoistElement {
    @get(ReducerState) state!: ReducerState<number>;

    increment() {
      return this.state.dispatch({ type: 'INCREMENT' });
    }

    decrement() {
      return this.state.dispatch({ type: 'DECREMENT' });
    }
  }

  it('should increment the state by 1', async () => {
    const el = new MyElement();

    await el.increment();
    await el.increment();

    expect(el.state.value).toBe(2);
  });

  it('should decrement the state by 1', async () => {
    const el = new MyElement();

    await el.decrement();

    expect(el.state.value).toBe(-1);
  });
});
