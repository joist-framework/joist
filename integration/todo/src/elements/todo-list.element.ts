import { inject, injectable } from "@joist/di";
import { css, element, html, listen } from "@joist/element";
import { bind } from "@joist/templating";

import { type Todo, TodoService } from "../services/todo.service.js";
import { TodoCardElement } from "./todo-card.element.js";

@injectable()
@element({
  tagName: "todo-list",
  shadowDom: [
    css`
      :host {
        display: block;
        background: #fff;
        position: relative;
      }
    `,
    html`
      <j-for bind="todos" key="id">
        <template>
          <j-bind props="id:each.value.id, status:each.value.status">
            <todo-card>
              <j-val bind="each.value.name"></j-val>
            </todo-card>
          </j-bind>
        </template>
      </j-for>
    `,
  ],
})
export class TodoListElement extends HTMLElement {
  #todo = inject(TodoService);

  @bind()
  accessor todos: Todo[] = [];

  async connectedCallback() {
    const service = this.#todo();

    this.todos = await service.getTodos();

    service.addEventListener("todo_sync", () => {
      this.todos = service.todos;
    });
  }

  @listen("remove")
  onRemove(e: Event) {
    if (e.target instanceof TodoCardElement) {
      const service = this.#todo();
      service.removeTodo(e.target.id);
    }
  }

  @listen("complete")
  onComplete(e: Event) {
    if (e.target instanceof TodoCardElement) {
      const service = this.#todo();

      const status = e.target.getAttribute("status");

      service.updateTodo(e.target.id, {
        status: status === "active" ? "complete" : "active",
      });
    }
  }
}
