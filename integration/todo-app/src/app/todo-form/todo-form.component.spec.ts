import { createComponent } from '@lit-kit/component';

import { TodoFormComponent, TodoFormState } from './todo-form.component.ts';

describe('TodoFormComponent', () => {
  it('should work', () => {
    const el = createComponent<TodoFormComponent, TodoFormState>(TodoFormComponent);

    expect(el).toBeTruthy();
  });
});
