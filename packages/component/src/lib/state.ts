import { Inject, ProviderToken } from '@lit-kit/di';

export class State<T> {
  private currentState: T;
  private listeners: Array<(state: T) => void> = [];

  get value() {
    return this.currentState;
  }

  constructor(defaultState: T) {
    this.currentState = defaultState;
  }

  setValue(state: T | Promise<T>): Promise<void> {
    return Promise.resolve(state).then(res => {
      this.currentState = res;

      this.listeners.forEach(cb => cb(this.value));
    });
  }

  onChange(cb: (state: T) => void) {
    this.listeners.push(cb);

    return () => {
      this.listeners = this.listeners.filter(currentCb => currentCb !== cb);
    };
  }
}

export function StateRef(c: ProviderToken<any>, k: string, i: number) {
  Inject(State)(c, k, i);
}
