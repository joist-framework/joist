import { Inject, ProviderToken } from '@joist/di';

export function StateRef(c: ProviderToken<any>, k: string, i: number) {
  Inject(State)(c, k, i);
}

export class State<T> {
  private currentState: T;
  private listeners: Array<(state: T) => void> = [];

  get value() {
    return this.currentState;
  }

  constructor(state: T) {
    this.currentState = state;
  }

  setValue(state: T | Promise<T>): Promise<void> {
    return Promise.resolve(state).then((res) => {
      this.currentState = res;

      this.listeners.forEach((cb) => cb(this.value));
    });
  }

  patchValue(state: Partial<T> | Promise<Partial<T>>) {
    return Promise.resolve(state).then((res) => {
      try {
        this.setValue({ ...this.value, ...res });
      } catch (err) {
        throw new Error(`cannot patch state that is of type ${typeof state}`);
      }
    });
  }

  onChange(cb: (state: T) => void) {
    this.listeners.push(cb);

    return () => {
      this.listeners = this.listeners.filter((currentCb) => currentCb !== cb);
    };
  }
}
