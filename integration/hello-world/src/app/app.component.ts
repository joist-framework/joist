import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

export interface AppState {
  title: string;
}

@Component<AppState>({
  tag: 'app-root',
  defaultState: { title: 'Hello World' },
  template(state, _run) {
    return html`
      <h1>${state.title}</h1>
    `;
  }
})
export class AppComponent {}
