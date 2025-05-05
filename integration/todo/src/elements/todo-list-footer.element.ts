import { inject, injectable } from "@joist/di";
import { css, element, html } from "@joist/element";

import { bind } from "@joist/element/templating.js";
import { TodoService } from "../services/todo.service.js";

const sfxs = new Map([
  ["one", "item"],
  ["other", "items"],
]);

class PluralRules extends Intl.PluralRules {}

@injectable({
  providers: [
    [
      PluralRules,
      {
        factory() {
          return new Intl.PluralRules();
        },
      },
    ],
  ],
})
@element({
  tagName: "todo-list-footer",
  shadowDom: [
    css`
      :host {
        --card-height: 50px;

        display: block;
        position: relative;
        height: var(--card-height);
      }

      #footer {
        box-sizing: border-box;
        background: white;
        display: flex;
        align-items: center;
        color: black;
        padding: 10px 15px;
        height: calc(var(--card-height) - 11px);
        text-align: center;
        border-top: 1px solid #e6e6e6;
        font-size: 14px;
        text-align: left;
        position: relative;
        z-index: 1;
      }

      #decoration {
        background: white;
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: calc(var(--card-height) - 11px);
        overflow: hidden;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
          0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
          0 17px 2px -6px rgba(0, 0, 0, 0.2);
      }
    `,
    html`
      <div id="footer"><j-value bind="totalActive"></j-value> left</div>

      <div id="decoration"></div>
    `,
  ],
})
export class TodoListFooterElement extends HTMLElement {
  #todo = inject(TodoService);
  #pr = inject(PluralRules);
  #controller = new AbortController();

  @bind()
  accessor totalActive = "0 items";

  connectedCallback() {
    const todo = this.#todo();

    const onTodoUpdate = async () => {
      this.totalActive = `${todo.totalActive} ${sfxs.get(
        this.#pr().select(todo.totalActive),
      )}`;
    };

    onTodoUpdate();

    todo.addEventListener("todo_sync", onTodoUpdate, {
      signal: this.#controller.signal,
    });
  }

  disconnectedCallback() {
    this.#controller.abort();
  }
}
