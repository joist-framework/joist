import { Injector, Provider, readProviderDeps } from '@joist/di';

import { getEnvironmentRef } from './environment';

export interface InjectorBase {
  injector: Injector;
}

export interface InjectableConfig {
  providers: Provider<any>[];
}

export function injectable({ providers }: InjectableConfig = { providers: [] }) {
  return <T extends HTMLElement>(CE: new (...args: any[]) => T) => {
    return new Proxy(CE, {
      construct(a, b, c) {
        if (b.length) {
          return Reflect.construct(a, b, c);
        }

        const injector = new Injector({ providers }, getEnvironmentRef());
        const deps = readProviderDeps(CE).map((dep) => injector.get(dep));

        return Reflect.construct(a, deps, c);
      },
    });
  };
}
