import { JoistElement, Component } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

export interface AppState {
  title: string;
}

@Component<AppState>({
  tagName: 'page-2-component',
  state: {
    title: 'Page2Component Works!',
  },
  render: template(({ state }) => {
    return html` <h3>${state.title}</h3> `;
  }),
})
export class Page2Element extends JoistElement {}
