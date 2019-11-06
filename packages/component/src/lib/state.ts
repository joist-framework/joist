import { Inject, SymbolToken, Service } from '@lit-kit/di';

abstract class StateBase<T> {
  private currentState: T;

  get value() {
    return this.currentState;
  }

  constructor(private stateChangeCallback: (state: T) => void, defaultState: T) {
    this.currentState = defaultState;
  }

  setState(state: T | Promise<T>): void {
    let stateRes = state instanceof Promise ? state : Promise.resolve(state);

    stateRes.then(res => {
      this.currentState = res;

      this.stateChangeCallback(this.value);
    });
  }
}

export class CompState<T> extends StateBase<T> {}

@Service()
export class AppState<T> extends StateBase<T> {}

export const App = () => (c: SymbolToken<any>, k: string, i: number) => Inject(AppState)(c, k, i);

export const State = () => (c: SymbolToken<any>, k: string, i: number) =>
  Inject(CompState)(c, k, i);
