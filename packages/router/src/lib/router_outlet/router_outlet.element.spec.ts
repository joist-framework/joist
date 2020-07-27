import { State, defineEnvironment } from '@joist/component';

import { RouterOutletElement, RouterOutletState } from './router_outlet.element';
import { Location } from '../router';

describe('RouterOutletComponent', () => {
  customElements.define('router-outlet', RouterOutletElement);

  let el: RouterOutletElement;

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

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should render the correct initial route', (done) => {
    el.routes = [{ path: '/foo', component: () => document.createElement('foo-bar') }];

    const state: State<RouterOutletState> = el.injector.get(State);

    const removeListener = state.onChange((val) => {
      expect(val.element!.tagName).toBe('FOO-BAR');

      removeListener();
      done();
    });
  });
});
