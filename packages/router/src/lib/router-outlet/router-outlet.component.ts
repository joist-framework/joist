import {
  Component,
  StateRef,
  State,
  Prop,
  ElementInstance,
  createComponent,
  OnConnected,
  OnDisconnected
} from '@lit-kit/component';
import { MatchFunction, Match } from 'path-to-regexp';

import { Route, Router, RouterRef, RouteCtx } from '../router';

export interface RouterOutletState {
  activeComponent?: ElementInstance<any, any>;
}

@Component<RouterOutletState>({
  tag: 'router-outlet',
  initialState: {},
  useShadowDom: false,
  template(state) {
    return state.activeComponent;
  }
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
    this.matchers = this.routes.map(route => this.router.match(route.path));

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
      return this.resolve(route, match);
    }

    return this.state.setValue({ activeComponent: undefined });
  }

  private resolve(route: Route, ctx: Match<object>) {
    return Promise.resolve(route.component()).then(LitComponent => {
      let activeComponent = this.state.value.activeComponent;

      // only create a new instance of the component if the router-outlet is empty
      // or if the current activeComponent is NOT the same as the one being resolved
      if (!activeComponent || !(activeComponent.componentInstance instanceof LitComponent)) {
        activeComponent = createComponent(LitComponent);
      }

      return activeComponent.componentInjector
        .get(RouteCtx)
        .setValue(ctx)
        .then(() => this.state.setValue({ activeComponent }));
    });
  }
}
