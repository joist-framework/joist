import '@joist/router';
import './page-1.component';

import { defineElement, Component } from '@joist/component';
import { Route } from '@joist/router';
import { html } from 'lit-html';

const routes: Route[] = [
  {
    path: '/test',
    component: () => {
      const el = document.createElement('div');

      el.innerHTML = 'Hello World';

      return el;
    },
  },
  { path: '/foo(.*)', component: () => document.createElement('page-1-component') },
];

export interface AppState {
  title: string;
}

@Component<AppState>({
  state: { title: 'Hello World' },
  render({ state }) {
    return html`
      <header>
        <h1>${state.title}</h1>
      </header>

      <router-link path-match="full">
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
