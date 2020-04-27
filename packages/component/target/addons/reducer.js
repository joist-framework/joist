import { Inject } from '@joist/di';
import { State } from '../src/lib/state';
export function ReducerStateRef(c, k, i) {
  Inject(ReducerState)(c, k, i);
}
export class ReducerState {
  constructor(reducer, state) {
    this.reducer = reducer;
    this.state = state;
  }
  get value() {
    return this.state.value;
  }
  dispatch(action) {
    return this.state.setValue(this.reducer(action, this.state.value));
  }
  onChange(fn) {
    return this.state.onChange(fn);
  }
}
export function withReducer(reducer) {
  return {
    provide: ReducerState,
    useFactory: (state) => new ReducerState(reducer, state),
    deps: [State],
  };
}
//# sourceMappingURL=reducer.js.map
