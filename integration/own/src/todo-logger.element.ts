import { injectable, Injected } from '@joist/di';

import { TodoService } from './services/todo.service';

@injectable
export class TodoLoggerElement extends HTMLElement {
  static inject = [TodoService];

  constructor(private todo: Injected<TodoService>) {
    super();
  }

  async connectedCallback() {
    const service = this.todo();

    console.log(await service.getTodos());

    service.addEventListener('todo_added', console.log);
    service.addEventListener('todo_removed', console.log);
    service.addEventListener('todo_updated', console.log);
  }
}
