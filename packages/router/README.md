# @lit-kit/router

A simple router using page.js as the base

#### Installation:

```BASH
npm i @lit-kit/component @lit-kit/di @lit-kit/router lit-html
```

#### Example:

```TS
import '@lit-kit/router'

import { Component } from '@lit-kit/component';
import { Route } from '@lit-kit/router';
import { html } from 'lit-html';

import { Page1Component } from './page-1.component';

const routes: Route[] = [
  { path: '/foo', component: () => Page1Component },
  { path: '/bar', component: () => import('page-2.component').then(m => m.Page2Component) }
]

// Your component state should extend RouterState
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

      <router-link .path=${'/foo'}></router-link>
      <router-link .path=${'/bar'}></router-link>

      <section>
        <router-outlet .routes=${routes}></router-outlet>
      </section>

      <footer>The Footer</footer>
    `;
  }
})
export class AppComponent {}
```
