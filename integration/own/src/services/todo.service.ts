import { service, Injected } from '@joist/di';

import { AppStorage } from './storage.service';

export const enum TodoStatus {
  Active = 'active',
  Complete = 'complete',
}

export class Todo {
  static create(name: string, status: TodoStatus) {
    return new Todo('todo--' + crypto.randomUUID(), name, status);
  }

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: TodoStatus
  ) {}
}

export class TodoUpdatedEvent extends Event {
  constructor(public todo: Todo) {
    super('todo_updated');
  }
}

export class TodoAddedEvent extends Event {
  constructor(public todo: Todo) {
    super('todo_added');
  }
}

export class TodoRemovedEvent extends Event {
  constructor(public todo: string) {
    super('todo_removed');
  }
}

@service
export class TodoService extends EventTarget {
  static inject = [AppStorage];

  private todos: Todo[] = [];
  private store = this.getStore();
  private initialized = false;

  constructor(private getStore: Injected<AppStorage>) {
    super();
  }

  getTodos(): Promise<Todo[]> {
    if (this.initialized) {
      return Promise.resolve(this.todos);
    }

    return this.store.loadJSON<Todo[]>('joist_todo').then((todos) => {
      this.initialized = true;

      if (todos) {
        this.todos = todos;
      }

      return this.todos;
    });
  }

  async addTodo(todo: Todo) {
    this.todos.push(todo);

    await this.sync();

    this.dispatchEvent(new TodoAddedEvent(todo));
  }

  async removeTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);

    await this.sync();

    this.dispatchEvent(new TodoRemovedEvent(id));
  }

  async updateTodo(id: string, patch: Partial<Todo>) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        this.todos[i] = { ...this.todos[i], ...patch };

        await this.sync();

        this.dispatchEvent(new TodoUpdatedEvent(this.todos[i]));

        break;
      }
    }
  }

  listen(event: string, cb: EventListener) {
    this.addEventListener(event, cb);

    return () => {
      this.removeEventListener(event, cb);
    };
  }

  private sync() {
    return this.store.saveJSON('joist_todo', this.todos);
  }
}
