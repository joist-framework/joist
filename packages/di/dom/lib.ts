import { ProviderToken, Injector } from '@joist/di';

import { getEnvironmentRef } from './environment';

export const ROOT_ATTR = '__joist__injector__root__';

export interface InjectorBase {
  injector: Injector;
}

/**
 * Takes an InjectionToken and resolves that token to a service
 */
export function get<T>(token: ProviderToken<T>) {
  return function (target: InjectorBase, key: string) {
    Object.defineProperty(target, key, {
      get(this: InjectorBase) {
        return this.injector.get(token);
      },
    });
  };
}

/**
 * Mixin that applies an injector to a base class
 */
export function JoistDi<T extends new (...args: any[]) => HTMLElement>(Base: T) {
  return class Injected extends Base implements InjectorBase {
    public injector: Injector = new Injector({}, getEnvironmentRef());

    connectedCallback() {
      if (!!super.connectedCallback) {
        super.connectedCallback();
      }

      const parent = this.parentElement?.closest<InjectorBase & HTMLElement>(`[${ROOT_ATTR}]`);

      if (parent && parent.injector) {
        this.injector.parent = parent.injector;
      }
    }
  };
}
