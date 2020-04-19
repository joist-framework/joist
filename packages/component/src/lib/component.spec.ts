import { Injector } from '@lit-kit/di';
import { html } from 'lit-html';

import { defineComponent, ElementInstance } from './component';
import { State } from './state';
import { Prop } from './prop';
import { Handle } from './handle';

describe('Component', () => {
  describe('creation', () => {
    class MyComponent {}

    const MyElement = defineComponent({
      template: () => html`<h1>Hello World</h1>`
    }, MyComponent);

    customElements.define('create-1', MyElement);

    it('should create a componentInjector property', () => {
      const el = document.createElement('create-1') as ElementInstance<MyComponent>;

      expect(el.componentInjector instanceof Injector).toBe(true);
    });

    it('should create a componentInstance property', () => {
      const el = document.createElement('create-1') as ElementInstance<MyComponent>;

      expect(el.componentInstance instanceof MyComponent).toBe(true);
    });

    it('should create a componentState property', () => {
      const el = document.createElement('create-1') as ElementInstance<MyComponent>;

      expect(el.componentState instanceof State).toBe(true);
    });
  });

  describe('props', () => {
    class MyComponent {
      @Prop() foo: string = 'Hello World';
    }

    customElements.define('props-1', defineComponent({
      template: () => html`<h1>Hello World</h1>`
    }, MyComponent));

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
  });

  describe('handlers', () => {
    it('should call a function if the trigger is mapped to a class method', done => {
      class MyComponent {
        @Handle('TEST_RUN') onTestRun(e: Event, payload: string) {
          expect(e instanceof Event).toBe(true);
          expect(payload).toBe('Hello World');

          done();
        }
      }

      customElements.define('handlers-1', defineComponent({
        useShadowDom: false,
        template(_, run) {
          return html`
            <button @click=${run('TEST_RUN', 'Hello World')}>click</button>
          `;
        }
      }, MyComponent));

      const el = document.createElement('handlers-1') as ElementInstance<any>;

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();
    });
  });

  describe('providers', () => {
    it('should allow component specific services to be provided', () => {
      class TestToken {}

      customElements.define('providers-1', defineComponent({
        template: () => void 0,
        use: [{ provide: TestToken, useFactory: () => 'Hello World', deps: [] }]
      }, class {}));

      const el = document.createElement('providers-1') as ElementInstance<any>;

      expect(el.componentInjector.get(TestToken)).toBe('Hello World');
    });
  });

  describe('shadowDom', () => {
    it('should NOT use shadow dom by default', () => {
      customElements.define('shadowdom-1', defineComponent({
        template: () => html``
      }, class {}));

      const el = document.createElement('shadowdom-1') as ElementInstance<any>;

      el.connectedCallback();

      expect(el.shadowRoot).toBeNull();
    });

    it('should use shadow dom if specified', () => {
      customElements.define('shadowdom-2', defineComponent({
        useShadowDom: true,
        template: () => html``
      }, class {}));

      const el = document.createElement('shadowdom-2') as ElementInstance<any>;

      el.connectedCallback();

      expect(el.shadowRoot).toBeDefined();
    });
  });
});
