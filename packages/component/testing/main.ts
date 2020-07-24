import { Component, getComponentDef, JoistElement } from '@joist/component';
import { Injector, Provider } from '@joist/di';

export interface TestEnvironment {
  create<T extends JoistElement>(El: { [key: string]: any; new (...args: any[]): T }): T;
  reset(): void;
}

export function defineTestEnvironment(providers: Provider<any>[] = []): TestEnvironment {
  let parent = new Injector({ providers });

  return {
    create<T extends JoistElement>(El: { [key: string]: any; new (...args: any[]): T }) {
      const componentDef = getComponentDef(El);

      const Base = (El as unknown) as CustomElementConstructor;

      @Component({
        ...componentDef,
        tagName: componentDef.tagName ? componentDef.tagName + '-testing' : undefined,
        parent,
      })
      class TestingElement extends Base {}

      return Reflect.construct(TestingElement, []) as T;
    },
    reset() {
      parent = new Injector({ providers });
    },
  };
}
