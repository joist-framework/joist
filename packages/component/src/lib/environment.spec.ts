import { Injector, Service, Inject } from '@lit-kit/di';

import { bootstrapEnvironment, getEnvironmentRef, clearEnvironment } from './environment';
import { defineComponent, ElementInstance } from './component';
import { html } from 'lit-html';

describe('environment', () => {
  afterEach(() => {
    clearEnvironment();
  });

  it('should be null by default', () => {
    expect(getEnvironmentRef()).toBe(undefined);
  });

  it('should create a global Injector instance', () => {
    bootstrapEnvironment();

    expect(getEnvironmentRef() instanceof Injector).toBe(true);
  });

  it('should use the root injector when creating components', () => {
    @Service()
    class MyService {}

    class MyComponent {
      constructor(@Inject(MyService) public myService: MyService) {}
    }

    customElements.define('environment-1', defineComponent({
      template() {
        return html``;
      }
    }, MyComponent));


    bootstrapEnvironment();

    const el = document.createElement('environment-1') as ElementInstance<any>;

    expect(el.componentInstance.myService).toBe(getEnvironmentRef()!.get(MyService));
  });
});
