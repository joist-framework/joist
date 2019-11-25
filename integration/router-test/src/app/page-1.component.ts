import '@lit-kit/router/lib/lib/router-outlet.component';

import { Component } from '@lit-kit/component';
import { html } from 'lit-html';
import { Page2Component } from './page-2.component';
import { Route } from '@lit-kit/router/lib/lib/router-outlet.component';

export interface AppState {
  title: string;
}

const routes: Route[] = [{ path: '/test/foo', component: Page2Component }];

@Component<AppState>({
  tag: 'page-1-component',
  initialState: { title: 'Page1Component Works!' },
  template(state, _run) {
    return html`
      <h2>${state.title}</h2>

      <lit-router-outlet .routes=${routes}></lit-router-outlet>
    `;
  }
})
export class Page1Component {}
