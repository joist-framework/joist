export interface Storage {
  loadJSON<T>(key: string): Promise<T | undefined>;
  saveJSON<T>(key: string, val: T): Promise<boolean>;
}

export class AppStorage implements Storage {
  static service = true;

  #data = new Map<string, any>();

  loadJSON<T>(key: string): Promise<T | undefined> {
    return Promise.resolve(this.#data.get(key));
  }

  saveJSON<T>(key: string, val: T): Promise<boolean> {
    this.#data.set(key, val);

    return Promise.resolve(true);
  }
}
