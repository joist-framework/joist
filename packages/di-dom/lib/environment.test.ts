import { expect } from '@open-wc/testing';
import { Injector } from '@joist/di';
import { service } from '@joist/di/decorators';

import { getEnvironmentRef, clearEnvironment } from './environment';
import { WithInjector } from './injector';
import { get } from '../decorators';

describe('environment', () => {
  afterEach(clearEnvironment);

  it('should create a global Injector instance', () => {
    expect(getEnvironmentRef()).to.be.instanceOf(Injector);
  });

  it('should use the root injector when creating services', () => {
    @service()
    class MyService {}

    class MyElement extends WithInjector(HTMLElement) {
      @get(MyService) my!: MyService;
    }

    customElements.define('environment-1', MyElement);

    const el = new MyElement();

    expect(el.my).to.equal(getEnvironmentRef().get(MyService));
  });
});
