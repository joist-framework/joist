import { JoistElement, component } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

export interface AppState {
  title: string;
}

@component<AppState>({
  tagName: 'page-2-component',
  state: {
    title: 'Page2Component Works!',
  },
  render: template(({ state }) => {
    return html`<h3>${state.title}</h3>`;
  }),
})
export class Page2Element extends JoistElement {}
