import { injectableEl } from "./injectable-el.js";
import { INJECTOR, Injector } from "./injector.js";
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
        [INJECTOR]: Injector;

        constructor(...args: any[]) {
          super(...args);

          this[INJECTOR] = new Injector(opts);

          this[INJECTOR].providers.set(Injector, {
            factory: () => this[INJECTOR],
          });

          if (opts?.provideSelfAs) {
            for (const token of opts.provideSelfAs) {
              this[INJECTOR].providers.set(token, {
                factory: () => this,
              });
            }
          }
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
