import { injectable } from '@joist/di';

import { AppStorage } from './services/storage.service';
import { TodoService } from './services/todo.service';

class AppLocalStorage extends AppStorage {
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
    } catch {
      return false;
    }
  }
}

@injectable
export class StorageCtx extends HTMLElement {
  static providers = [TodoService, { provide: AppStorage, use: AppLocalStorage }];
}

customElements.define('local-storage-ctx', StorageCtx);
