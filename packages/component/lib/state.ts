export class State<T> {
  private listeners: Array<(state: T) => void> = [];

  get value() {
    return this.state;
  }

  constructor(private state: T) {}

  setValue(state: T | Promise<T>): Promise<void> {
    return Promise.resolve(state).then((res) => {
      if (res !== this.state) {
        this.state = res;

        this.notifyListeners();
      }
    });
  }

  patchValue(state: Partial<T> | Promise<Partial<T>>) {
    return Promise.resolve(state).then((res) => {
      try {
        this.state = { ...this.state, ...res };

        this.notifyListeners();

        return this.state;
      } catch (err) {
        throw new Error(`cannot patch state that is of type ${typeof state}`);
      }
    });
  }

  onChange(cb: (state: T) => void) {
    const index = this.listeners.push(cb) - 1;

    return () => {
      this.listeners.splice(index, 1);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb(this.state));
  }
}
