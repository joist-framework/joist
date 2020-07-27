import { component, JoistElement } from '@joist/component';
import { Injector, ProviderToken, Provider } from '@joist/di';

export interface TestEnvironment {
  createElement<T extends JoistElement>(c: new () => T): T;
  get<T>(token: ProviderToken<T>): T;
}

export function defineTestEnvironment(providers: Provider<any>[]) {
  const parent = new Injector({ providers });
  const tagName = `testbed-${Date.now()}-${Math.random().toString().replace('.', '')}`;

  @component({ tagName })
  class TestBed extends JoistElement {}

  const host = new TestBed();

  document.body.appendChild(host);

  return {
    createElement<T extends JoistElement>(c: new () => T): T {
      const el = new c();

      host.appendChild(el);

      return el;
    },
    get<T>(token: ProviderToken<T>) {
      return parent.get(token);
    },
  };
}
