# @lit-kit/router

A simple router

#### Installation:

```BASH
npm i @lit-kit/component @lit-kit/di @lit-kit/router lit-html
```

#### Example:

```TS
import { Route, RouteCtxRef, RouteCtx, ActiveOptions, defineElement } from '@lit-kit/router';

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
  initialState: { title: 'Hello World' },
  template(state) {
    return html`
      <header>
        <h1>${state.title}</h1>
      </header>

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
