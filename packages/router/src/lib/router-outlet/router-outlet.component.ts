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
    this.check();
  }

  private check() {
    const activeRoute = this.router.resolve(this.routes);

    if (activeRoute) {
      const state = Promise.resolve(activeRoute.component()).then(c => ({
        activeComponent: createComponent(c)
      }));

      this.state.setValue(state);
    } else {
      this.state.setValue({ activeComponent: undefined });
    }
  }
}
