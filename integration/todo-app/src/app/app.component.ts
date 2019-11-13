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
        opacity: 0.5;
      }

      ul li.complete span {
        text-decoration: line-through;
      }

      todo-form {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    </style>
  `,
  template(state, run) {
    return html`
      <todo-form @add_todo=${run('ADD_TODO')}></todo-form>

      <ul>
        ${state.todos.map((todo, index) => {
          return html`
            <li class=${todo.isComplete ? 'complete' : ''}>
              <span class="todo-name">${todo.name}</span>

              <button @click=${run('COMPLETE_TODO', index)}>COMPLETE</button>
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
    this.componentState.setState({ todos: this.todo.todos.value });

    this.todo.todos.onStateChange(todos => {
      this.componentState.setState({ todos });
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
}
