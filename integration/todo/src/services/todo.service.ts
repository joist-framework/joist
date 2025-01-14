import { inject, injectable } from "@joist/di";
import { effect, observe } from "@joist/observable";

import { AppStorage } from "./storage.service.js";

export type TodoStatus = "active" | "complete";

export class Todo {
	static create(name: string, status: TodoStatus) {
		return new Todo(`todo--${crypto.randomUUID()}`, name, status);
	}

	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly status: TodoStatus,
	) {}
}

export class TodoUpdatedEvent extends Event {
	constructor(public todo: Todo) {
		super("todo_updated");
	}
}

export class TodoAddedEvent extends Event {
	constructor(public todo: Todo) {
		super("todo_added");
	}
}

export class TodoRemovedEvent extends Event {
	constructor(public todo: string) {
		super("todo_removed");
	}
}

export class TodoSyncEvent extends Event {
	constructor() {
		super("todo_sync");
	}
}

@injectable()
export class TodoService extends EventTarget {
	@observe()
	accessor #todos: Todo[] = [];

	@observe()
	accessor #initialized = false;

	totalActive = 0;

	#store = inject(AppStorage);

	@effect()
	syncTodosToStorage() {
		this.#store().saveJSON("joist_todo", this.#todos);

		this.totalActive = this.#todos.reduce(
			(total, todo) => (todo.status === "active" ? total + 1 : total),
			0,
		);

		this.dispatchEvent(new TodoSyncEvent());
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

		this.dispatchEvent(new TodoAddedEvent(todo));
	}

	removeTodo(id: string) {
		this.#todos = this.#todos.filter((todo) => todo.id !== id);

		this.dispatchEvent(new TodoRemovedEvent(id));
	}

	updateTodo(id: string, patch: Partial<Todo>) {
		let updated: Todo | undefined = undefined;

		this.#todos = this.#todos.map((todo) => {
			if (todo.id === id) {
				updated = { ...todo, ...patch };

				return updated;
			}

			return todo;
		});

		if (updated) {
			this.dispatchEvent(new TodoUpdatedEvent(updated));
		}
	}
}
