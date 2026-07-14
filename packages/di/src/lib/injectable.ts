import { INJECTOR } from "./symbols.js";
import { injectableEl } from "./dom/injectable-el.js";
import { Injector } from "./injector.js";
import { type InjectableMetadata, isCreationContext } from "./metadata.js";
import type { ConstructableToken, InjectionToken, Provider } from "./provider.js";
import { InjectableCreationFailedError, InstantiatedDirectlyError } from "./errors.js";

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
          const creationContext = args.at(-1);
          const isFromInjector = isCreationContext(creationContext);

          // injectable classes should not be instantiated directly.
          // A creation context containing the sentinel is passed as the last argument when the injector creates an instance of this class.
          // If the sentinel is not present, then we know this class is being instantiated directly and we can throw an error.
          // HTMLElements MUST be instantiated by the browser and are allowed to be instantiated directly.
          if (!isFromInjector && !isHTMLELementBase) {
            throw new InstantiatedDirectlyError(
              `Cannot construct an instance of ${Base.name} directly. Use the injector instead.`,
            );
          }

          const finalArgs = isFromInjector ? args.slice(0, -1) : args;

          super(...finalArgs);

          const parentInjector = isFromInjector ? creationContext.injector : undefined;

          // Allocate an injector ONLY if this service defines its own local overrides/providers or self provisions
          if (opts?.providers || opts?.provideSelfAs) {
            this[INJECTOR] = new Injector(opts);

            if (opts.provideSelfAs) {
              for (const token of opts.provideSelfAs) {
                this[INJECTOR].providers.set(token, { value: this });
              }
            }
          } else {
            // Share the parent injector directly, or fallback to a new injector
            this[INJECTOR] = parentInjector || new Injector(opts);
          }
        }
      },
    };

    const injectableBase = def[Base.name];

    if (!injectableBase) {
      throw new InjectableCreationFailedError(`Failed to create injectable class for ${Base.name}`);
    }

    // Only apply custom element bootstrap logic if the decorated class is an HTMLElement

    if (isHTMLELementBase) {
      return injectableEl(injectableBase, ctx);
    }

    return injectableBase;
  };
}
