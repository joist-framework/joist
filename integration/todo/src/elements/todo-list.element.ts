import { inject, injectable } from "@joist/di";
import { css, element, html, listen } from "@joist/element";

import {
  TodoAddedEvent,
  TodoRemovedEvent,
  TodoService,
  TodoUpdatedEvent,
} from "../services/todo.service.js";
import { TodoCardElement, createTodoCard } from "./todo-card.element.js";

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
    html`<slot></slot>`,
  ],
})
export class TodoListElement extends HTMLElement {
  #controller: AbortController | null = null;
  #todo = inject(TodoService);

  async connectedCallback() {
    const service = this.#todo();
    const todos = await service.getTodos();

    for (const todo of todos) {
      if (!this.querySelector(`#${todo.id}`)) {
        this.appendChild(createTodoCard(todo));
      }
    }

    this.#controller = new AbortController();

    service.addEventListener(
      "todo_added",
      (e: Event) => {
        this.#onTodoAdded(e);
      },
      { signal: this.#controller.signal },
    );

    service.addEventListener(
      "todo_removed",
      (e: Event) => {
        this.#onTodoRemoved(e);
      },
      { signal: this.#controller.signal },
    );

    service.addEventListener(
      "todo_updated",
      (e: Event) => {
        this.#onTodoChanged(e);
      },
      { signal: this.#controller.signal },
    );
  }

  disconnectedCallback() {
    this.#controller?.abort();
  }

  @listen("remove")
  onRemove(e: Event) {
    if (e.target instanceof TodoCardElement) {
      this.#todo().removeTodo(e.target.id);
    }
  }

  @listen("complete")
  onComplete(e: Event) {
    if (e.target instanceof TodoCardElement) {
      const status = e.target.getAttribute("status");

      this.#todo().updateTodo(e.target.id, {
        status: status === "active" ? "complete" : "active",
      });
    }
  }

  #onTodoAdded(e: Event) {
    if (e instanceof TodoAddedEvent) {
      this.appendChild(createTodoCard(e.todo));
    }
  }

  #onTodoRemoved(e: Event) {
    if (e instanceof TodoRemovedEvent) {
      const el = this.querySelector(`#${e.todo}`);

      if (el instanceof TodoCardElement) {
        this.removeChild(el);
      }
    }
  }

  #onTodoChanged(e: Event) {
    if (e instanceof TodoUpdatedEvent) {
      const el = this.querySelector(`#${e.todo.id}`);

      if (el instanceof TodoCardElement) {
        el.innerHTML = e.todo.name;

        el.setAttribute("status", e.todo.status);
      }
    }
  }
}
