import { styled, css } from '@joist/styled';
import { attr, observable, observe, OnPropertyChanged } from '@joist/observable';
import { query } from '@joist/query';

import { Todo, TodoStatus } from './services/todo.service';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
  <div id="name"></div>
  
  <button id="remove">remove</button>
  
  <button id="complete">complete</button>
`;

@styled
@observable
export class TodoCard extends HTMLElement implements OnPropertyChanged {
  static styles = [
    css`
      :host {
        align-items: center;
        display: flex;
        padding: 1rem;
      }

      #name {
        flex-grow: 1;
      }

      :host([complete='true']) #name {
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
  ];

  @observe todo?: Todo;
  @observe @attr complete = false;

  @query('#remove') removeBtn!: HTMLElement;
  @query('#complete') completeBtn!: HTMLElement;
  @query('#name') nameEl!: HTMLElement;

  private root = this.attachShadow({ mode: 'open' });

  connectedCallback() {
    this.root.appendChild(template.content.cloneNode(true));

    this.root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      switch (target.id) {
        case 'remove':
          this.dispatchEvent(new Event('remove'));

          break;

        case 'complete':
          this.dispatchEvent(new Event('complete'));

          break;
      }
    });
  }

  onPropertyChanged() {
    if (this.todo) {
      this.nameEl.innerHTML = this.todo.name;
      this.complete = this.todo.status === TodoStatus.Completed;
      this.completeBtn.innerHTML = this.complete ? 'complete' : 'active';
    }
  }
}

customElements.define('todo-card', TodoCard);
