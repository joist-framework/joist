import { Injector, ProviderToken } from '@joist/di';

import { getEnvironmentRef } from './environment';
import { State } from './state';
import { getComponentDef, RenderCtx } from './component';
import { getComponentHandlers } from './handle';
import { Lifecycle } from './lifecycle';

export interface InjectorBase {
  readonly injector: Injector;
}

export function Get<T>(token: ProviderToken<T>) {
  return function (target: InjectorBase, key: string) {
    Object.defineProperty(target, key, {
      get() {
        return this.injector.get(token);
      },
    });
  };
}

export class JoistElement extends HTMLElement implements InjectorBase, Lifecycle {
  public injector: Injector;

  private componentDef = getComponentDef<any>(this.constructor);

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
    const state = this.injector.get(State);

    const ctx: RenderCtx<any> = {
      state: state.value,
      run: (eventName: string, payload: unknown) => (e: Event) => {
        if (eventName in handlers) {
          handlers[eventName].forEach((methodName) => {
            // eww
            ((this[methodName as keyof this] as any) as Function).call(this, e, payload);
          });
        }
      },
      dispatch: (eventName: string, init?: CustomEventInit) => () => {
        this.dispatchEvent(new CustomEvent(eventName, init));
      },
      host: this,
    };

    const componentRender = (state: any) => {
      ctx.state = state;

      if (this.componentDef.render) {
        this.componentDef.render(ctx);
      }
    };

    componentRender(state.value);

    state.onChange((state) => {
      componentRender(state);
    });
  }
}
