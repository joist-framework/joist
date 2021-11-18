import { Injector, Provider } from '@joist/di';

import { getEnvironmentRef } from './environment';

export const ROOT_ATTR = '__joist__injector__';

export interface InjectorBase {
  injector: Injector;
}

export interface JoistDiConfig {
  providers: Provider<any>[];
}

/**
 * Mixin that applies an injector to a base class
 */
export function JoistDi<T extends new (...args: any[]) => HTMLElement>(
  Base: T,
  { providers }: JoistDiConfig = { providers: [] }
) {
  return class Injected extends Base implements InjectorBase {
    injector: Injector;

    constructor(..._: any[]) {
      super();

      this.injector = new Injector({ providers }, getEnvironmentRef());

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
        this.injector.setParent(parent.injector);
      }
    }

    disconnectedCallback() {
      if (!!super.disconnectedCallback) {
        super.disconnectedCallback();
      }

      this.injector.setParent(undefined);
    }
  };
}
