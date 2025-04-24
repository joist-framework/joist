import { attr, css, element, html, listen } from "@joist/element";
import { bind } from "@joist/observable/dom.js";

import type { Todo, TodoStatus } from "../services/todo.service.js";

@element({
  tagName: "todo-card",
  shadowDom: [
    css`
      :host {
        align-items: center;
        display: flex;
        padding: 1rem;
      }

      #name {
        flex-grow: 1;
      }

      :host([status='complete']) #name {
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
    `,
    html`
      <div id="name">
        <j-if bind="!actionState.showStar">
          <template>
            <span>⭐</span>
          </template>
        </j-if>

        <slot></slot>
      </div>

      <button id="remove">remove</button>
      
      <button id="complete">
        <j-value bind="actionState.value"></j-value>
      </button>
    `,
  ],
})
export class TodoCardElement extends HTMLElement {
  @attr()
  @bind()
  accessor status: TodoStatus = "active";

  @bind()
  accessor actionState = {
    value: "active",
    showStar: false,
  };

  @listen("click", "#complete")
  onClick() {
    this.dispatchEvent(new Event("complete", { bubbles: true }));
  }

  @listen("click", "#remove")
  onRemove() {
    this.dispatchEvent(new Event("remove", { bubbles: true }));
  }

  attributeChangedCallback() {
    this.actionState = {
      value: this.status === "active" ? "complete" : "active",
      showStar: this.status === "complete",
    };
  }
}

export function createTodoCard(todo: Todo) {
  const card = new TodoCardElement();
  card.id = todo.id;
  card.innerHTML = todo.name;
  card.status = todo.status;

  return card;
}
