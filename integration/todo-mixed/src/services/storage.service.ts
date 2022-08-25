import { service } from '@joist/di';

@service
export class AppStorage {
  data: Record<string, any> = {};

  loadJSON<T>(key: string): T | undefined {
    return this.data[key];
  }

  saveJSON<T extends object>(key: string, val: T): boolean {
    this.data[key] = val;

    return true;
  }
}
