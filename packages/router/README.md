# @joist/router

A simple router

#### Installation:

```BASH
npm i @joist/di @joist/router @joist/component
```

#### Example:

```TS
import { component, get, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { Route, RouteCtxRef, RouteCtx } from '@joist/router';
import { html } from 'lit-html';

import { Page1Element } from './page-1.element'

const routes: Route[] = [
  // Eager component route
  { path: '/foo-1', component: () => document.createElement('page-1') },

  // Eager component route from a CustomElementConstructor
  { path: '/foo-2', component: () => Page1Element },

  // Lazy component route
  { path: '/bar-1', component: () => import('page-2.element').then(() => document.createElement('page-2')) },

  // Lazy component route
  { path: '/bar-2', component: () => import('page-2.element').then(m => m.Page2Element) },

  // Child Paths
  { path: '/parent(.*)', component: () => document.createElement('parent-component')  }

  // this would be in the child component outlet
  { path: '/parent/child', component: () => document.createElement('child-component')  }
].

@Component({
  tagName: 'app-root',
  render: template(() => {
    return html`
      <router-link path-match="full">
        <a href="/">Go To Home</a>
      </router-link>

      <router-link>
        <a href="/bar">Go To Bar</a>
      </router-link>

      <router-outlet .routes=${routes}></router-outlet>
    `;
  })
})
export class AppElement extends JoistElement {
  @get(RouteCtx)
  private route: RouteCtx;

  connectedCallback() {
    super.connectedCallback();

    console.log(this.route.value);

    this.route.onChanges(ctx => {
      console.log(ctx);
    })
  }
}
```
