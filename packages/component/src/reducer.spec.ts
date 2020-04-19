import { defineComponent, ElementInstance } from './lib/component';
import { withReducer, ReducerState, ReducerStateRef } from './reducer';

describe('Reducer', () => {
  class MyComponent {
    constructor(@ReducerStateRef public state: ReducerState<number>) {}

    increment() {
      return this.state.dispatch({ type: 'INCREMENT' });
    }

    decrement() {
      return this.state.dispatch({ type: 'DECREMENT' });
    }
  }

  customElements.define('reducer-test-1', defineComponent({
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
  }, MyComponent))


  it('should increment the state by 1', done => {
    const el = document.createElement('reducer-test-1') as ElementInstance<MyComponent>;
    const component = el.componentInstance;

    component.increment().then(() => {
      expect(component.state.value).toBe(1);

      done();
    });
  });

  it('should decrement the state by 1', done => {
    const el = document.createElement('reducer-test-1') as ElementInstance<MyComponent>;
    const component = el.componentInstance;

    component.decrement().then(() => {
      expect(component.state.value).toBe(-1);

      done();
    });
  });
});
