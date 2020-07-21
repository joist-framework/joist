import { defineElement, Component } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

export interface AppState {
  title: string;
}

@Component<AppState>({
  state: { title: 'Hello World' },
  render: template(({ state }) => {
    return html`<h1>${state.title}</h1>`;
  }),
})
export class AppComponent {}

customElements.define('app-root', defineElement(AppComponent));
