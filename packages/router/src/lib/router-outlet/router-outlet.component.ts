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

import { Route, RouterRef, Router } from '../router';
import { MatchFunction, match } from 'path-to-regexp';

export interface RouterOutletState {
  activeComponent?: ElementInstance<any, any>;
}

@Component<RouterOutletState>({
  tag: 'router-outlet',
  initialState: {},
  useShadowDom: false,
  template(state) {
    return state.activeComponent || '';
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
    this.matchers = this.routes.map(route =>
      match(this.router.normalize(route.path), { decode: decodeURIComponent })
    );

    this.check();
  }

  private check() {
    const fragment = this.router.getFragment();
    const resolved = this.matchers.find(matcher => matcher(fragment));

    if (resolved) {
      const route = this.routes[this.matchers.indexOf(resolved)];

      Promise.resolve(route.component()).then(c => {
        const activeComponent = createComponent(c);

        this.state.setValue({ activeComponent });
      });
    } else {
      this.state.setValue({ activeComponent: undefined });
    }
  }
}
