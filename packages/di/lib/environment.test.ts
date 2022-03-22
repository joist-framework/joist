import { expect } from '@open-wc/testing';

import { getEnvironmentRef, clearEnvironment } from './environment';
import { injectable, Injected } from './injectable';
import { Injector } from './injector';
import { service } from './service';

describe('environment', () => {
  afterEach(clearEnvironment);

  it('should create a global Injector instance', () => {
    expect(getEnvironmentRef()).to.be.instanceOf(Injector);
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

    expect(el.my()).to.equal(getEnvironmentRef().get(MyService));
  });
});
