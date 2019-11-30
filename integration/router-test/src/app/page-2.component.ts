import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

export interface AppState {
  title: string;
}

@Component<AppState>({
  tag: 'page-2-component',
  initialState: { title: 'Page2Component Works!' },
  template(state) {
    return html`
      <h3>${state.title}</h3>
    `;
  }
})
export class Page2Component {}
