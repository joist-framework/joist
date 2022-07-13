import { css, styled } from '@joist/styled';
import { injectable, Injected } from '@joist/di';
import { query } from '@joist/query';

import { Todo, TodoService, TodoStatus } from './services/todo.service';

const sfxs = new Map([
  ['one', 'item'],
  ['other', 'items'],
]);

const template = document.createElement('template');
template.innerHTML = /*html*/ `
  <footer id="footer"></footer>

  <div class="decoration"></div>
`;

@injectable
@styled
export class TodoListFooterElement extends HTMLElement {
  static inject = [TodoService, Intl.PluralRules];

  static styles = [
    css`
      :host {
        display: block;
        position: relative;
      }

      footer {
        background: white;
        display: block;
        color: black;
        padding: 10px 15px;
        height: 20px;
        text-align: center;
        border-top: 1px solid #e6e6e6;
        font-size: 14px;
        text-align: left;
        position: relative;
        z-index: 1;
      }

      .decoration {
        background: white;
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 50px;
        overflow: hidden;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
          0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
          0 17px 2px -6px rgba(0, 0, 0, 0.2);
      }
    `,
  ];

  @query('#footer') footer!: HTMLElement;

  constructor(private todo: Injected<TodoService>, private pr: Injected<Intl.PluralRules>) {
    super();

    const root = this.attachShadow({ mode: 'open' });

    root.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    const todo = this.todo();
    const pr = this.pr();

    const onTodoUpdate = () => {
      const activeCount = this.getCompleteCount(todo.todos);

      this.footer.innerHTML = `${activeCount} ${sfxs.get(pr.select(activeCount))} left`;
    };

    onTodoUpdate();

    todo.addEventListener('todo_updated', onTodoUpdate);
    todo.addEventListener('todo_added', onTodoUpdate);
    todo.addEventListener('todo_removed', onTodoUpdate);
  }

  private getCompleteCount(todos: Todo[]) {
    return todos.reduce(
      (total, todo) => (todo.status === TodoStatus.Active ? total + 1 : total),
      0
    );
  }
}
