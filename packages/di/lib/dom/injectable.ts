import { getEnvironmentRef } from './environment';
import { Injector } from '../injector';
import { Provider } from '../provider';
import { readProviderDeps } from '../utils';

export interface InjectableConfig {
  providers: Provider<any>[];
}

export interface Injectable {
  [key: string | symbol]: any;
  new (...args: any[]): HTMLElement;
}

export function injectable({ providers }: InjectableConfig = { providers: [] }) {
  return <T extends Injectable>(CustomElement: T) => {
    return class InjectableElement extends CustomElement {
      constructor(...args: any[]) {
        if (args.length) {
          super(...args);
        } else {
          const i = new Injector({ providers }, getEnvironmentRef());
          const deps = readProviderDeps(CustomElement).map((dep) => i.get(dep));

          super(...deps);
        }
      }
    };
  };
}
