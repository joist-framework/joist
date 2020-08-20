import { Injector, ProviderToken } from '@joist/di';

import { getEnvironmentRef } from './environment';
import { State } from './state';
import { getComponentDef, RenderCtx } from './component';
import { getComponentHandlers, Handler } from './handle';
import { Lifecycle, PropChange } from './lifecycle';

export interface InjectorBase {
  injector: Injector;
}

export interface PropChangeBase {
  onPropChanges(changes: PropChange[]): void;
  queuePropChange(change: PropChange): void;
}

/**
 * Takes an InjectionToken and resolves that token to a service
 */
export function get<T>(token: ProviderToken<T>) {
  return function (target: InjectorBase, key: string) {
    Object.defineProperty(target, key, {
      get(this: InjectorBase) {
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
 * Mixin that applies an prop change to a base class
 */
export function withPropChanges<T extends new (...args: any[]) => {}>(Base: T) {
  return class PropChanges extends Base implements PropChangeBase {
    propChanges: Record<string, PropChange> = {};
    propHasChanged: boolean = false;

    onPropChanges(_: PropChange[]) {}

    /**
     * Adds a PropChange to the queue.
     * PropChanges resolves as a micro task once a promise is resolved.
     * This batches onPropChanges calls
     */
    queuePropChange(propChange: PropChange) {
      this.propChanges[propChange.key] = propChange;

      if (!this.propHasChanged) {
        // mark that component props have changed and need to be process
        this.propHasChanged = true;

        Promise.resolve().then(() => {
          // run onPropChanges here. This makes sure we capture all changes
          this.onPropChanges(Object.values(this.propChanges));

          // reset for next time
          this.propHasChanged = false;
          this.propChanges = {};
        });
      }
    }
  };
}

const Base = withPropChanges(withInjector(HTMLElement));

// Cache computed constructable stylesheets
const styleCache = new Map<string, CSSStyleSheet[]>();

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
    this.applyStyles();

    const state = this.injector.get(State);

    // render initial state
    this.render(state.value);

    // re-render when state changes
    state.onChange(this.render.bind(this));
  }

  private createStyleSheet(styleString: string) {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(styleString);

    return sheet;
  }

  private render(state: any) {
    this.renderCtx.state = state;

    if (this.componentDef.render) {
      this.componentDef.render(this.renderCtx, this.componentDef);
    }
  }

  private notifyHandlers(...args: [Event, any, string]) {
    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlerMatches(this.handlers[i], args[2])) {
        const key = this.handlers[i].key as keyof this;
        const fn = (this[key] as any) as Function;

        fn.apply(this, args);
      }
    }
  }

  private handlerMatches(handler: Handler, action: string) {
    if (handler.pattern instanceof RegExp) {
      return handler.pattern.test(action);
    }

    return handler.pattern === action;
  }

  /**
   * Apply styles using Constructable StyleSheets if supported.
   * Individual renders will need to handle falling back for browsers without support.
   */
  private applyStyles() {
    if (
      this.componentDef.styles && // styles are defined
      this.shadowRoot && // element has shadowRoot
      this.shadowRoot.adoptedStyleSheets // element supports adoptedStyleSheets
    ) {
      if (!styleCache.has(this.tagName)) {
        // if styles have not previously been computed do so now
        styleCache.set(this.tagName, this.componentDef.styles.map(this.createStyleSheet));
      }

      // adpot calculated stylesheets
      this.shadowRoot.adoptedStyleSheets = styleCache.get(this.tagName) || [];
    }
  }
}
