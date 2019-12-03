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

@Component<RouterLinkState>({
  tag: 'router-link',
  initialState: null,
  useShadowDom: false,
  template(state) {
    return state || '';
  }
})
export class RouterLinkComponent implements OnPropChanges, OnConnected, OnDisconnected {
  @Prop() path: string = '';
  @Prop() activeClass: string = 'active';

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

    const anchor = document.createElement('a');

    anchor.href = this.path;
    anchor.innerHTML = this.elRef.innerHTML;

    anchor.onclick = e => {
      e.preventDefault();

      this.router.navigate(this.path);
    };

    this.setActiveClass();

    this.state.setValue(anchor);
  }

  private setActiveClass() {
    const fragment = this.router.getFragment();

    if (fragment === '' && this.normalizedPath === '') {
      this.elRef.classList.add(this.activeClass);
    } else if (this.normalizedPath !== '' && fragment.startsWith(this.normalizedPath)) {
      this.elRef.classList.add(this.activeClass);
    } else {
      this.elRef.classList.remove(this.activeClass);
    }
  }
}
