import { styled } from '@joist/styled';
import { observable, observe, OnChange } from '@joist/observable';
import { render, html } from 'lit-html';

import { Todo, TodoStatus } from './todo.service';

@observable()
@styled({
  styles: [
    /*css*/ `
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

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  onChange() {
    this.render();
  }

  private template() {
    return html`
      <div class="name${this.todo?.status === TodoStatus.Completed ? ' complete' : ''}">
        ${this.todo?.name}
      </div>

      <button class="remove" @click="${() => this.dispatch('remove_todo')}">remove</button>

      <button class="complete" @click="${() => this.dispatch('complete_todo')}">
        ${this.todo?.status === TodoStatus.Active ? 'complete' : 'active'}
      </button>
    `;
  }

  private render() {
    render(this.template(), this.shadowRoot!);
  }

  private dispatch(name: string) {
    this.dispatchEvent(new Event(name));
  }
}

customElements.define('todo-card', TodoCard);
