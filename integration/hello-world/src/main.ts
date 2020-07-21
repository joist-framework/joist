import { Component, defineElement } from '@joist/component';

export interface AppState {
  title: string;
}

@Component<AppState>({
  state: { title: 'Hello World' },
  render({ state, host }) {
    const el = document.createElement('h1');

    el.innerHTML = state.title;

    host.append(el);
  },
})
export class AppComponent {}

customElements.define('app-root', defineElement(AppComponent));
