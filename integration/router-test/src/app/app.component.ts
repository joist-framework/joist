import '@lit-kit/router';

import { Component } from '@lit-kit/component';
import { Route, ActiveOptions } from '@lit-kit/router';
import { html } from 'lit-html';

import { Page1Component } from './page-1.component';

const routes: Route[] = [{ path: '/foo(.*)', component: () => Page1Component }];

export interface AppState {
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

      <router-link .path=${'/'} .activeOptions=${new ActiveOptions({ pathMatch: 'full' })}>
        HOME
      </router-link>
      <router-link .path=${'/foo'}>FOO</router-link>
      <router-link .path=${'/foo/bar'}>BAR</router-link>

      <router-outlet .routes=${routes}></router-outlet>

      <footer>The Footer</footer>
    `;
  }
})
export class AppComponent {}
