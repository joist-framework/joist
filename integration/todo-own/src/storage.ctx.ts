import { injectable } from '@joist/di';

import { AppStorage, Storage } from './services/storage.service';
import { TodoService } from './services/todo.service';

class AppLocalStorage implements Storage {
  loadJSON<T>(key: string): Promise<T | undefined> {
    try {
      const res = localStorage.getItem(key);

      if (res) {
        return Promise.resolve(JSON.parse(res));
      }
    } catch {}

    return Promise.resolve(undefined);
  }

  saveJSON<T>(key: string, val: T): Promise<boolean> {
    try {
      localStorage.setItem(key, JSON.stringify(val));

      return Promise.resolve(true);
    } catch {
      return Promise.resolve(false);
    }
  }
}

@injectable
export class StorageCtxElement extends HTMLElement {
  static providers = [TodoService, { provide: AppStorage, use: AppLocalStorage }];
}
