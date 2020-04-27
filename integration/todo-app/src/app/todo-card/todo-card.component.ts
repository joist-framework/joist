import { Component, StateRef, State, Prop, OnPropChanges, defineElement } from '@joist/component';
import { html } from 'lit-html';

import { Todo } from '../todo.service';

export interface TodoCardState {
  todo?: Todo;
}

@Component<TodoCardState>({
  initialState: {},
  useShadowDom: true,
  template({ state, dispatch }) {
    if (!state.todo) {
      return html``;
    }

    return html`
      <style>
        :host {
          display: block;
          border-top: solid 1px lightgray;
          border-bottom: solid 1px lightgray;
        }

        .container {
          background: #fff;
          height: 100%;
          width: 100%;
          display: flex;
          padding: 1rem;
          align-items: center;
          box-sizing: border-box;
        }

        .todo-name {
          flex-grow: 1;
        }

        .complete {
          background: none;
        }

        .complete .todo-name {
          text-decoration: line-through;
          opacity: 0.5;
        }
      </style>

      <div class="container ${state.todo.isComplete ? 'complete' : ''}">
        <span class="todo-name">${state.todo.name}</span>

        <button @click=${dispatch(state.todo.isComplete ? 'undo_complete' : 'complete_todo')}>
          ${state.todo.isComplete ? 'UNDO' : 'COMPLETE'}
        </button>

        <button @click=${dispatch('remove_todo')}>REMOVE</button>
      </div>
    `;
  },
})
export class TodoCardComponent implements OnPropChanges {
  @Prop() todo?: Todo;

  constructor(@StateRef private state: State<TodoCardState>) {}

  onPropChanges() {
    this.state.setValue({ todo: this.todo });
  }
}

customElements.define('todo-card', defineElement(TodoCardComponent));
