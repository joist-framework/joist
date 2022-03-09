import { getEnvironmentRef } from './environment';
import { Injector } from './injector';
import { Provider, ProviderToken } from './provider';

export interface Injectable {
  inject: ProviderToken<any>[];
  providers?: Provider<any>[];

  new (...args: any[]): any;
}

export function injectable<T extends Injectable>(Clazz: T) {
  const { inject, providers } = Clazz;

  return class InjectableElement extends Clazz {
    constructor(...args: any[]) {
      if (args.length || !inject.length) {
        super(...args);
      } else {
        const i = new Injector({ providers }, getEnvironmentRef());

        super(...inject.map((dep) => i.get(dep)));
      }
    }
  };
}
