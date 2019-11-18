import { createComponent, ElementInstance } from '@lit-kit/component';

import { TodoFormComponent, TodoFormState } from './todo-form.component';

describe('TodoFormComponent', () => {
  let el: ElementInstance<TodoFormComponent, TodoFormState>;

  beforeEach(() => {
    el = createComponent(TodoFormComponent);

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should dispatch the correct value', done => {
    const root = el.shadowRoot!;
    const input = root.querySelector('input') as HTMLInputElement;
    const submit = root.querySelector('button') as HTMLButtonElement;

    input.value = 'Hello World';

    el.addEventListener('add_todo', e => {
      const event = e as CustomEvent<string>;

      expect(event.detail).toBe('Hello World');

      done();
    });

    submit.click();
  });
});
