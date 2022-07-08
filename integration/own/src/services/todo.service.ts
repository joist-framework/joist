import { observable, observe, OnPropertyChanged } from '@joist/observable';
import { service, Injected } from '@joist/di';

import { AppStorage } from './storage.service';

export const enum TodoStatus {
  Active = 'active',
  Complete = 'complete',
}

const todoSecret = Symbol();

export class Todo {
  static create(name: string, status: TodoStatus) {
    return new Todo(crypto.randomUUID(), name, status, todoSecret);
  }

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: TodoStatus,
    secret: Symbol
  ) {
    if (secret !== todoSecret) {
      throw new Error('use Todo.create');
    }
  }
}

export class TodoChangeEvent extends Event {
  constructor(public todo: Todo) {
    super('todo_changed');
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
@observable
export class TodoService extends EventTarget implements OnPropertyChanged {
  static inject = [AppStorage];

  @observe todos: Todo[] = [];

  private store: AppStorage;

  constructor(store: Injected<AppStorage>) {
    super();

    this.store = store();

    const stored = this.store.loadJSON<Todo[]>('joist_todo');

    if (stored) {
      this.todos = stored;
    }
  }

  addTodo(todo: Todo) {
    this.todos = [...this.todos, todo];

    this.dispatchEvent(new TodoAddedEvent(todo));
  }

  removeTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);

    this.dispatchEvent(new TodoRemovedEvent(id));
  }

  updateTodo(id: string, patch: Partial<Todo>) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        this.todos[i] = { ...this.todos[i], ...patch };

        this.dispatchEvent(new TodoChangeEvent(this.todos[i]));

        break;
      }
    }
  }

  onPropertyChanged() {
    this.store.saveJSON('joist_todo', this.todos);
  }
}
