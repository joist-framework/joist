import { Component } from '@lit-kit/component';
import { Route } from '@lit-kit/router';
import { html } from 'lit-html';

import { Page2Component } from './page-2.component';

const routes: Route[] = [{ path: '/foo/bar', component: () => Page2Component }];

export interface AppState {
  title: string;
}

@Component<AppState>({
  tag: 'page-1-component',
  initialState: { title: 'Page1Component Works!' },
  template(state) {
    return html`
      <h2>${state.title}</h2>

      <router-outlet .routes=${routes}></router-outlet>
    `;
  }
})
export class Page1Component {}
