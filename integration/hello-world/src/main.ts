import { component, JoistElement } from '@joist/component';

export interface AppState {
  title: string;
}

@component<AppState>({
  tagName: 'app-root',
  state: {
    title: 'Hello World',
  },
  render({ state, host }) {
    const title = document.createElement('h1');

    title.innerHTML = state.title;

    host.append(title);
  },
})
export class AppElement extends JoistElement {}
