import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

export interface AppState {}

@Component<AppState>({
  tag: 'app-root',
  defaultState: {},
  style: html`
    <style>
      :host {
        display: block;
      }

      h1 {
        color: red;
      }
    </style>
  `,
  template(_state, _run) {
    return html`
      <h1>Hello World</h1>
    `;
  }
})
export class AppComponent {}
