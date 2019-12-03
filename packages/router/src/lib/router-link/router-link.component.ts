import {
  Component,
  StateRef,
  State,
  Prop,
  OnPropChanges,
  ElRef,
  OnConnected,
  OnDisconnected
} from '@lit-kit/component';

import { RouterRef, Router } from '../router';

export type RouterLinkState = HTMLAnchorElement | null;

export class RouterLinkActiveOptions {
  pathMatch: 'full' | 'startsWith' = 'startsWith';
  className: string = 'active';

  constructor(seed?: Partial<RouterLinkActiveOptions>) {
    Object.assign(this, seed);
  }
}

@Component<RouterLinkState>({
  tag: 'router-link',
  initialState: null,
  useShadowDom: false,
  template: state => state
})
export class RouterLinkComponent implements OnPropChanges, OnConnected, OnDisconnected {
  @Prop() path: string = '';
  @Prop() activeOptions: RouterLinkActiveOptions = new RouterLinkActiveOptions();

  private normalizedPath: string = '';
  private removeListener?: Function;

  constructor(
    @StateRef private state: State<RouterLinkState>,
    @RouterRef private router: Router,
    @ElRef private elRef: HTMLElement
  ) {}

  connectedCallback() {
    this.removeListener = this.router.listen(() => {
      this.setActiveClass();
    });
  }

  disconnectedCallback() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  onPropChanges() {
    this.normalizedPath = this.router.normalize(this.path);

    const anchor = this.state.value || document.createElement('a');
    anchor.href = this.path;
    anchor.onclick = e => {
      e.preventDefault();

      this.router.navigate(this.path);
    };

    this.setActiveClass();

    if (!this.state.value) {
      anchor.innerHTML = this.elRef.innerHTML;
      this.state.setValue(anchor);
    }
  }

  private setActiveClass() {
    const fragment = this.router.getFragment();
    const className = this.activeOptions.className;
    const pathMatch = this.activeOptions.pathMatch;

    if (pathMatch === 'full') {
      if (fragment === this.normalizedPath) {
        this.elRef.classList.add(className);
      } else {
        this.elRef.classList.remove(className);
      }
    } else if (fragment.startsWith(this.normalizedPath)) {
      this.elRef.classList.add(className);
    } else {
      this.elRef.classList.remove(className);
    }
  }
}
