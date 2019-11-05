import { Inject, SymbolToken, RootService } from '@ts-kit/di';

abstract class StateBase<T> {
  constructor(private stateChangeCallback: (state: T) => void, public currentState: T) {}

  setState(state: (state: T) => T | Promise<T>): void {
    let stateRes = state(this.currentState);

    stateRes = stateRes instanceof Promise ? stateRes : Promise.resolve(stateRes);

    stateRes.then(res => {
      this.currentState = res;

      this.stateChangeCallback(this.currentState);
    });
  }
}

export class ComponentState<T> extends StateBase<T> {}

@RootService()
export class AppState<T> extends StateBase<T> {}

export const App = () => (c: SymbolToken<any>, k: string, i: number) => Inject(AppState)(c, k, i);

export const State = () => (c: SymbolToken<any>, k: string, i: number) =>
  Inject(ComponentState)(c, k, i);
