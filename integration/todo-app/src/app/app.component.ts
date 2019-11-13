import './todo-form/todo-form.component';

import { Component, StateRef, State, OnInit, Handle } from '@lit-kit/component';
import { html } from 'lit-html';

import { TodoRef, TodoService, Todo } from './todo.service';

export interface AppState {
  todos: Todo[];
}

@Component<AppState>({
  tag: 'app-root',
  defaultState: { todos: [] },
  style: html`
    <style>
      :host {
        display: block;
      }

      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      ul li {
        background: #fff;
        display: flex;
        padding: 1rem;
        align-items: center;
        margin-bottom: 0.5rem;
        border-top: solid 1px lightgray;
        border-bottom: solid 1px lightgray;
      }

      ul li .todo-name {
        flex-grow: 1;
      }

      ul li.complete {
        background: none;
      }

      ul li.complete .todo-name {
        text-decoration: line-through;
        opacity: 0.5;
      }

      todo-form {
        width: 100%;
        margin-bottom: 0.5rem;
      }

      .placeholder {
        font-size: 1.5rem;
        text-align: center;
        padding: 1rem 0;
        color: gray;
      }
    </style>
  `,
  template(state, run) {
    return html`
      <todo-form @add_todo=${run('ADD_TODO')}></todo-form>

      ${!state.todos.length
        ? html`
            <div class="placeholder">Looks Like Everything is Done!</div>
          `
        : ''}

      <ul>
        ${state.todos.map((todo, index) => {
          return html`
            <li class=${todo.isComplete ? 'complete' : ''}>
              <span class="todo-name">${todo.name}</span>

              ${todo.isComplete
                ? html`
                    <button @click=${run('UNDO_COMPLETE', index)}>UNDO</button>
                  `
                : html`
                    <button @click=${run('COMPLETE_TODO', index)}>COMPLETE</button>
                  `}

              <button @click=${run('REMOVE_TODO', index)}>REMOVE</button>
            </li>
          `;
        })}
      </ul>
    `;
  }
})
export class AppComponent implements OnInit {
  constructor(
    @StateRef() private componentState: State<AppState>,
    @TodoRef() private todo: TodoService
  ) {}

  onInit(): void {
    this.componentState.setValue({ todos: this.todo.todos.value });

    this.todo.todos.onChange(todos => {
      this.componentState.setValue({ todos });
    });
  }

  @Handle('ADD_TODO') onAddTodo(e: CustomEvent<string>): void {
    this.todo.addTodo(new Todo(e.detail, false));
  }

  @Handle('REMOVE_TODO') onRemoveTodo(_: Event, payload: number): void {
    this.todo.removeTodo(payload);
  }

  @Handle('COMPLETE_TODO') onCompleteTodo(_: Event, payload: number): void {
    this.todo.markTodoAsComplete(payload);
  }

  @Handle('UNDO_COMPLETE') onUndoComplete(_: Event, payload: number): void {
    this.todo.markTodoAsComplete(payload, false);
  }
}
