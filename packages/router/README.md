# @joist/router

A simple router

#### Installation:

```BASH
npm i @joist/di @joist/router @joist/component
```

#### Example:

```TS
import { Component, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { Route, RouteCtxRef, RouteCtx } from '@joist/router';
import { html } from 'lit-html';

const routes: Route[] = [
  // Eager component route
  { path: '/', component: () => document.createElement('page-1') },

  // Lazy component route
  { path: '/bar', component: () => import('page-2.component').then(() => document.createElement('page-2')) },

  // Child Paths
  { path: '/parent(.*)', component: () => document.createElement('parent-component')  }

  // this would be in the child component outlet
  { path: '/parent/child', component: () => document.createElement('child-component')  }
].

@Component({
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
  @Get(RouteCtx)
  private route: RouteCtx;

  connectedCallback() {
    console.log(this.route.value);

    this.route.onChanges(ctx => {
      console.log(ctx);
    })
  }
}

customElements.define('app-root', AppElement);
```
