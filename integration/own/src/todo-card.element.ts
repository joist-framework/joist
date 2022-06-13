import { styled, css } from '@joist/styled';
import { attr, UpgradableElement, observable, observe, OnPropertyChanged } from '@joist/observable';
import { query } from '@joist/query';

import { TodoStatus } from './services/todo.service';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
  <div id="name">
    <slot></slot>
  </div>
  
  <button id="remove">remove</button>
  
  <button id="complete">complete</button>
`;

@styled
@observable
export class TodoCard extends UpgradableElement implements OnPropertyChanged {
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

      :host([status='complete']) #name {
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

  @observe @attr status: TodoStatus = TodoStatus.Active;

  @query('#complete') completeBtn!: HTMLButtonElement;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.appendChild(template.content.cloneNode(true));

    this.shadowRoot!.addEventListener('click', (e) => {
      if (e.target instanceof HTMLButtonElement) {
        this.dispatchEvent(new Event(e.target.id));
      }
    });
  }

  onPropertyChanged() {
    const isActive = this.status === TodoStatus.Active;

    this.completeBtn.innerHTML = isActive ? 'complete' : 'active';
  }
}

customElements.define('todo-card', TodoCard);
