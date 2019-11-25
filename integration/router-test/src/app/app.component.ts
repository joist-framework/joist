import '@lit-kit/router/lib/lib/router-outlet.component';

import { Component } from '@lit-kit/component';
import { html } from 'lit-html';
import { Route } from '@lit-kit/router/lib/lib/router-outlet.component';

import { Page1Component } from './page-1.component';

export interface AppState {
  title: string;
}

const routes: Route[] = [{ path: '/test', component: Page1Component }];

@Component<AppState>({
  tag: 'app-root',
  initialState: { title: 'Hello World' },
  template(state, _run) {
    return html`
      <h1>${state.title}</h1>

      <lit-router-outlet .routes=${routes}></lit-router-outlet>
    `;
  }
})
export class AppComponent {}
