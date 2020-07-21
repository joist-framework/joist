import { ElementInstance } from '@joist/component';

import { TodoCardElement } from './todo-card.component';

describe('TodoCardComponent', () => {
  let el: ElementInstance<TodoCardElement>;

  beforeEach(() => {
    el = document.createElement('todo-card') as ElementInstance<TodoCardElement>;

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
