import { INJECTABLE, INJECTOR } from "../internal/symbols.js";
import { injectableEl } from "./dom/injectable-el.js";
import { Injector } from "./injector.js";
import { type InjectableMetadata } from "./metadata.js";
import type { ConstructableToken, InjectionToken, Provider } from "./provider.js";

export interface InjectableOpts {
  name?: string;
  providers?: Iterable<Provider<any>>;
  provideSelfAs?: InjectionToken<any>[];
  service?: boolean;
}

export function injectable(opts?: InjectableOpts) {
  return function injectableDecorator<T extends ConstructableToken<any>>(
    Base: T,
    ctx: ClassDecoratorContext,
  ): T {
    const metadata: InjectableMetadata<T> = ctx.metadata;
    metadata.service = opts?.service;

    const isHTMLELementBase =
      "HTMLElement" in globalThis &&
      Object.prototype.isPrototypeOf.call(HTMLElement.prototype, Base.prototype);

    const def = {
      [Base.name]: class extends Base {
        [INJECTOR]: Injector;

        constructor(...args: any[]) {
          // injectable classes should not be instantiated direction.
          // HTMLElements MUST be instantiated by the browser.
          if (args[0] !== INJECTABLE && !isHTMLELementBase) {
            throw new Error(
              `The constructor of an injectable class cannot be called directly. Please use the injector to create an instance of ${Base.name}.`,
            );
          }

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

    const injectableBase = def[Base.name];

    if (!injectableBase) {
      throw new Error(`Failed to create injectable class for ${Base.name}`);
    }

    // Only apply custom element bootstrap logic if the decorated class is an HTMLElement

    if (isHTMLELementBase) {
      return injectableEl(injectableBase, ctx);
    }

    return injectableBase;
  };
}
