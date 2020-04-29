import { Component, defineElement } from '@joist/component';

export interface AppState {
  title: string;
}

@Component<AppState>({
  initialState: { title: 'Hello World' },
  template({ state }) {
    const el = document.createElement('title');

    el.innerHTML = state.title;

    return el;
  },
})
export class AppComponent {}

customElements.define('app-root', defineElement(AppComponent));
