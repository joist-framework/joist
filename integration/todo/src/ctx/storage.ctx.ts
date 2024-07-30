import { injectable } from '@joist/di';
import { css, html, shadow, element } from '@joist/element';

import { AppStorage, Storage } from '../services/storage.service.js';
import { TodoService } from '../services/todo.service.js';

class AppLocalStorage implements Storage {
  async loadJSON<T>(key: string): Promise<T | undefined> {
    try {
      const res = localStorage.getItem(key);

      if (res) {
        return JSON.parse(res);
      }
    } catch {}

    return undefined;
  }

  async saveJSON<T>(key: string, val: T): Promise<boolean> {
    try {
      localStorage.setItem(key, JSON.stringify(val));

      return true;
    } catch {
      return false;
    }
  }
}

@element({
  tagName: 'local-storage-ctx'
})
@injectable({
  providers: [
    { provide: TodoService, use: TodoService },
    { provide: AppStorage, use: AppLocalStorage }
  ]
})
export class LocalStorageCtx extends HTMLElement {
  @shadow styles = css`
    :host {
      display: contents;
    }
  `;

  @shadow dom = html`<slot></slot>`;
}
