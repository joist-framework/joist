import { ElementInstance } from '@lit-kit/component';

import { TodoCardComponent, TodoCardState } from './todo-card.component';

describe('TodoCardComponent', () => {
  let el: ElementInstance<TodoCardComponent, TodoCardState>;

  beforeEach(() => {
    el = document.createElement('todo-card') as ElementInstance<TodoCardComponent, TodoCardState>;

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
