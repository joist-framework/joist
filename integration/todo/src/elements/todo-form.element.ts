import { inject, injectable } from "@joist/di";
import { css, element, html, listen, query } from "@joist/element";

import { Todo, TodoService } from "../services/todo.service.js";

@injectable()
@element({
	tagName: "todo-form",
	shadowDom: [
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
		html`
      <form id="todo-form">
        <input
          id="input"
          name="todo"
          placeholder="What needs to be done?"
          autocomplete="off"
          autofocus
        />
      </form>
    `,
	],
})
export class TodoFormElement extends HTMLElement {
	#input = query<HTMLInputElement>("#input");

	#todos = inject(TodoService);

	@listen("submit", "#todo-form")
	onSubmit(e: Event) {
		const service = this.#todos();

		e.preventDefault();

		const input = this.#input();

		if (input.value) {
			service.addTodo(Todo.create(input.value, "active"));

			input.value = "";
		}
	}
}
