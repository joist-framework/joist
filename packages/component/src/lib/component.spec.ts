import { Injector } from '@lit-kit/di';
import { html } from 'lit-html';

import { Component } from './component';
import { State } from './state';
import { Prop } from './prop';
import { createComponent } from './create-component';
import { Handle } from './handle';

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
      const el = createComponent<MyComponent1, void>(MyComponent1);

      expect(el.componentInjector instanceof Injector).toBe(true);
    });

    it('should create a componentInstance property', () => {
      const el = createComponent<MyComponent1, void>(MyComponent1);

      expect(el.componentInstance instanceof MyComponent1).toBe(true);
    });

    it('should create a componentState property', () => {
      const el = createComponent<MyComponent1, void>(MyComponent1);

      expect(el.componentState instanceof State).toBe(true);
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
      const el = createComponent<MyComponent2, void>(MyComponent2);

      expect(el.componentInstance.foo).toBe('Hello World');
      expect(el.foo).toBe('Hello World');
    });

    it('should set componentInstance props when they are set on the custom element', () => {
      const el = createComponent<MyComponent2, void>(MyComponent2);

      el.foo = 'Hello World - 2';

      expect(el.componentInstance.foo).toBe('Hello World - 2');
    });
  });

  describe('handlers', () => {
    it('should call a function if the trigger is mapped to a class method', done => {
      @Component({
        tag: 'component-test-3',
        defaultState: {},
        template(_, run) {
          return html`
            <button @click=${run('TEST_RUN', 'Hello World')}>click</button>
          `;
        }
      })
      class MyComponent3 {
        @Handle('TEST_RUN') onTestRun(e: Event, payload: string) {
          expect(e instanceof Event).toBe(true);
          expect(payload).toBe('Hello World');

          done();
        }
      }

      const el = createComponent<MyComponent3, void>(MyComponent3);
      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;

      button.click();
    });
  });

  describe('providers', () => {
    it('should allow component specific services to be provided', () => {
      class TestToken {}

      @Component({
        tag: 'component-test-4',
        defaultState: {},
        template() {
          return html``;
        },
        providers: [{ provide: TestToken, useFactory: () => 'Hello World', deps: [] }]
      })
      class MyComponent4 {}

      const el = createComponent<MyComponent4, void>(MyComponent4);

      expect(el.componentInjector.get(TestToken)).toBe('Hello World');
    });
  });
});
