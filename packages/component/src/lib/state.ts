import { Inject, ProviderToken, Service } from '@lit-kit/di';

abstract class StateBase<T> {
  private currentState: T;
  private listeners: Array<(state: T) => void> = [];

  get value() {
    return this.currentState;
  }

  constructor(defaultState: T) {
    this.currentState = defaultState;
  }

  setState(state: T | Promise<T>): void {
    let stateRes = state instanceof Promise ? state : Promise.resolve(state);

    stateRes.then(res => {
      this.currentState = res;

      this.listeners.forEach(cb => cb(this.value));
    });
  }

  onStateChange(cb: (state: T) => void) {
    this.listeners.push(cb);

    return () => {
      this.listeners = this.listeners.filter(currentCb => currentCb !== cb);
    };
  }
}

export class CompState<T> extends StateBase<T> {}

@Service()
export class AppState<T> extends StateBase<T> {}

export const App = () => (c: ProviderToken<any>, k: string, i: number) => Inject(AppState)(c, k, i);

export const State = () => (c: ProviderToken<any>, k: string, i: number) =>
  Inject(CompState)(c, k, i);
