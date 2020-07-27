import { State, JoistElement, component, defineEnvironment } from '@joist/component';

import { RouterOutletElement, RouterOutletState } from './router_outlet.element';
import { Location } from '../router';

describe('RouterOutletComponent', () => {
  customElements.define('router-outlet', RouterOutletElement);

  let el: RouterOutletElement;

  @component({
    tagName: 'router-outlet-element-1',
  })
  class TestElement extends JoistElement {}

  class MockLocation extends Location {
    getPath() {
      return '/foo';
    }
  }

  beforeEach(() => {
    defineEnvironment([{ provide: Location, use: MockLocation }]);

    el = new RouterOutletElement();

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should render the correct initial route', (done) => {
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
