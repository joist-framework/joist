import { Injector } from '@lit-kit/di';
import { html } from 'lit-html';

import { Component, ElementInstance } from './component';
import { CompState } from './state';
import { Prop } from './prop';

describe('Component', () => {
  describe('creation', () => {
    @Component({
      tag: 'component-test-1',
      defaultState: undefined,
      template() {
        return html`
          <h1>Hello World</h1>
        `;
      }
    })
    class MyComponent1 {}

    it('should create a componentInjector property', () => {
      const el = document.createElement('component-test-1') as ElementInstance<unknown>;

      expect(el.componentInjector instanceof Injector).toBe(true);
    });

    it('should create a componentInstance property', () => {
      const el = document.createElement('component-test-1') as ElementInstance<unknown>;

      expect(el.componentInstance instanceof MyComponent1).toBe(true);
    });

    it('should create a componentState property', () => {
      const el = document.createElement('component-test-1') as ElementInstance<unknown>;

      expect(el.componentState instanceof CompState).toBe(true);
    });
  });

  describe('props', () => {
    @Component({
      tag: 'component-test-2',
      defaultState: undefined,
      template() {
        return html`
          <h1>Hello World</h1>
        `;
      }
    })
    class MyComponent2 {
      @Prop() foo: string = 'Hello World';
    }

    it('should use the value from the componentInstance when getting a property value from the custom element', () => {
      const el = document.createElement('component-test-2') as ElementInstance<unknown> &
        MyComponent2;

      expect(el.foo).toBe('Hello World');
    });

    it('should set componentInstance props when they are set on the custom element', () => {
      const el = document.createElement('component-test-2') as ElementInstance<unknown> &
        MyComponent2;
      el.foo = 'Hello World - 2';

      expect(el.componentInstance.foo).toBe('Hello World - 2');
    });
  });
});
