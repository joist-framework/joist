import { State, clearEnvironment } from '@joist/component';
import { expect } from '@open-wc/testing';

import { NewTodoFormElement } from './new-todo-form.element';
import { TodoService, Todo, TodoStatus } from './todo.service';

describe('NewTodoFormElement', () => {
  afterEach(clearEnvironment);

  it('should create new instance', () => {
    const el = document.createElement('new-todo-form') as NewTodoFormElement;

    expect(el).instanceOf(NewTodoFormElement);
  });

  it('should add a new todo on form submit', (done) => {
    const el = new NewTodoFormElement();
    const state = el.injector.get(State);
    const todo = el.injector.get(TodoService);

    el.connectedCallback();

    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;

    state.setValue('Hello World').then(() => {
      form.dispatchEvent(new Event('submit'));
    });

    todo.onChange((val) => {
      expect(val).deep.equal([new Todo('Hello World', TodoStatus.Active)]);

      done();
    });
  });
});
