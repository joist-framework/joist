import { State } from '@joist/component';
import { service, inject } from '@joist/di';

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

@service()
export class TodoService {
  private todos = new State<Todo[]>(this.store.loadJSON('joist_todo') || []);

  get value() {
    return this.todos.value;
  }

  constructor(@inject(AppStorage) private store: AppStorage) {
    this.onChange((val) => this.store.saveJSON('joist_todo', val));
  }

  addTodo(todo: Todo) {
    return this.todos.setValue([...this.value, todo]);
  }

  removeTodo(index: number) {
    return this.todos.setValue(this.value.filter((_, i) => i !== index));
  }

  updateTodo(index: number, patch: Partial<Todo>) {
    return this.todos.setValue(
      this.value.map((todo, i) => {
        if (i === index) {
          return { ...todo, ...patch };
        }

        return todo;
      })
    );
  }

  onChange(fn: (state: Todo[]) => void) {
    this.todos.onChange(fn);
  }
}
