import { service, inject } from '@joist/di';
import { observable, observe, OnChange } from '@joist/observable';

export const enum TodoStatus {
  Active,
  Completed,
}

export class Todo {
  constructor(public readonly name: string, public readonly status: TodoStatus) {}
}

@service()
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

export class TodoChangeEvent extends Event {
  constructor() {
    super('todochange');
  }
}

@service()
@observable()
export class TodoService extends EventTarget implements OnChange {
  @observe() todos: Todo[] = [];

  constructor(@inject(AppStorage) private store: AppStorage) {
    super();

    const stored = this.store.loadJSON<Todo[]>('joist_todo');

    if (stored) {
      this.todos = stored;
    }

    this.addEventListener('todochange', () => {
      this.store.saveJSON('joist_todo', this.todos);
    });
  }

  addTodo(todo: Todo) {
    this.todos = [...this.todos, todo];
  }

  removeTodo(index: number) {
    this.todos = this.todos.filter((_, i) => i !== index);
  }

  updateTodo(index: number, patch: Partial<Todo>) {
    this.todos = this.todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, ...patch };
      }

      return todo;
    });
  }

  onChange() {
    this.dispatchEvent(new TodoChangeEvent());
  }
}
