import { Component, State, JoistElement } from '@joist/component';

import { RouterOutletElement, RouterOutletState } from './router_outlet.component';
import { Route } from '../router';

describe('RouterOutletComponent', () => {
  let el: RouterOutletElement;

  @Component({
    render({ host }) {
      host.innerHTML = 'Hello World';
    },
  })
  class One extends JoistElement {}

  customElements.define('router-outlet-component-1', One);
  customElements.define('router-outlet', RouterOutletElement);

  beforeEach(() => {
    el = document.createElement('router-outlet') as RouterOutletElement;

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
    history.replaceState(null, '', '');
  });

  it('should render the correct initial route', (done) => {
    history.pushState(null, 'title', '/foo');

    const routes: Route[] = [
      { path: '/foo', component: () => document.createElement('router-outlet-component-1') },
    ];

    el.routes = routes;

    const state: State<RouterOutletState> = el.injector.get(State);

    const removeListener = state.onChange((val) => {
      expect(val.element!.tagName).toBe('ROUTER-OUTLET-COMPONENT-1');

      removeListener();
      done();
    });
  });

  it('should render any HTMLElement', (done) => {
    history.pushState(null, 'title', '/foo');

    const routes: Route[] = [
      {
        path: '/foo',
        component: () => {
          const el = document.createElement('div');

          el.innerHTML = 'Hello World';

          return el;
        },
      },
    ];

    el.routes = routes;

    const state: State<RouterOutletState> = el.injector.get(State);

    const removeListener = state.onChange((val) => {
      expect(val.element!.innerHTML).toBe('Hello World');

      removeListener();
      done();
    });
  });
});
