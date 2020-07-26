import { Injector, service } from '@joist/di';

import { defineEnvironment, getEnvironmentRef, clearEnvironment } from './environment';
import { get, JoistElement } from './element';

describe('environment', () => {
  afterEach(() => {
    clearEnvironment();
  });

  it('should create a global Injector instance', () => {
    defineEnvironment();

    expect(getEnvironmentRef() instanceof Injector).toBe(true);
  });

  it('should use the root injector when creating services', () => {
    @service()
    class MyService {}

    class MyElement extends JoistElement {
      @get(MyService) myService!: MyService;
    }

    customElements.define('environment-1', MyElement);

    defineEnvironment();

    const el = document.createElement('environment-1') as MyElement;

    expect(el.myService).toBe(getEnvironmentRef()!.get(MyService));
  });
});
