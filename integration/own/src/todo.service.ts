import { service, injectable } from "@joist/di";
import { observable, observe, OnChange } from "@joist/observable";

import { AppStorage } from "./storage.service";

export const enum TodoStatus {
  Active,
  Completed,
}

export class Todo {
  constructor(
    public readonly name: string,
    public readonly status: TodoStatus
  ) {}
}

export class TodoChangeEvent extends Event {
  constructor() {
    super("todochange");
  }
}

@service
@observable
@injectable
export class TodoService extends EventTarget implements OnChange {
  static deps = [AppStorage];

  @observe todos: Todo[] = [];

  constructor(private store: AppStorage) {
    super();

    const stored = this.store.loadJSON<Todo[]>("joist_todo");

    if (stored) {
      this.todos = stored;
    }

    this.addEventListener("todochange", () => {
      this.store.saveJSON("joist_todo", this.todos);
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
