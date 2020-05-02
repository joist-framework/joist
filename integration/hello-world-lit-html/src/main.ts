import { Component, defineElement } from '@joist/component';
import { litHtml } from '@joist/component/lit-html';
import { html } from 'lit-html';

export interface AppState {
  title: string;
}

@Component<AppState>({
  providers: [litHtml()],
  state: { title: 'Hello World' },
  render({ state }) {
    return html`<h1>${state.title}</h1>`;
  },
})
export class AppComponent {}

customElements.define('app-root', defineElement(AppComponent));
