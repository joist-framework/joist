import { createComponent, ElementInstance, Component, State } from '@lit-kit/component';

import { RouterOutletComponent, RouterOutletState } from './router-outlet.component';
import { Route } from '../router';

describe('RouterOutletComponent', () => {
  let el: ElementInstance<RouterOutletComponent, RouterOutletState>;

  @Component({
    tag: 'c-1',
    initialState: null,
    template() {
      return '';
    }
  })
  class One {}

  beforeEach(() => {
    el = createComponent(RouterOutletComponent);

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should render the correct initial route', done => {
    history.pushState(null, 'title', '/foo');

    el.routes = [{ path: '/foo', component: () => One }] as Route[];

    const state: State<RouterOutletState> = el.componentInjector.get(State);

    const removeListener = state.onChange(val => {
      expect(val!.tagName).toBe('C-1');

      removeListener();
      done();
    });
  });
});
