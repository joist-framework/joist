import { Component, defineElement } from '@joist/component';
import { html } from 'lit-html';

export interface AppState {
  title: string;
}

@Component<AppState>({
  initialState: { title: 'Page2Component Works!' },
  template({ state }) {
    return html` <h3>${state.title}</h3> `;
  },
})
class Page2Component {}

customElements.define('page-2-component', defineElement(Page2Component));
