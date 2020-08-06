import { component, JoistElement } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

export interface AppState {
  title: string;
}

@component<AppState>({
  tagName: 'app-root',
  state: {
    title: 'Hello World',
  },
  render: template(({ state }) => {
    return html`<h1>${state.title}</h1>`;
  }),
})
export class AppElement extends JoistElement {}
