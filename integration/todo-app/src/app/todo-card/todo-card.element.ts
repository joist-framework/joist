import { State, Component, JoistElement, Get } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

import { Todo } from '../todo.service';

export interface TodoCardState {
  todo?: Todo;
}

@Component<TodoCardState>({
  tagName: 'todo-card',
  shadowDom: 'open',
  state: {},
  render: template(({ state, dispatch }) => {
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

      ${state.todo
        ? html`<div class="container ${state.todo.isComplete ? 'complete' : ''}">
            <span class="todo-name">${state.todo.name}</span>

            <button @click=${dispatch(state.todo.isComplete ? 'undo_complete' : 'complete_todo')}>
              ${state.todo.isComplete ? 'UNDO' : 'COMPLETE'}
            </button>

            <button @click=${dispatch('remove_todo')}>REMOVE</button>
          </div>`
        : ''}
    `;
  }),
})
export class TodoCardElement extends JoistElement {
  @Get(State)
  private state!: State<TodoCardState>;

  set todo(todo: Todo | undefined) {
    this.state.setValue({ todo });
  }

  get todo() {
    return this.state.value.todo;
  }
}
