import { inject, injectable } from "@joist/di";
import { effect, observe } from "@joist/observable";

import { AppStorage } from "./storage.service.js";

export type TodoStatus = "active" | "complete";

export class Todo {
  static create(name: string, status: TodoStatus) {
    return new Todo(crypto.randomUUID(), name, status);
  }

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: TodoStatus,
  ) {}
}

export class TodoSyncEvent extends Event {
  constructor(public todos: Todo[]) {
    super("todo_sync");
  }
}

@injectable()
export class TodoService extends EventTarget {
  @observe()
  accessor #todos: Todo[] = [];

  accessor #initialized = false;

  totalActive = 0;

  get todos() {
    return this.#todos;
  }

  #store = inject(AppStorage);

  @effect()
  syncTodosToStorage() {
    this.#store().saveJSON("joist_todo", this.#todos);

    this.totalActive = this.#todos.reduce(
      (total, todo) => (todo.status === "active" ? total + 1 : total),
      0,
    );

    this.dispatchEvent(new TodoSyncEvent(this.#todos));
  }

  async getTodos(): Promise<Todo[]> {
    if (this.#initialized) {
      return this.#todos;
    }

    return this.#store()
      .loadJSON<Todo[]>("joist_todo")
      .then((todos) => {
        this.#initialized = true;

        if (todos) {
          this.#todos = todos;
        }

        return this.#todos;
      });
  }

  addTodo(todo: Todo) {
    this.#todos = [...this.#todos, todo];
  }

  removeTodo(id: string) {
    this.#todos = this.#todos.filter((todo) => todo.id !== id);
  }

  updateTodo(id: string, patch: Partial<Todo>) {
    this.#todos = this.#todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, ...patch };
      }

      return todo;
    });
  }
}
