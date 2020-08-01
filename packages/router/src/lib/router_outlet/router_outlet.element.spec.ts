import { State, defineEnvironment, component, JoistElement } from '@joist/component';

import { RouterOutletElement, RouterOutletState } from './router_outlet.element';
import { Location, Router } from '../router';

describe('RouterOutletComponent', () => {
  customElements.define('router-outlet', RouterOutletElement);

  @component({ tagName: 'router-outlet-test-1' })
  class MyElement extends JoistElement {}

  class MockLocation extends Location {
    private path = '/foo';

    getPath() {
      return this.path;
    }

    goTo(path: string) {
      this.path = path;
    }
  }

  let el: RouterOutletElement;
  let state: State<RouterOutletState>;

  beforeEach(() => {
    defineEnvironment([
      {
        provide: Location,
        use: MockLocation,
      },
    ]);

    el = new RouterOutletElement();
    state = el.injector.get(State);

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should render the html element when the path matches', (done) => {
    state.onChange((val) => {
      expect(val.element!.tagName).toBe('FOO-BAR');

      done();
    });

    el.routes = [{ path: '/foo', component: () => document.createElement('foo-bar') }];
  });

  it('should render the html element from a promise when the path matches', (done) => {
    state.onChange((val) => {
      expect(val.element!.tagName).toBe('FOO-BAR');

      done();
    });

    el.routes = [
      { path: '/foo', component: () => Promise.resolve(document.createElement('foo-bar')) },
    ];
  });

  it('should render a route when passed a CustomElementConstructor', (done) => {
    state.onChange((val) => {
      expect(val.element).toBeInstanceOf(MyElement);

      done();
    });

    el.routes = [{ path: '/foo', component: () => MyElement }];
  });

  it('should render a route when passed a promise resolves to a CustomElementConstructor', (done) => {
    state.onChange((val) => {
      expect(val.element).toBeInstanceOf(MyElement);

      done();
    });

    el.routes = [{ path: '/foo', component: () => Promise.resolve(MyElement) }];
  });

  it('should update the active element when the route changes', (done) => {
    let callCount = 0;

    state.onChange((val) => {
      callCount++;

      if (callCount === 2) {
        expect(val.element).toBeInstanceOf(MyElement);

        done();
      }
    });

    el.routes = [{ path: '/bar', component: () => Promise.resolve(MyElement) }];

    el.injector.get(Router).navigate('/bar');
  });
});
