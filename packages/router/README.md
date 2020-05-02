# @joist/router

A simple router

#### Installation:

```BASH
npm i @joist/component @joist/di @joist/router lit-html
```

#### Example:

```TS
import { Component, registerElement } from '@joist/component';
import { Route, RouteCtxRef, RouteCtx, ActiveOptions, registerRouterElements } from '@joist/router';

registerRouterElements();

const routes: Route[] = [
  // Eager component route
  { path: '/', component: () => document.createElement('page-1') },

  // Lazy component route
  { path: '/bar', component: () => import('page-2.component').then(() => document.createElement('page-2')) },

  // Child Paths
  { path: '/parent(.*)', component: () => document.createElement('parent-component')  }

  // this would be in the child component outlet
  { path: '/parent/child', component: () => document.createElement('child-component')  }
]

export interface AppState {
  title: string;
}

@Component<AppState>({
  render(state) {
    return html`
      <router-link .path=${'/'} .activeOptions=${new ActiveOptions({ pathMatch: 'full' })}>
                <a href="/bar">Go To Bar</a>
      </router-link>

      <router-link>
        <a href="/bar">Go To Bar</a>
      </router-link>

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

customElements.define('app-root', defineElement(AppComponent));
```
