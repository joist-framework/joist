import { Injector, Service, Inject } from '@lit-kit/di';

import { bootstrapEnvironment, getEnvironmentRef, clearEnvironment } from './environment';
import { Component } from './component';
import { html } from 'lit-html';
import { createComponent } from './create-component';

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

    @Component({
      tag: 'my-component',
      initialState: {},
      template() {
        return html``;
      }
    })
    class MyComponent {
      constructor(@Inject(MyService) public myService: MyService) {}
    }

    bootstrapEnvironment();

    const el = createComponent(MyComponent);

    expect(el.componentInstance.myService).toBe(getEnvironmentRef()!.get(MyService));
  });
});
