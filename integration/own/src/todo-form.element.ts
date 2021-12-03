import { injectable } from "@joist/di";
import { styled, css } from "@joist/styled";

import { TodoService, Todo, TodoStatus } from "./todo.service";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <form>
    <input name="todo" placeholder="What needs to be done?" autocomplete="off" autofocus />
  </form>
`;

@injectable
@styled
export class TodoForm extends HTMLElement {
  static deps = [TodoService];

  static styles = [
    css`
      :host {
        display: block;
        background: #fff;
      }

      input {
        box-sizing: border-box;
        display: block;
        padding: 1rem;
        border: none;
        background: rgba(0, 0, 0, 0.003);
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
        margin: 0;
        width: 100%;
        font-size: 24px;
        line-height: 1.4em;
        border: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      :focus {
        outline: none;
      }

      ::-webkit-input-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
      }

      ::-moz-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
      }

      ::input-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
      }
    `,
  ];

  private root = this.attachShadow({ mode: "open" });
  private input: HTMLInputElement | null = null;

  constructor(private todo: TodoService) {
    super();
  }

  connectedCallback() {
    this.root.appendChild(template.content.cloneNode(true));

    this.input = this.root.querySelector("input");

    this.root.addEventListener("submit", (e) => {
      this.onSubmit(e);
    });
  }

  private onSubmit(e: Event) {
    e.preventDefault();

    const todo = this.input!.value;

    if (todo.length) {
      this.todo.addTodo(new Todo(todo, TodoStatus.Active));

      this.input!.value = "";
    }
  }
}

customElements.define("todo-form", TodoForm);
