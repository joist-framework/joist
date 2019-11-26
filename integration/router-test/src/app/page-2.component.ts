import { Component } from '@lit-kit/component';
import { html } from 'lit-html';
import { OnRouteInit, RouteCtx } from '@lit-kit/router';

export interface AppState {
  title: string;
}

@Component<AppState>({
  tag: 'page-2-component',
  initialState: { title: 'Page2Component Works!' },
  template(state) {
    return html`
      <h3>${state.title}</h3>
    `;
  }
})
export class Page2Component implements OnRouteInit {
  onRouteInit(ctx: RouteCtx) {
    console.log(ctx);
  }
}
