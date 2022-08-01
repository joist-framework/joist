import { service } from '@joist/di';

export interface Storage {
  loadJSON<T>(key: string): Promise<T | undefined>;
  saveJSON<T>(key: string, val: T): Promise<boolean>;
}

@service
export class AppStorage implements Storage {
  data: Record<string, any> = {};

  loadJSON<T>(key: string): Promise<T | undefined> {
    return Promise.resolve(this.data[key] as T);
  }

  saveJSON<T>(key: string, val: T): Promise<boolean> {
    this.data[key] = val;

    return Promise.resolve(true);
  }
}
