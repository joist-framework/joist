import { State, JoistElement, component } from '@joist/component';
import { Injector } from '@joist/di';

import { RouterOutletElement, RouterOutletState } from './router_outlet.element';

describe('RouterOutletComponent', () => {
  customElements.define('router-outlet', RouterOutletElement);

  let el: RouterOutletElement;

  @component({
    tagName: 'router-outlet-element-1',
  })
  class TestElement extends JoistElement {}

  beforeEach(() => {
    el = new RouterOutletElement();

    el.injector.parent = new Injector();

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
    history.replaceState(null, '', '');
  });

  it('should render the correct initial route', (done) => {
    history.pushState(null, 'title', '/foo');

    el.routes = [{ path: '/foo', component: () => new TestElement() }];

    const state: State<RouterOutletState> = el.injector.get(State);

    const removeListener = state.onChange((val) => {
      expect(val.element!.tagName).toBe('ROUTER-OUTLET-ELEMENT-1');

      expect(val.element).toBeInstanceOf(TestElement);

      removeListener();
      done();
    });
  });
});
