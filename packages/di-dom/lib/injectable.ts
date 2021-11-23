import { Injector, Provider, readProviderDeps } from '@joist/di';

import { getEnvironmentRef } from './environment';

export interface InjectorBase {
  injector: Injector;
}

export interface InjectableConfig {
  providers: Provider<any>[];
}

export interface Injectable {
  [key: string | symbol]: any;
  new (...args: any[]): HTMLElement;
}

export function injectable({ providers }: InjectableConfig = { providers: [] }) {
  return <T extends Injectable>(Ce: T) => {
    return class InjectableElement extends Ce {
      constructor(...args: any[]) {
        if (args.length) {
          super(...args);
        } else {
          const i = new Injector({ providers }, getEnvironmentRef());
          const deps = readProviderDeps(Ce).map((dep) => i.get(dep));

          super(...deps);
        }
      }
    };
  };
}
