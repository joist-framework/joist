import { Provider, Inject } from '@lit-kit/di';

import { State } from './lib/state';

export type Reducer<T> = (action: Action, state: T) => T;

export interface Action {
  type: string;
  payload?: any;
}

export function ReducerStateRef(c: any, k: string, i: number) {
  Inject(ReducerState)(c, k, i);
}

export class ReducerState<T> {
  get value() {
    return this.state.value;
  }

  constructor(private reducer: Reducer<T>, private state: State<T>) {}

  dispatch(action: Action) {
    return this.state.setValue(this.reducer(action, this.state.value));
  }

  onChange(fn: (state: T) => void) {
    return this.state.onChange(fn);
  }
}

export function withReducer<T>(reducer: Reducer<T>): Provider<ReducerState<T>> {
  return {
    provide: ReducerState,
    useFactory: (state) => new ReducerState<T>(reducer, state),
    deps: [State],
  };
}
