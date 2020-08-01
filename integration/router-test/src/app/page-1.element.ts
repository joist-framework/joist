import { JoistElement, component } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { Route } from '@joist/router';
import { html } from 'lit-html';

const routes: Route[] = [
  {
    path: '/foo/bar',
    component: () => import('./page-2.element').then((m) => m.Page2Element),
  },
];

export interface AppState {
  title: string;
}

@component<AppState>({
  tagName: 'page-1-element',
  state: {
    title: 'Page1Component Works!',
  },
  render: template(({ state }) => {
    return html`
      <h2>${state.title}</h2>

      <router-link>
        <a href="/foo/bar">BAR</a>
      </router-link>

      <router-outlet .routes=${routes}></router-outlet>
    `;
  }),
})
export class Page1Element extends JoistElement {}
