import { expect } from '@open-wc/testing';

import { Injector, Injected } from './injector.js';
import { service } from './service.js';
import { environment, clearEnvironment } from './environment.js';
import { injectable } from './injectable.js';

describe('environment', () => {
  afterEach(clearEnvironment);

  it('should create a global Injector instance', () => {
    expect(environment()).to.be.instanceOf(Injector);
  });

  it('should use the root injector when creating services', () => {
    @service
    class MyService {}

    @injectable
    class MyElement extends HTMLElement {
      static inject = [MyService];

      constructor(public my: Injected<MyService>) {
        super();
      }
    }

    customElements.define('env-1', MyElement);

    const el = document.createElement('env-1') as MyElement;

    expect(el.my()).to.equal(environment().get(MyService));
  });
});
