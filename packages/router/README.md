# @joist/router

A simple, fairly naive router that can render and views it is given, whether they are JoistElements or not.

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

import { Child2Element } from './child-2.element';

const routes: Route[] = [
  // Eager component route
  { path: '/foo-1', component: () => document.createElement('child-1') },

  // Eager component route from a CustomElementConstructor
  { path: '/foo-2', component: () => Child1Element },

  // Lazy component route
  { path: '/bar-1', component: () => import('child-2.element').then(() => document.createElement('child-2')) },

  // Lazy component route
  { path: '/bar-2', component: () => import('child-2.element').then(m => m.Child2Element) },

  // Child Paths. Will Match on any router that starts with /child-1
  { path: '/child-1(.*)', component: () => Child1Element  }
];

@component({
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
export class AppElement extends JoistElement {}


@component({
  tagName: 'child-1',
  render: template(() => {
    return html`
      <h1>Hello From Child 1</h1>

      <router-outlet .routes=$[
        { path: '/child-1/child-2', component: () => Child2Element }
      ]></router-outlet>
    `
  })
})
class Child1Element extends JoistElement {
  @get(RouteCtx)
  private route: RouteCtx;

  connectedCallback() {
    super.connectedCallback();

    console.log(this.route.value);

    this.route.onChange(ctx => {
      console.log(ctx);
    })
  }
}
```
