import { Injector, Service } from '@joist/di';

import { bootstrapEnvironment, getEnvironmentRef, clearEnvironment } from './environment';
import { Get, JoistElement } from './element';

describe('environment', () => {
  afterEach(() => {
    clearEnvironment();
  });

  it('should create a global Injector instance', () => {
    bootstrapEnvironment();

    expect(getEnvironmentRef() instanceof Injector).toBe(true);
  });

  it('should use the root injector when creating services', () => {
    @Service()
    class MyService {}

    class MyElement extends JoistElement {
      @Get(MyService) public myService!: MyService;
    }

    customElements.define('environment-1', MyElement);

    bootstrapEnvironment();

    const el = document.createElement('environment-1') as MyElement;

    expect(el.myService).toBe(getEnvironmentRef()!.get(MyService));
  });
});
