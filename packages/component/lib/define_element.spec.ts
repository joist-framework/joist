import { Injector } from '@joist/di';

import { defineElement, ElementInstance } from './define_element';
import { Prop } from './prop';
import { Handle } from './handle';
import { Component } from './component';

describe('defineElement', () => {
  describe('creation', () => {
    @Component({ template: () => '' })
    class MyComponent {}

    customElements.define('create-1', defineElement(MyComponent));

    it('should create a componentInjector property', () => {
      const el = document.createElement('create-1') as ElementInstance<MyComponent>;

      expect(el.componentInjector instanceof Injector).toBe(true);
    });

    it('should create a componentInstance property', () => {
      const el = document.createElement('create-1') as ElementInstance<MyComponent>;

      expect(el.componentInstance instanceof MyComponent).toBe(true);
    });
  });

  describe('props', () => {
    @Component({ template: () => '' })
    class MyComponent {
      @Prop() foo: string = 'Hello World';
    }

    customElements.define('props-1', defineElement(MyComponent));

    it('should use the value from the componentInstance when getting a property value from the custom element', () => {
      const el = document.createElement('props-1') as ElementInstance<MyComponent>;

      expect(el.componentInstance.foo).toBe('Hello World');
      expect(el.foo).toBe('Hello World');
    });

    it('should set componentInstance props when they are set on the custom element', () => {
      const el = document.createElement('props-1') as ElementInstance<MyComponent>;

      el.foo = 'Hello World - 2';

      expect(el.componentInstance.foo).toBe('Hello World - 2');
    });

    it('should call onPropChanges', (done) => {
      const el = document.createElement('props-1') as ElementInstance<MyComponent>;

      el.componentInstance.onPropChanges = () => {
        expect(el.componentInstance.foo).toBe('Hello World');

        done();
      };

      el.foo = 'Hello World';
    });
  });

  describe('handlers', () => {
    it('should call a function if the trigger is mapped to a class method', (done) => {
      @Component({
        template({ run }) {
          const el = document.createElement('button');

          el.onclick = run('TEST_RUN', 'Hello World');

          return el;
        },
      })
      class MyComponent {
        @Handle('TEST_RUN') onTestRun(e: Event, payload: string) {
          expect(e instanceof Event).toBe(true);
          expect(payload).toBe('Hello World');

          done();
        }
      }

      customElements.define('handlers-1', defineElement(MyComponent));

      const el = document.createElement('handlers-1') as ElementInstance<MyComponent>;

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();
    });

    it('should handle multiple functions', (done) => {
      let doneCounter = 0;

      @Component({
        template({ run }) {
          const el = document.createElement('button');

          el.onclick = run('TEST_RUN', 'Hello World');

          return el;
        },
      })
      class MyComponent {
        @Handle('TEST_RUN') onTestRun(e: Event, payload: string) {
          expect(e instanceof Event).toBe(true);
          expect(payload).toBe('Hello World');

          doneCounter++;
        }

        @Handle('TEST_RUN') onTestRun2(e: Event, payload: string) {
          expect(e instanceof Event).toBe(true);
          expect(payload).toBe('Hello World');

          doneCounter++;

          expect(doneCounter).toBe(2);

          done();
        }
      }

      customElements.define('handlers-2', defineElement(MyComponent));

      const el = document.createElement('handlers-2') as ElementInstance<MyComponent>;

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();
    });
  });

  describe('dispatch', () => {
    it('should dispatch and event using Ctx.dispatch', (done) => {
      @Component({
        template({ dispatch }) {
          const el = document.createElement('button');

          el.onclick = dispatch('TEST_DISPATCH', 'Hello World');

          return el;
        },
      })
      class MyComponent {}

      customElements.define('dispatch1-1', defineElement(MyComponent));

      const el = document.createElement('dispatch1-1') as ElementInstance<MyComponent>;

      el.addEventListener('TEST_DISPATCH', (e) => {
        const event = e as CustomEvent<string>;

        expect(event.detail).toBe('Hello World');

        done();
      });

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();
    });
  });

  describe('providers', () => {
    it('should allow component specific services to be provided', () => {
      class TestToken {}

      @Component({
        template: () => '',
        providers: [{ provide: TestToken, useFactory: () => 'Hello World', deps: [] }],
      })
      class MyComponent {}

      customElements.define('providers-1', defineElement(MyComponent));

      const el = document.createElement('providers-1') as ElementInstance<MyComponent>;

      expect(el.componentInjector.get(TestToken)).toBe('Hello World');
    });
  });

  describe('shadowDom', () => {
    it('should NOT use shadow dom by default', () => {
      @Component({ template: () => 'Hello World' })
      class MyComponent {}

      customElements.define('shadowdom-1', defineElement(MyComponent));

      const el = document.createElement('shadowdom-1') as ElementInstance<MyComponent>;

      el.connectedCallback();

      expect(el.shadowRoot).toBeNull();
    });

    it('should use shadow dom if specified', () => {
      @Component({
        template: () => 'Hello World',
        useShadowDom: true,
      })
      class MyComponent {}

      customElements.define('shadowdom-2', defineElement(MyComponent));

      const el = document.createElement('shadowdom-2') as ElementInstance<MyComponent>;

      el.connectedCallback();

      expect(el.shadowRoot).toBeDefined();
    });
  });

  describe('built ins', () => {
    it('should extend a built in element', () => {
      @Component({ template: () => 'Hello World' })
      class MyComponent {}

      customElements.define(
        'built-ins-1',
        defineElement(MyComponent, { extends: HTMLInputElement }),
        { extends: 'input' }
      );

      const el = document.createElement('input', { is: 'built-ins-1' });

      expect(el instanceof HTMLInputElement).toBe(true);
      expect('componentInstance' in el).toBe(true);
    });
  });
});
