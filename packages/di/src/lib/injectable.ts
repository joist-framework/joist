(Symbol as any).metadata ??= Symbol("Symbol.metadata");

import { injectableEl } from "./injectable-el.js";
import { Injector, injectables } from "./injector.js";
import type {
  ConstructableToken,
  InjectionToken,
  Provider,
} from "./provider.js";

export interface InjectableOpts {
  name?: string;
  providers?: Iterable<Provider<any>>;
  provideSelfAs?: InjectionToken<any>[];
}

export function injectable(opts?: InjectableOpts) {
  return function injectableDecorator<T extends ConstructableToken<any>>(
    Base: T,
    ctx: ClassDecoratorContext,
  ): T {
    const def = {
      [Base.name]: class extends Base {
        constructor(...args: any[]) {
          super(...args);

          const injector = new Injector(opts);

          injector.providers.set(Injector, {
            factory: () => injector,
          });

          if (opts?.provideSelfAs) {
            for (const token of opts.provideSelfAs) {
              injector.providers.set(token, {
                factory: () => this,
              });
            }
          }

          injectables.set(this, injector);
        }
      },
    };

    // Only apply custom element bootstrap logic if the decorated class is an HTMLElement
    if ("HTMLElement" in globalThis) {
      if (
        Object.prototype.isPrototypeOf.call(
          HTMLElement.prototype,
          Base.prototype,
        )
      ) {
        return injectableEl(def[Base.name], ctx);
      }
    }

    return def[Base.name];
  };
}
