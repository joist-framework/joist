import { SENTINAL, INJECTOR } from "../internal/symbols.js";
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
          const potentialSentinal = args.at(-1);

          // injectable classes should not be instantiated directly.
          // A sentinal value is passed as the last argument when the injector creates an instance of this class.
          // If the sentinal value is not present, then we know this class is being instantiated directly and we can throw an error.
          // HTMLElements MUST be instantiated by the browser and are allowed to be instantiated directly.
          if (potentialSentinal !== SENTINAL && !isHTMLELementBase) {
            throw new Error(
              `Cannot construct an instance of ${Base.name} directly. Use the injector instead.`,
            );
          }

          const finalArgs = args.slice(0, -1); // remove sentinal from arguments list before passing to the decorated class

          super(...finalArgs);

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
