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
    class Injectable extends Base {
      constructor(..._: any[]) {
        super();

        injectables.set(this, new Injector(opts?.providers));
      }
    }

    // Only apply custom element bootstrap logic if the decorated class is an HTMLElement
    if ('HTMLElement' in globalThis) {
      if (HTMLElement.prototype.isPrototypeOf(Base.prototype)) {
        return injectableEl(Injectable, ctx);
      }
    }

    return Injectable;
  };
}
