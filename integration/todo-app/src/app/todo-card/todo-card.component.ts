import { Component, StateRef, State, ElRef, Handle, Prop, OnPropChanges } from '@lit-kit/component';
import { html } from 'lit-html';

import { Todo } from '../todo.service';

export interface TodoCardState {
  todo?: Todo;
}

@Component<TodoCardState>({
  tag: 'todo-card',
  initialState: {},
  useShadowDom: true,
  styles: [
    `
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
    `
  ],
  template(state, run) {
    if (!state.todo) {
      return '';
    }

    return html`
      <div class="container ${state.todo.isComplete ? 'complete' : ''}">
        <span class="todo-name">${state.todo.name}</span>

        <button @click=${run(state.todo.isComplete ? 'UNDO_COMPLETE' : 'COMPLETE_TODO')}>
          ${state.todo.isComplete ? 'UNDO' : 'COMPLETE'}
        </button>

        <button @click=${run('REMOVE_TODO')}>REMOVE</button>
      </div>
    `;
  }
})
export class TodoCardComponent implements OnPropChanges {
  @Prop() todo?: Todo;

  constructor(@StateRef private state: State<TodoCardState>, @ElRef private elRef: HTMLElement) {}

  onPropChanges() {
    this.state.setValue({ todo: this.todo });
  }

  @Handle('REMOVE_TODO') onRemoveTodo(): void {
    this.elRef.dispatchEvent(new CustomEvent('remove_todo'));
  }

  @Handle('COMPLETE_TODO') onCompleteTodo(): void {
    this.elRef.dispatchEvent(new CustomEvent('complete_todo'));
  }

  @Handle('UNDO_COMPLETE') onUndoComplete(): void {
    this.elRef.dispatchEvent(new CustomEvent('undo_complete'));
  }
}
