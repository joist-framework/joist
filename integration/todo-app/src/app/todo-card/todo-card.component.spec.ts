import { ElementInstance } from '@joist/component';

import { TodoCardComponent } from './todo-card.component';

describe('TodoCardComponent', () => {
  let el: ElementInstance<TodoCardComponent>;

  beforeEach(() => {
    el = document.createElement('todo-card') as ElementInstance<TodoCardComponent>;

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
