import { Component, State, OnConnected, OnDisconnected, JoistElement, Get } from '@joist/component';
import { MatchFunction, Match, MatchResult } from 'path-to-regexp';

import { Route, Router, RouteCtx } from '../router';

export interface RouterOutletState {
  element?: HTMLElement & { [key: string]: any };
  activeRoute?: Route;
}

type RouterOutletLifeCycle = OnConnected & OnDisconnected;

@Component<RouterOutletState>({
  state: {},
  render({ state, host }) {
    let child = host.lastElementChild;

    while (child) {
      host.removeChild(child);

      child = host.lastElementChild;
    }

    if (state.element) {
      host.append(state.element);
    }
  },
})
export class RouterOutletElement extends JoistElement implements RouterOutletLifeCycle {
  @Get(State)
  private state!: State<RouterOutletState>;

  @Get(Router)
  private router!: Router;

  private __routes__: Route[] = [];

  set routes(val: Route[]) {
    this.__routes__ = val;

    this.matchers = this.routes.map((route) => this.router.match(route.path));

    this.check();
  }

  get routes() {
    return this.__routes__;
  }

  private matchers: MatchFunction<object>[] = [];
  private removeListener?: Function;

  connectedCallback() {
    super.connectedCallback();

    this.removeListener = this.router.listen(() => {
      this.check();
    });
  }

  disconnectedCallback() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  private check(): Promise<void> {
    const fragment = this.router.getFragment();

    let route: Route | null = null;
    let matcher: MatchFunction | null = null;
    let match: Match<object> | null = null;

    for (let i = 0; i < this.matchers.length; i++) {
      route = this.routes[i];
      matcher = this.matchers[i];
      match = matcher(fragment);

      if (match) {
        break;
      }
    }

    if (route && matcher && match) {
      if (!this.state.value.activeRoute || this.state.value.activeRoute.path !== route.path) {
        return this.resolve(route, match);
      }

      return Promise.resolve(void 0);
    }

    return this.state.setValue({});
  }

  private resolve(activeRoute: Route, ctx: MatchResult<object>) {
    return Promise.resolve(activeRoute.component()).then((element) => {
      const state = this.state.setValue({ element, activeRoute });

      // Only set route context if the HTMLElement has am injector attached
      if ('injector' in element) {
        const joistElement = element as JoistElement;
        const routeCtx = joistElement.injector.get(RouteCtx);

        return routeCtx.setValue(ctx).then(() => state);
      }

      return state;
    });
  }
}
