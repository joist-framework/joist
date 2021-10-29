import { ProviderToken, Injector, Provider } from '@joist/di';

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

export interface JoistDiConfig {
  providers: Provider<any>[];
}

/**
 * Mixin that applies an injector to a base class
 */
export function JoistDi<T extends new (...args: any[]) => HTMLElement>(
  Base: T,
  config: JoistDiConfig = { providers: [] }
) {
  return class Injected extends Base implements InjectorBase {
    public injector: Injector = new Injector({ providers: config.providers }, getEnvironmentRef());

    constructor(..._: any[]) {
      super();

      this.setAttribute(ROOT_ATTR, 'true');
    }

    connectedCallback() {
      if (!!super.connectedCallback) {
        super.connectedCallback();
      }

      let parent: (InjectorBase & HTMLElement) | null | undefined;

      if (this.parentElement) {
        this.parentElement.closest(`[${ROOT_ATTR}]`);
      }

      if (parent && parent.injector) {
        this.injector.parent = parent.injector;
      }
    }

    disconnectedCallback() {
      if (!!super.disconnectedCallback) {
        super.disconnectedCallback();
      }

      this.injector.parent = undefined;
    }
  };
}
