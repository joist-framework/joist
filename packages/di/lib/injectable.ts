import { getEnvironmentRef } from './environment';
import { Injector } from './injector';
import { Provider, ProviderToken } from './provider';

export interface Injectable {
  deps: ProviderToken<any>[];
  providers?: Provider<any>[];

  new (...args: any[]): any;
}

export function injectable<T extends Injectable>(Clazz: T) {
  const { deps, providers } = Clazz;

  return class InjectableElement extends Clazz {
    constructor(...args: any[]) {
      if (args.length || !deps.length) {
        super(...args);
      } else {
        const i = new Injector({ providers }, getEnvironmentRef());

        super(...deps.map((dep) => i.get(dep)));
      }
    }
  };
}
