import { Injector, Service, Inject } from '@lit-kit/di';

import { bootstrapApplication, ROOT_INJECTOR, clearApplication } from './app';
import { Component } from './component';
import { html } from 'lit-html';
import { createComponent } from './create-component';

describe('app', () => {
  afterEach(() => {
    clearApplication();
  });

  it('should be null by default', () => {
    expect(ROOT_INJECTOR).toBe(undefined);
  });

  it('should create a global Injector instance', () => {
    bootstrapApplication();

    expect(ROOT_INJECTOR instanceof Injector).toBe(true);
  });

  it('should use the root injector when creating components', () => {
    bootstrapApplication();

    @Service()
    class MyService {}

    @Component({
      tag: 'my-component',
      defaultState: {},
      template() {
        return html``;
      }
    })
    class MyComponent {
      constructor(@Inject(MyService) public myService: MyService) {}
    }

    const el = createComponent(MyComponent);

    expect(el.componentInstance.myService).toBe(ROOT_INJECTOR!.get(MyService));
  });
});
