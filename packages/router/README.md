# @lit-kit/router

A simple router using page.js as the base

#### Installation:

```BASH
npm i @lit-kit/component @lit-kit/di @lit-kit/router lit-html
```

#### Example:

```TS
import '@lit-kit/router'

import { Route, RouteCtxRef, RouteCtx, RouterLinkActiveOptions } from '@lit-kit/router';

const routes: Route[] = [
  // Eager component route
  { path: '/', component: () => Page1Component },

  // Lazy component route
  { path: '/bar', component: () => import('page-2.component').then(m => m.Page2Component) },

  // Child Paths
  { path: '/parent(.*)', component: () => Parent }

  // this would be in the child component outlet
  { path: '/parent/child', component: () => Child }
]

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

      <router-link .path=${'/'} .activeOptions=${new RouterLinkActiveOptions({ pathMatch: 'full' })}>
        Go To Foo
      </router-link>
      
      <router-link .path=${'/bar'}>Go To Bar</router-link>

      <section>
        <router-outlet .routes=${routes}></router-outlet>
      </section>

      <footer>The Footer</footer>
    `;
  }
})
export class AppComponent {
  constructor(@RouteCtxRef private route: RouteCtx) {}

  connectedCallback() {
    console.log(this.route.value);

    this.route.onChanges(ctx => {
      console.log(ctx);
    })
  }
}
```
