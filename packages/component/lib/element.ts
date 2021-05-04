import { JoistDi } from '@joist/di/dom';

import { State } from './state';
import { getComponentDef, RenderCtx } from './component';
import { getComponentHandlers, Handler } from './handle';
import { Lifecycle, PropChange, OnPropChanges, HandlerCtx } from './lifecycle';

export interface PropChangeBase extends OnPropChanges {
  definePropChange(change: PropChange): void;
}

/**
 * Mixin that applies an prop change to a base class
 */
export function PropChanges<T extends new (...args: any[]) => {}>(Base: T) {
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

// Cache computed constructable stylesheets
const ccStyleCache = new Map<string, CSSStyleSheet[]>();

/**
 * Base Element for Joist.
 *
 * Applies an Injector and sets up state and render pipeline.
 */
export class JoistElement extends PropChanges(JoistDi(HTMLElement)) implements Lifecycle {
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
  }

  connectedCallback() {
    super.connectedCallback();

    const state = this.injector.get(State);

    // render initial state
    this.render(state.value);

    // Apply styles after first render
    this.applyStyles();

    // re-render when state changes
    state.onChange(this.render.bind(this));
  }

  disconnectedCallback() {
    this.injector.parent = undefined;
  }

  onComplete(_ctx: HandlerCtx, _res: any[]) {}

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
   */
  private applyStyles() {
    const styles = this.componentDef.styles;

    if (styles && this.shadowRoot) {
      if (this.shadowRoot.adoptedStyleSheets) {
        // adoptedStyleSheets are available
        if (!ccStyleCache.has(this.tagName)) {
          // if styles have not previously been computed do so now
          ccStyleCache.set(this.tagName, styles.map(this.createStyleSheet));
        }

        // adpot calculated stylesheets
        this.shadowRoot.adoptedStyleSheets = ccStyleCache.get(this.tagName) || [];
      } else {
        // styles are defined but Constructable stylesheets not supported
        const styleEls = styles.map(this.createStyleElement);

        this.shadowRoot.prepend(...styleEls);
      }
    }
  }

  private createStyleSheet(styleString: string) {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(styleString);

    return sheet;
  }

  private createStyleElement(styles: string) {
    const el = document.createElement('style');

    el.append(document.createTextNode(styles));

    return el;
  }
}
