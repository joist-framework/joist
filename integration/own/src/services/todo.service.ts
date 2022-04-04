import { observable, observe, OnPropertyChanged } from '@joist/observable';
import { service, Injected } from '@joist/di';

import { AppStorage } from './storage.service';

export const enum TodoStatus {
  Active = 'active',
  Complete = 'complete',
}

export class Todo {
  constructor(public readonly name: string, public readonly status: TodoStatus) {}
}

export class TodoChangeEvent extends Event {
  constructor() {
    super('todochange');
  }
}

@service
@observable
export class TodoService extends EventTarget implements OnPropertyChanged {
  static inject = [AppStorage];

  @observe todos: Todo[] = [];

  private store: AppStorage;

  constructor(storeFactory: Injected<AppStorage>) {
    super();

    this.store = storeFactory();

    const stored = this.store.loadJSON<Todo[]>('joist_todo');

    if (stored) {
      this.todos = stored;
    }
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

  onPropertyChanged() {
    this.dispatchEvent(new TodoChangeEvent());
    this.store.saveJSON('joist_todo', this.todos);
  }
}
