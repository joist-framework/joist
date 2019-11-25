import { Injector, Service, Inject } from '@lit-kit/di';

import { bootstrapApplication, getApplicationRef, clearApplication } from './app';
import { Component } from './component';
import { html } from 'lit-html';
import { createComponent } from './create-component';

describe('app', () => {
  afterEach(() => {
    clearApplication();
  });

  it('should be null by default', () => {
    expect(getApplicationRef()).toBe(undefined);
  });

  it('should create a global Injector instance', () => {
    bootstrapApplication();

    expect(getApplicationRef() instanceof Injector).toBe(true);
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

    bootstrapApplication();

    const el = createComponent(MyComponent);

    expect(el.componentInstance.myService).toBe(getApplicationRef()!.get(MyService));
  });
});
