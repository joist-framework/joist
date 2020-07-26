import { State, JoistElement, component } from '@joist/component';
import { Injector } from '@joist/di';

import { RouterOutletElement, RouterOutletState } from './router_outlet.element';
import { Route } from '../router';

describe('RouterOutletComponent', () => {
  let el: RouterOutletElement;

  @component({
    render({ host }) {
      host.innerHTML = 'Hello World';
    },
  })
  class TestElement extends JoistElement {
    foo: string = 'Hello World';
  }

  customElements.define('router-outlet-component-1', TestElement);
  customElements.define('router-outlet', RouterOutletElement);

  beforeEach(() => {
    el = document.createElement('router-outlet') as RouterOutletElement;

    el.injector.parent = new Injector();

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
      expect(val.element!.foo).toBe('Hello World');
      expect(val.element!.innerHTML).toBe('Hello World');

      removeListener();
      done();
    });
  });
});
