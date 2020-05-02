import { Injector, Service, Inject } from '@joist/di';
import { html } from 'lit-html';

import { bootstrapEnvironment, getEnvironmentRef, clearEnvironment } from './environment';
import { defineElement, ElementInstance } from './define_element';
import { Component } from './component';

describe('environment', () => {
  afterEach(() => {
    clearEnvironment();
  });

  it('should create a global Injector instance', () => {
    bootstrapEnvironment();

    expect(getEnvironmentRef() instanceof Injector).toBe(true);
  });

  it('should use the root injector when creating components', () => {
    @Service()
    class MyService {}

    @Component({
      render: () => html``,
    })
    class MyComponent {
      constructor(@Inject(MyService) public myService: MyService) {}
    }

    customElements.define('environment-1', defineElement(MyComponent));

    bootstrapEnvironment();

    const el = document.createElement('environment-1') as ElementInstance<any>;

    expect(el.componentInstance.myService).toBe(getEnvironmentRef()!.get(MyService));
  });
});
