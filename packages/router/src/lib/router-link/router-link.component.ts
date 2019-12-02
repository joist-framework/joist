import { Component, StateRef, State, Prop, OnPropChanges, ElRef } from '@lit-kit/component';

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
export class RouterLinkComponent implements OnPropChanges {
  @Prop() path: string = '';

  constructor(
    @StateRef private state: State<RouterLinkState>,
    @RouterRef private router: Router,
    @ElRef private elRef: HTMLElement
  ) {}

  onPropChanges() {
    const anchor = document.createElement('a');

    anchor.href = this.path;
    anchor.innerHTML = this.elRef.innerHTML;

    anchor.onclick = e => {
      e.preventDefault();

      this.router.navigate(this.path);
    };

    this.state.setValue(anchor);
  }
}
