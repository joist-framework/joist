import { Injector, ProviderToken } from '@joist/di';

import { getEnvironmentRef } from './environment';
import { State } from './state';
import { getComponentDef, RenderCtx } from './component';
import { getComponentHandlers } from './handle';
import { Lifecycle } from './lifecycle';

export interface InjectorBase {
  injector: Injector;
}

export function get<T>(token: ProviderToken<T>) {
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
  private handlers = getComponentHandlers(this.constructor);

  constructor() {
    super();

    const state = this.componentDef.state;
    const providers = this.componentDef.providers || [];

    class ComponentState extends State<any> {
      constructor() {
        super(state);
      }
    }

    this.injector = new Injector(
      {
        providers: [...providers, { provide: State, use: ComponentState }],
        bootstrap: providers.map((p) => p.provide),
      },
      getEnvironmentRef()
    );

    if (this.componentDef.shadowDom) {
      this.attachShadow({ mode: this.componentDef.shadowDom });
    }
  }

  connectedCallback() {
    const state = this.injector.get(State);

    const ctx: RenderCtx<any> = {
      state: state.value,
      run: (eventName: string, payload: unknown) => (e: Event) => {
        if (eventName in this.handlers) {
          this.handlers[eventName].forEach((methodName) => {
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

  // private getParentInjector() {
  //   let parent: JoistElement | null = null;

  //   if (this.parentElement) {
  //     parent = this.parentElement.closest('[__joist-component__]');
  //   }

  //   return parent ? parent.injector : getEnvironmentRef();
  // }
}
