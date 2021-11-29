import { injectable, inject } from '@joist/di';
import { styled } from '@joist/styled';
import { observable, observe, OnChange } from '@joist/observable';
import { render, html } from 'lit-html';
import classNames from 'classnames';

import { Todo, TodoStatus, TodoService } from './todo.service';

@injectable()
@observable()
@styled({
  styles: [
    `:host {
      align-items: center;
      display: flex;
      padding: 1rem;
    }

    .name {
      flex-grow: 1;
    }
    
    .name.complete {
      text-decoration: line-through;
      opacity: .5;
    }
    
    button {
      border: none;
      color: cornflowerblue;
      cursor: pointer;
      font-size: 1rem;
      background: none;
      margin-left: .5rem;
    }

    button.remove {
      color: darkred;
    }`,
  ],
})
export class TodoCard extends HTMLElement implements OnChange {
  @observe() todo?: Todo;

  constructor(@inject(TodoService) service: TodoService) {
    super();

    console.log(service);

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  onChange() {
    this.render();
  }

  private template() {
    if (!this.todo) {
      return html``;
    }

    const { status } = this.todo;

    return html`
      <div class="${classNames('name', { complete: status === TodoStatus.Completed })}">
        ${this.todo?.name}
      </div>

      <button class="remove" @click="${() => this.dispatchEvent(new Event('remove_todo'))}">
        remove
      </button>

      <button class="complete" @click="${() => this.dispatchEvent(new Event('complete_todo'))}">
        ${status === TodoStatus.Active ? 'complete' : 'active'}
      </button>
    `;
  }

  private render() {
    render(this.template(), this.shadowRoot!);
  }
}

customElements.define('todo-card', TodoCard);
