import './page-1.component';

import { Component, defineElement } from '@joist/component';
import { Route, ActiveOptions } from '@joist/router';
import { html } from 'lit-html';

const routes: Route[] = [
  { path: '/foo(.*)', component: () => document.createElement('page-1-component') },
];

export interface AppState {
  title: string;
}

@Component<AppState>({
  initialState: { title: 'Hello World' },
  template({ state }) {
    return html`
      <header>
        <h1>${state.title}</h1>
      </header>

      <router-link .activeOptions=${new ActiveOptions({ pathMatch: 'full' })}>
        <a href="/">HOME</a>
      </router-link>

      <router-link>
        <a href="/foo">FOO</a>
      </router-link>

      <router-link>
        <a href="/foo/bar">BAR</a>
      </router-link>

      <router-outlet .routes=${routes}></router-outlet>

      <footer>The Footer</footer>
    `;
  },
})
class AppComponent {}

customElements.define('app-root', defineElement(AppComponent));
