import { css, html, template, styles, define } from '@joist/element';
import { injectable, Injected } from '@joist/di';

import { Todo, TodoService } from './services/todo.service.js';

const sfxs = new Map([
  ['one', 'item'],
  ['other', 'items'],
]);

class PluralRules extends Intl.PluralRules {
  static service = true;
}

@injectable
export class TodoListFooterElement extends HTMLElement {
  @define
  static tagName = 'todo-list-footer';
  static inject = [TodoService, PluralRules];

  @styles styles = css`
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
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: calc(var(--card-height) - 11px);
      overflow: hidden;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
        0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
    }
  `;

  @template template = html`
    <div id="footer"><slot></slot> left</div>

    <div id="decoration"></div>
  `;

  #todo: Injected<TodoService>;
  #pr: Injected<PluralRules>;

  constructor(todo: Injected<TodoService>, pr: Injected<PluralRules>) {
    super();

    this.#todo = todo;
    this.#pr = pr;
  }

  connectedCallback() {
    const todo = this.#todo();
    const pr = this.#pr();

    const onTodoUpdate = async () => {
      const todos = await todo.getTodos();
      const activeCount = this.#getCompleteCount(todos);

      this.innerHTML = `${activeCount} ${sfxs.get(pr.select(activeCount))}`;
    };

    onTodoUpdate();

    todo.addEventListener('todo_updated', onTodoUpdate);
    todo.addEventListener('todo_added', onTodoUpdate);
    todo.addEventListener('todo_removed', onTodoUpdate);
  }

  #getCompleteCount(todos: Todo[]) {
    return todos.reduce((total, todo) => (todo.status === 'active' ? total + 1 : total), 0);
  }
}
