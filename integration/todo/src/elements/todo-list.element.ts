import { inject, injectable } from "@joist/di";
import { css, element, html, listen } from "@joist/element";

import { bind } from "@joist/observable/dom.js";
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

      ::slotted(todo-card) {
        border-bottom: solid 1px #f3f3f3;
      }

      ::slotted(todo-card:last-child) {
        border-bottom: none;
      }
    `,
    html`
      <j-for bind="todos" key="id">
        <template>
          <j-props $value.id:id $value.status:status>
            <todo-card>
              <j-value bind="value.name"></j-value>
            </todo-card>
          </j-props>
        </template>
      </j-for>
    `,
  ],
})
export class TodoListElement extends HTMLElement {
  // #controller: AbortController | null = null;
  #todo = inject(TodoService);

  @bind()
  accessor todos: Todo[] = [];

  async connectedCallback() {
    const service = this.#todo();

    service.addEventListener("todo_sync", () => {
      this.todos = service.todos;
    });
  }

  @listen("remove")
  onRemove(e: Event) {
    const service = this.#todo();

    if (e.target instanceof TodoCardElement) {
      service.removeTodo(e.target.id);
    }
  }

  @listen("complete")
  onComplete(e: Event) {
    const service = this.#todo();

    if (e.target instanceof TodoCardElement) {
      const status = e.target.getAttribute("status");

      service.updateTodo(e.target.id, {
        status: status === "active" ? "complete" : "active",
      });
    }
  }
}
