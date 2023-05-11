import { injectable, Injected } from '@joist/di';

import { TodoService } from './services/todo.service.js';

@injectable
export class TodoLoggerElement extends HTMLElement {
  static inject = [TodoService];

  #todo: Injected<TodoService>;

  constructor(todo: Injected<TodoService>) {
    super();

    this.#todo = todo;
  }

  async connectedCallback() {
    const service = this.#todo();

    console.log(await service.getTodos());

    service.addEventListener('todo_added', console.log);
    service.addEventListener('todo_removed', console.log);
    service.addEventListener('todo_updated', console.log);
  }

  disconnectedCallback() {
    const service = this.#todo();

    service.removeEventListener('todo_added', console.log);
    service.removeEventListener('todo_removed', console.log);
    service.removeEventListener('todo_updated', console.log);
  }
}
