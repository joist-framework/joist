import { JoistElement, component } from '@joist/component';
import { Route } from '@joist/router';
import { html } from 'lit-html';

import { Page2Element } from './page-2.element';

const routes: Route[] = [{ path: '/foo/bar', component: () => new Page2Element() }];

export interface AppState {
  title: string;
}

@component<AppState>({
  tagName: 'page-1-element',
  state: {
    title: 'Page1Component Works!',
  },
  render({ state }) {
    return html`
      <h2>${state.title}</h2>

      <router-outlet .routes=${routes}></router-outlet>
    `;
  },
})
export class Page1Element extends JoistElement {}
