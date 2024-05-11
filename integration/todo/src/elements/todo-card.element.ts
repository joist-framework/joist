import { css, html, shadow, listen, attr, tagName, element } from "@joist/element";

import { Todo, TodoStatus } from "../services/todo.service.js";

@element
export class TodoCardElement extends HTMLElement {
  @tagName static tagName = "todo-card";

  @shadow styles = css`
    :host {
      align-items: center;
      display: flex;
      padding: 1rem;
    }

    #name {
      flex-grow: 1;
    }

    :host([status="complete"]) #name {
      text-decoration: line-through;
      opacity: 0.5;
    }

    button {
      border: none;
      color: cornflowerblue;
      cursor: pointer;
      font-size: 1rem;
      background: none;
      margin-left: 0.5rem;
    }

    button#remove {
      color: darkred;
    }
  `;

  @shadow dom = html`
    <div id="name">
      <slot></slot>
    </div>

    <button id="remove">remove</button>

    <button id="complete">complete</button>
  `;

  @attr accessor status: TodoStatus = "active";

  #complete = this.dom.query("#complete")!;

  @listen("click") onClick(e: Event) {
    if (e.target instanceof HTMLButtonElement) {
      this.dispatchEvent(new Event(e.target.id, { bubbles: true }));
    }
  }

  attributeChangedCallback() {
    const isActive = this.status === "active";

    this.#complete.innerHTML = isActive ? "complete" : "active";
  }
}

export function createTodoCard(todo: Todo) {
  const card = new TodoCardElement();
  card.id = todo.id;
  card.innerHTML = todo.name;
  card.status = todo.status;

  return card;
}
