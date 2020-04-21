import './page-2.component';

import { Component, defineElement } from '@lit-kit/component';
import { Route } from '@lit-kit/router';
import { html } from 'lit-html';

const routes: Route[] = [
  { path: '/foo/bar', component: () => document.createElement('page-2-component') },
];

export interface AppState {
  title: string;
}

@Component<AppState>({
  initialState: { title: 'Page1Component Works!' },
  template({ state }) {
    return html`
      <h2>${state.title}</h2>

      <router-outlet .routes=${routes}></router-outlet>
    `;
  },
})
class Page1Component {}

customElements.define('page-1-component', defineElement(Page1Component));
