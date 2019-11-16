import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

export interface AppState {
  title: string;
}

@Component<AppState>({
  tag: 'app-root',
  defaultState: { title: '<%= name %>' },
  styles: [
    `
      :host {
        display: block;
      }

      h1 {
        color: red;
      }
    `
  ],
  template(state, _run) {
    return html`
      <h1>${state.title}</h1>
    `;
  }
})
export class AppComponent {}
