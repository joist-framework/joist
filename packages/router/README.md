# @lit-kit/router

A simple router

#### Installation:

```BASH
npm i @lit-kit/component @lit-kit/di @lit-kit/router lit-html
```

#### Example:

```TS
import { Component, registerElement } from '@lit-kit/component';
import { Route, RouteCtxRef, RouteCtx, ActiveOptions, registerRouterElements } from '@lit-kit/router';

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
  template(state) {
    return html`
      <router-link .path=${'/'} .activeOptions=${new ActiveOptions({ pathMatch: 'full' })}>
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

customElements.define('app-root', defineElement(AppComponent));
```
