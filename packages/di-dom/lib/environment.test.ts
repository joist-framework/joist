import { expect } from '@open-wc/testing';
import { Injector } from '@joist/di';
import { inject, service } from '@joist/di/decorators';

import { getEnvironmentRef, clearEnvironment } from './environment';
import { injectable } from './injectable';

describe('environment', () => {
  afterEach(clearEnvironment);

  it('should create a global Injector instance', () => {
    expect(getEnvironmentRef()).to.be.instanceOf(Injector);
  });

  it('should use the root injector when creating services', () => {
    @service()
    class MyService {}

    @injectable()
    class MyElement extends HTMLElement {
      constructor(@inject(MyService) public my: MyService) {
        super();
      }
    }

    customElements.define('env-1', MyElement);

    const el = document.createElement('env-1') as MyElement;

    expect(el.my).to.equal(getEnvironmentRef().get(MyService));
  });
});
