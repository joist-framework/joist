import { styled, css } from "@joist/styled";
import { observable, observe, OnChange } from "@joist/observable";
import { render, html } from "lit-html";
import classNames from "classnames";

import { Todo, TodoStatus } from "./todo.service";

@styled
@observable
export class TodoCard extends HTMLElement implements OnChange {
  static styles = [
    css`
      :host {
        align-items: center;
        display: flex;
        padding: 1rem;
      }

      .name {
        flex-grow: 1;
      }

      .name.complete {
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

      button.remove {
        color: darkred;
      }
    `,
  ];

  @observe todo?: Todo;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    console.log(this.todo);
    this.render();
  }

  onChange() {
    console.log(this.todo);
    this.render();
  }

  private template() {
    if (!this.todo) {
      return html``;
    }

    const { status } = this.todo;
    const complete = status === TodoStatus.Completed;

    return html`
      <div class="${classNames("name", { complete })}">${this.todo.name}</div>

      <button
        class="remove"
        @click="${() => this.dispatchEvent(new Event("remove"))}"
      >
        remove
      </button>

      <button
        class="complete"
        @click="${() => this.dispatchEvent(new Event("complete"))}"
      >
        ${status === TodoStatus.Active ? "complete" : "active"}
      </button>
    `;
  }

  private render() {
    render(this.template(), this.shadowRoot!);
  }
}

customElements.define("todo-card", TodoCard);
