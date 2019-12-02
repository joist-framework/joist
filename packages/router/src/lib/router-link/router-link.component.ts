import { Component, StateRef, State, Prop, OnPropChanges, Handle } from '@lit-kit/component';
import { html } from 'lit-html';

import { RouterRef, Router } from '../router';

export interface RouterLinkState {
  path: string;
  active: boolean;
}

@Component<RouterLinkState>({
  tag: 'router-link',
  initialState: { path: '', active: false },
  styles: [
    `
      a {
        display: inherit;
        height: inherit;
        width: inherit;
      }
    `
  ],
  template(state, run) {
    return html`
      <a .href=${state.path} @click=${run('LINK_CLICKED')}>
        <slot></slot>
      </a>
    `;
  }
})
export class RouterLinkComponent implements OnPropChanges {
  @Prop() path: string = '';

  constructor(@StateRef private state: State<RouterLinkState>, @RouterRef private router: Router) {}

  onPropChanges() {
    this.state.patchValue({ path: this.path });
  }

  @Handle('LINK_CLICKED') onLinkClicked(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    this.router.navigate(this.path);
  }
}
