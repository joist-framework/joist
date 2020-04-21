import './page-1.component';

import { Component, defineElement } from '@lit-kit/component';
import { Route, ActiveOptions } from '@lit-kit/router';
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

      <router-link .path=${'/'} .activeOptions=${new ActiveOptions({ pathMatch: 'full' })}>
        HOME
      </router-link>
      <router-link .path=${'/foo'}>FOO</router-link>
      <router-link .path=${'/foo/bar'}>BAR</router-link>

      <router-outlet .routes=${routes}></router-outlet>

      <footer>The Footer</footer>
    `;
  },
})
class AppComponent {}

customElements.define('app-root', defineElement(AppComponent));
