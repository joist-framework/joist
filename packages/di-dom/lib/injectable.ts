import { Injector, Provider, readProviderDeps } from '@joist/di';

import { getEnvironmentRef } from './environment';

export interface InjectorBase {
  injector: Injector;
}

export interface InjectableConfig {
  providers: Provider<any>[];
}

export type Injectable = {
  [key: string | symbol]: any;
  new (...args: any[]): HTMLElement;
};

export function injectable({ providers }: InjectableConfig = { providers: [] }) {
  return <T extends Injectable>(CE: T) => {
    return class InjectableElement extends CE {
      constructor(...args: any[]) {
        if (args.length) {
          super(...args);
        } else {
          const injector = new Injector({ providers }, getEnvironmentRef());
          const deps = readProviderDeps(CE).map((dep) => injector.get(dep));

          super(...deps);
        }
      }
    };
  };
}
