import { Component } from '@lit-kit/component';
import { RouterState, withRoutes } from '@lit-kit/router';
import { html } from 'lit-html';

import { Page1Component } from './page-1.component';

export interface AppState extends RouterState {
  title: string;
}

@Component<AppState>({
  tag: 'app-root',
  initialState: { title: 'Hello World' },
  template(state) {
    return html`
      <header>
        <h1>${state.title}</h1>
      </header>

      ${state.activeComponent}

      <footer>The Footer</footer>
    `;
  },
  use: [
    withRoutes([
      { path: '/foo*', component: Page1Component },
      { path: '/', redirectTo: '/foo' }
    ])
  ]
})
export class AppComponent {}
