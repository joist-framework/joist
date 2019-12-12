import { Component } from './lib/component';
import { createComponent } from './lib/create-component';
import { withReducer, ReducerState, ReducerStateRef } from './reducer';

describe('Reducer', () => {
  @Component({
    tag: 'reducer-test-1',
    initialState: 0,
    template: state => state.toString(),
    use: [
      withReducer<number>((action, state) => {
        switch (action.type) {
          case 'INCREMENT':
            return state + 1;

          case 'DECREMENT':
            return state - 1;
        }

        return state;
      })
    ]
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

  it('should increment the state by 1', done => {
    const el = createComponent<MyComponent, number>(MyComponent);
    const component = el.componentInstance;

    component.increment().then(() => {
      expect(component.state.value).toBe(1);

      done();
    });
  });

  it('should decrement the state by 1', done => {
    const el = createComponent<MyComponent, number>(MyComponent);
    const component = el.componentInstance;

    component.decrement().then(() => {
      expect(component.state.value).toBe(-1);

      done();
    });
  });
});
