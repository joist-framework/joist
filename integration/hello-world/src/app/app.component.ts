import { Component, defineElement } from '@joist/component';
import { html } from 'lit-html';

export interface AppState {
  title: string;
}

@Component<AppState>({
  initialState: { title: 'Hello World' },
  template({ state }) {
    return html` <h1>${state.title}</h1> `;
  },
})
export class AppComponent {}

customElements.define('app-root', defineElement(AppComponent));
