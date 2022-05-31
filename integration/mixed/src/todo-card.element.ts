import { styled, css } from '@joist/styled';
import { ForwardProps, observable, observe } from '@joist/observable';
import { render, html } from 'lit-html';
import classNames from 'classnames';

import { Todo, TodoStatus, TodoService } from './services/todo.service';

@observable
@styled
export class TodoCard extends ForwardProps(HTMLElement) {
  static inject = [TodoService];

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

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    console.log('connected', this.todo);

    this.render();
  }

  onPropertyChanged() {
    console.log('changed', this.todo);

    this.render();
  }

  private template() {
    if (!this.todo) {
      throw new Error(`Todo Object required to render a TodoCard`);
    }

    const { status } = this.todo;
    const complete = status === TodoStatus.Completed;

    return html`
      <div class="${classNames('name', { complete })}">${this.todo.name}</div>

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
