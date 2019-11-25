import { Component } from '@lit-kit/component';
import { RouterState, withRoutes } from '@lit-kit/router';
import { html } from 'lit-html';

import { Page2Component } from './page-2.component';

export interface AppState extends RouterState {
  title: string;
}

@Component<AppState>({
  tag: 'page-1-component',
  initialState: { title: 'Page1Component Works!' },
  template(state, _run) {
    return html`
      <h2>${state.title}</h2>

      ${state.activeComponent}
    `;
  },
  use: [withRoutes([{ path: '/foo/bar', component: Page2Component }])]
})
export class Page1Component {}
