(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import { ConstructableToken, Provider } from './provider.js';
import { injectables, Injector } from './injector.js';
import { injectableEl } from './injectable-el.js';

export interface InjectableOpts {
  providers?: Provider<unknown>[];
}

export function injectable(opts?: InjectableOpts) {
  return function injectableDecorator<T extends ConstructableToken<any>>(
    Base: T,
    ctx: ClassDecoratorContext
  ) {
    const def = {
      [Base.name]: class extends Base {
        constructor(...args: any[]) {
          super(...args);

          const injector = new Injector(opts?.providers);

          injector.providers.push({
            provide: Injector,
            factory: () => injector
          });

          injectables.set(this, injector);
        }
      }
    };

    // Only apply custom element bootstrap logic if the decorated class is an HTMLElement
    if ('HTMLElement' in globalThis) {
      if (HTMLElement.prototype.isPrototypeOf(Base.prototype)) {
        return injectableEl(def[Base.name], ctx);
      }
    }

    return def[Base.name];
  };
}
