import { Component, JoistElement } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

export interface AppState {
  title: string;
}

@Component<AppState>({
  state: {
    title: '<%= name %>',
  },
  render: template(({ state }) => {
    return html`<h1>${state.title}</h1>`;
  }),
})
export class AppElement extends JoistElement {}

customElements.define('app-root', AppElement);
