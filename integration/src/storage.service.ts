import { service } from '@joist/di';

@service
export class AppStorage {
  loadJSON<T>(key: string): T | undefined {
    try {
      const res = localStorage.getItem(key);

      if (res) {
        return JSON.parse(res);
      }
    } catch {}

    return undefined;
  }

  saveJSON<T extends object>(key: string, val: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(val));

      return true;
    } catch {}

    return false;
  }
}
