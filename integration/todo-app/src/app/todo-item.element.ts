import { JoistElement, component, property, State, get } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

import { Todo, TodoStatus } from './todo.service';

export interface TodoItemState {
  todo?: Todo;
}

@component<TodoItemState>({
  tagName: 'todo-item',
  shadowDom: 'open',
  state: {},
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
  render: template(({ state: { todo }, dispatch }) => {
    return html`
      <div class="name${todo?.status === TodoStatus.Completed ? ' complete' : ''}">
        ${todo?.name}
      </div>

      <button class="remove" @click="${dispatch('remove_todo')}">remove</button>

      <button class="complete" @click="${dispatch('complete_todo')}">
        ${todo?.status === TodoStatus.Active ? 'complete' : 'active'}
      </button>
    `;
  }),
})
export class TodoItemElement extends JoistElement {
  @get(State)
  private state!: State<TodoItemState>;

  @property()
  public todo?: Todo;

  onPropChanges() {
    this.state.patchValue({ todo: this.todo });
  }
}
