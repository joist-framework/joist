import { Injector, service } from '@joist/di';
import { expect } from '@open-wc/testing';

import { getEnvironmentRef, clearEnvironment } from './environment';
import { get, JoistElement } from './element';
import { component } from './component';

describe('environment', () => {
  afterEach(clearEnvironment);

  it('should create a global Injector instance', () => {
    expect(getEnvironmentRef()).to.be.instanceOf(Injector);
  });

  it('should use the root injector when creating services', () => {
    @service()
    class MyService {}

    @component({
      tagName: 'environment-1',
    })
    class MyElement extends JoistElement {
      @get(MyService) myService!: MyService;
    }

    const el = new MyElement();

    expect(el.myService).to.equal(getEnvironmentRef().get(MyService));
  });
});
