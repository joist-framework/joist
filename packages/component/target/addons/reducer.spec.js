var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
import { html } from 'lit-html';
import { withReducer, ReducerStateRef } from './reducer';
import { defineElement } from '../src/lib/define_element';
import { Component } from '../src/lib/component';
describe('Reducer', () => {
  let MyComponent = class MyComponent {
    constructor(state) {
      this.state = state;
    }
    increment() {
      return this.state.dispatch({ type: 'INCREMENT' });
    }
    decrement() {
      return this.state.dispatch({ type: 'DECREMENT' });
    }
  };
  MyComponent = __decorate(
    [
      Component({
        initialState: 0,
        template: ({ state }) => html` ${state} `,
        use: [
          withReducer((action, state) => {
            switch (action.type) {
              case 'INCREMENT':
                return state + 1;
              case 'DECREMENT':
                return state - 1;
            }
            return state;
          }),
        ],
      }),
      __param(0, ReducerStateRef),
    ],
    MyComponent
  );
  customElements.define('reducer-test-1', defineElement(MyComponent));
  it('should increment the state by 1', (done) => {
    const el = document.createElement('reducer-test-1');
    const component = el.componentInstance;
    component.increment().then(() => {
      expect(component.state.value).toBe(1);
      done();
    });
  });
  it('should decrement the state by 1', (done) => {
    const el = document.createElement('reducer-test-1');
    const component = el.componentInstance;
    component.decrement().then(() => {
      expect(component.state.value).toBe(-1);
      done();
    });
  });
});
//# sourceMappingURL=reducer.spec.js.map
