import './todo-form.component';

import { TodoFormElement } from './todo-form.element';
import { Injector } from '@joist/di';

describe('TodoFormElement', () => {
  let el: TodoFormElement;

  beforeEach(() => {
    el = document.createElement('todo-form') as TodoFormElement;

    el.injector.parent = new Injector();

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should dispatch the correct value', (done) => {
    const root = el.shadowRoot!;

    const input = root.querySelector('input') as HTMLInputElement;
    const submit = root.querySelector('button') as HTMLButtonElement;

    input.value = 'Hello World';

    el.addEventListener('add_todo', (e) => {
      const event = e as CustomEvent<string>;

      expect(event.detail).toBe('Hello World');

      done();
    });

    submit.click();
  });
});
