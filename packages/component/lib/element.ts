import { Injector, ProviderToken } from '@joist/di';

import { getEnvironmentRef } from './environment';
import { State } from './state';
import { getComponentDef, RenderCtx } from './component';
import { getComponentHandlers } from './handle';
import { Lifecycle, PropChange } from './lifecycle';

export interface InjectorBase {
  injector: Injector;
}

export interface PropChangeBase {
  propChangeQue: PropChange[];
  markedForCheck: boolean;
  onPropChanges(...changes: PropChange[]): void;
  quePropChange(change: PropChange): void;
}

/**
 * Takes an InjectionToken and resolves that token to a service
 */
export function get<T>(token: ProviderToken<T>) {
  return function (target: InjectorBase, key: string) {
    Object.defineProperty(target, key, {
      get() {
        return this.injector.get(token);
      },
    });
  };
}

/**
 * Mixin that applies an injector to a base class
 */
export function withInjector<T extends new (...args: any[]) => {}>(Base: T) {
  return class Injected extends Base implements InjectorBase {
    public injector: Injector = new Injector({}, getEnvironmentRef());
  };
}

/**
 * Mixin that applies an injector to a base class
 */
export function withPropChanges<T extends new (...args: any[]) => {}>(Base: T) {
  return class PropChanges extends Base implements PropChangeBase {
    propChangeQue: PropChange[] = [];
    markedForCheck: boolean = false;

    onPropChanges(..._: PropChange[]) {}

    /**
     * Adds a PropChange to the que.s
     * PropChanges resolves as a micro task once a promise is resolved.
     * This batches onPropChanges calls
     */
    quePropChange(propChange: PropChange) {
      this.propChangeQue.push(propChange);

      if (!this.markedForCheck) {
        this.markedForCheck = true;

        Promise.resolve().then(() => {
          this.onPropChanges(...this.propChangeQue);

          this.markedForCheck = false;
          this.propChangeQue = [];
        });
      }
    }
  };
}

const Base = withPropChanges(withInjector(HTMLElement));

/**
 * Base Element for Joist.
 *
 * Applies an Injector and sets up state and render pipeline.
 */
export class JoistElement extends Base implements Lifecycle {
  private componentDef = getComponentDef<any>(this.constructor); // read the component definition
  private handlers = getComponentHandlers(this.constructor); // read the component handlers

  // define the render context for the instance
  private renderCtx: RenderCtx = {
    state: this.componentDef.state,
    run: (name: string, payload: unknown) => (e: Event) => {
      this.notifyHandlers(e, payload, name);
    },
    dispatch: (eventName: string, init?: CustomEventInit) => () => {
      this.dispatchEvent(new CustomEvent(eventName, init));
    },
    host: this,
  };

  constructor() {
    super();

    const state = this.componentDef.state;
    const providers = this.componentDef.providers || [];

    class ComponentState extends State<any> {
      constructor() {
        super(state);
      }
    }

    const options = this.injector.options;

    options.providers = [...providers, { provide: State, use: ComponentState }];
    options.bootstrap = providers.map((p) => p.provide);

    if (this.componentDef.shadowDom) {
      this.attachShadow({ mode: this.componentDef.shadowDom });
    }
  }

  connectedCallback() {
    const state = this.injector.get(State);

    this.renderCtx.state = state.value;

    this.render(state.value);

    state.onChange(this.render.bind(this));
  }

  private render(state: any) {
    this.renderCtx.state = state;

    if (this.componentDef.render) {
      this.componentDef.render(this.renderCtx);
    }
  }

  private notifyHandlers(...args: [Event, any, string]) {
    const matches = this.handlers.filter((handler) => {
      if (handler.pattern instanceof RegExp) {
        return handler.pattern.test(args[2]);
      }

      return handler.pattern === args[2];
    });

    matches.forEach((handler) => {
      const key = handler.key as keyof this;
      const fn = (this[key] as any) as Function;

      fn.apply(this, args);
    });
  }
}
