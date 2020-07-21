import { Injector, ProviderToken } from '@joist/di';

import { getEnvironmentRef } from './environment';
import { State } from './state';
import { getComponentDef } from './component';
import { getComponentHandlers } from './handle';
import { Lifecycle } from './lifecycle';

export function Get<T>(token: ProviderToken<T>) {
  return function (target: JoistElement, key: string) {
    Object.defineProperty(target, key, {
      get() {
        return this.injector.get(token);
      },
    });
  };
}

export interface InjectorBase {
  readonly injector: Injector;
}

export class JoistElement extends HTMLElement implements InjectorBase, Lifecycle {
  public readonly injector: Injector;
  private readonly componentDef = getComponentDef<any>(this.constructor);

  constructor() {
    super();

    const state = this.componentDef.state;
    const providers = this.componentDef.providers || [];

    this.injector = new Injector(
      {
        providers: providers.concat([
          {
            provide: State,
            use: class extends State<any> {
              constructor() {
                super(state);
              }
            },
          },
        ]),
        bootstrap: providers.map((p) => p.provide),
      },
      getEnvironmentRef()
    );
  }

  connectedCallback() {
    const handlers = getComponentHandlers(this.constructor);

    const run = (eventName: string, payload: unknown) => (e: Event) => {
      if (eventName in handlers) {
        handlers[eventName].forEach((methodName) => {
          // eww
          ((this[methodName as keyof this] as any) as Function).call(this, e, payload);
        });
      }
    };

    const dispatch = (eventName: string, init?: CustomEventInit) => () => {
      this.dispatchEvent(new CustomEvent(eventName, init));
    };

    const componentRender = (state: any) => {
      if (this.componentDef.render) {
        this.componentDef.render({ state, run, dispatch, host: this });
      }
    };

    componentRender(this.injector.get(State).value);

    this.injector.get(State).onChange((state) => {
      componentRender(state);
    });
  }
}
