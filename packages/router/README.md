# @lit-kit/router

A simple router using page.js as the base

#### Installation:

```BASH
npm i @lit-kit/component @lit-kit/di @lit-kit/router lit-html
```

#### Example:

```TS
import { Component } from '@lit-kit/component';
import { RouterState, withRoutes } from '@lit-kit/router';
import { html } from 'lit-html';

import { Page1Component } from './page-1.component';

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

      <section>
        <!-- the "outlet" is just a property that is available on the state object -->
        ${state.activeComponent}
      </section>

      <footer>The Footer</footer>
    `;
  },
  // Define your routes.
  use: [
    withRoutes([
      // Use when there are potention chid paths under /foo
      { path: '/foo*', component: Page1Component },
      
      // lazy load routes
      { path: '/bar', loadComponent: () => import('page-2.component').then(m => m.Page2Component) },
      
      { path: '/', redirectTo: '/foo' }
    ])
  ]
})
export class AppComponent {}
```
