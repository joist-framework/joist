import { Component, StateRef, State, Prop, OnPropChanges, Handle } from '@lit-kit/component';
import { html } from 'lit-html';

import { RouterRef, Router } from '../router';

export interface RouterLinkState {
  path: string;
}

@Component<RouterLinkState>({
  tag: 'router-link',
  initialState: { path: '' },
  styles: [
    `
      a {
        display: inherit;
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
    this.state.setValue({ path: this.path });
  }

  @Handle('LINK_CLICKED') onLinkClicked(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    this.router.navigate(this.path);
  }
}
