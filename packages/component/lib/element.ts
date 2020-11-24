import { Injector, ProviderToken } from '@joist/di';

import { getEnvironmentRef } from './environment';
import { State } from './state';
import { getComponentDef, RenderCtx } from './component';
import { getComponentHandlers, Handler } from './handle';
import { Lifecycle, PropChange, OnPropChanges, HandlerCtx } from './lifecycle';

export interface InjectorBase {
  injector: Injector;
}

export const ROOT_ATTR = '__joist__injector__root__';

export interface PropChangeBase extends OnPropChanges {
  definePropChange(change: PropChange): void;
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
    $$propChanges: Map<string, PropChange> = new Map();
    $$propChange: Promise<void> | null = null;

    onPropChanges(_: PropChange[]) {}

    /**
     * Marks a property as changed
     * onPropChanges is called after all prop changes are defined.
     * This batches onPropChanges calls.
     */
    definePropChange(propChange: PropChange): Promise<void> {
      this.$$propChanges.set(propChange.key, propChange);

      if (!this.$$propChange) {
        // If there is no previous change defined set it up
        this.$$propChange = Promise.resolve().then(() => {
          // run onPropChanges here. This makes sure we capture all changes
          this.onPropChanges(Array.from(this.$$propChanges.values()));

          // reset for next time
          this.$$propChanges.clear();
          this.$$propChange = null;
        });
      }

      return this.$$propChange;
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
    run: (action: string | Symbol, payload: unknown) => (event: Event) => {
      this.notifyHandlers(event, payload, action).then((res) => {
        this.onComplete({ action, payload, event }, res);
      });
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

    if (this.componentDef.isInjectorRoot) {
      this.setAttribute(ROOT_ATTR, 'true');
    }
  }

  connectedCallback() {
    this.applyStyles();
    this.applyParentInjector();

    const state = this.injector.get(State);

    // render initial state
    this.render(state.value);

    // re-render when state changes
    state.onChange(this.render.bind(this));
  }

  onComplete(_ctx: HandlerCtx, _res: any[]) {}

  private applyParentInjector() {
    const parent = this.parentElement?.closest<JoistElement>(`[${ROOT_ATTR}]`);

    if (parent && parent.injector) {
      this.injector.parent = parent.injector;
    }
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

  /**
   * Call all handlers that match a given action
   */
  private notifyHandlers(...args: [Event, any, string | Symbol]) {
    let responses: Promise<any>[] = [];

    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlerMatches(this.handlers[i], args[2])) {
        const key = this.handlers[i].key as keyof this;
        const fn = (this[key] as any) as Function;

        responses.push(Promise.resolve(fn.apply(this, args)));
      }
    }

    return Promise.all(responses);
  }

  /**
   * Checks to see if a given handler matches the action
   */
  private handlerMatches(handler: Handler, action: string | Symbol) {
    if (handler.pattern instanceof RegExp && typeof action === 'string') {
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
