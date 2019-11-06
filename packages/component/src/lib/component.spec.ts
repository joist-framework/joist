import { Injector } from '@lit-kit/di';
import { html } from 'lit-html';

import { Component, createComponent } from './component';
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
    class MyComponent {}

    it('should create a componentInjector property', () => {
      const el = createComponent(MyComponent);

      expect(el.componentInjector instanceof Injector).toBe(true);
    });

    it('should create a componentInstance property', () => {
      const el = createComponent(MyComponent);

      expect(el.componentInstance instanceof MyComponent).toBe(true);
    });

    it('should create a componentState property', () => {
      const el = createComponent(MyComponent);

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
    class MyComponent {
      @Prop() foo: string = 'Hello World';
    }

    it('should use the value from the componentInstance when getting a property value from the custom element', () => {
      const el = createComponent(MyComponent);

      expect(el.foo).toBe('Hello World');
    });

    it('should set componentInstance props when they are set on the custom element', () => {
      const el = createComponent(MyComponent);
      el.foo = 'Hello World - 2';

      expect(el.componentInstance.foo).toBe('Hello World - 2');
    });
  });
});
