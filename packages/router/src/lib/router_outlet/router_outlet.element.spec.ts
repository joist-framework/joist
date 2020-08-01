import { State, defineEnvironment, component, JoistElement } from '@joist/component';

import { RouterOutletElement, RouterOutletState } from './router_outlet.element';
import { Location } from '../router';

describe('RouterOutletComponent', () => {
  customElements.define('router-outlet', RouterOutletElement);

  let el: RouterOutletElement;
  let state: State<RouterOutletState>;

  beforeEach(() => {
    defineEnvironment([
      {
        provide: Location,
        use: class MockLocation extends Location {
          getPath() {
            return '/foo';
          }
        },
      },
    ]);

    el = new RouterOutletElement();
    state = el.injector.get(State);

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should render the correct initial route', (done) => {
    state.onChange((val) => {
      expect(val.element!.tagName).toBe('FOO-BAR');

      done();
    });

    el.routes = [{ path: '/foo', component: () => document.createElement('foo-bar') }];
  });

  it('should render a routen when passed a CustomElementConstructor', (done) => {
    @component({
      tagName: 'router-outlet-test-2',
    })
    class MyElement extends JoistElement {}

    state.onChange((val) => {
      expect(val.element!.tagName.toLowerCase()).toBe('router-outlet-test-2');

      done();
    });

    el.routes = [{ path: '/foo', component: () => MyElement }];
  });
});
