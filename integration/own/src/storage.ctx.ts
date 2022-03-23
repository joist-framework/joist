import { injectable } from '@joist/di/dom';

import { AppStorage } from './services/storage.service';
import { TodoService } from './services/todo.service';

class AppLocalStorage extends AppStorage {
  constructor() {
    super();
  }

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
  static providers = [
    { provide: TodoService, use: TodoService },
    { provide: AppStorage, use: AppLocalStorage },
  ];
}

customElements.define('local-storage-ctx', StorageCtx);
