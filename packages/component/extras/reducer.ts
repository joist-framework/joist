import { State } from '@joist/component';
import { Provider } from '@joist/di';

export interface Action {
  type: string;
  payload?: any;
}

export abstract class Reducer<T> {
  abstract update(action: Action, state: T): T;
}

export class ReducerState<T> {
  static deps = [Reducer, State];

  get value() {
    return this.state.value;
  }

  constructor(private reducer: Reducer<T>, private state: State<T>) {}

  dispatch(action: Action) {
    return this.state.setValue(this.reducer.update(action, this.state.value));
  }

  onChange(fn: (state: T) => void) {
    return this.state.onChange(fn);
  }
}

export function reducer<T>(update: (action: Action, state: T) => T): Provider<Reducer<T>> {
  return {
    provide: Reducer,
    use: class extends Reducer<T> {
      update = update;
    },
  };
}
