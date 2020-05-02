import {
  Component,
  StateRef,
  State,
  Prop,
  OnConnected,
  OnDisconnected,
  ElementInstance,
  defineElement,
} from '@joist/component';
import { MatchFunction, Match, MatchResult } from 'path-to-regexp';

import { Route, Router, RouterRef, RouteCtx } from '../router';

export interface RouterOutletState {
  element?: HTMLElement & { [key: string]: any };
  activeRoute?: Route;
}

@Component<RouterOutletState>({
  state: {},
  render: (ctx) => ctx.state.element,
})
export class RouterOutletComponent implements OnConnected, OnDisconnected {
  @Prop() routes: Route[] = [];

  private matchers: MatchFunction<object>[] = [];
  private removeListener?: Function;

  constructor(
    @StateRef private state: State<RouterOutletState>,
    @RouterRef private router: Router
  ) {}

  connectedCallback() {
    this.removeListener = this.router.listen(() => {
      this.check();
    });
  }

  disconnectedCallback() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  onPropChanges() {
    this.matchers = this.routes.map((route) => this.router.match(route.path));

    this.check();
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
      // Only set route context if the HTMLElement has a lit kit injector attached
      if ('componentInjector' in element) {
        const litKitComponent = element as ElementInstance<any>;

        return litKitComponent.componentInjector
          .get(RouteCtx)
          .setValue(ctx)
          .then(() => this.state.setValue({ element, activeRoute }));
      }

      return Promise.resolve();
    });
  }
}

export const RouterOutletElement = defineElement(RouterOutletComponent);
