import { ElementInstance, Component, State, defineElement } from '@lit-kit/component';
import { html } from 'lit-html';

import { RouterOutletComponent, RouterOutletState } from './router_outlet.component';
import { Route } from '../router';

describe('RouterOutletComponent', () => {
  let el: ElementInstance<RouterOutletComponent, RouterOutletState>;

  @Component({ template: () => html`` })
  class One {}

  customElements.define('router-outlet-component-1', defineElement(One));
  customElements.define('router-outlet', defineElement(RouterOutletComponent));

  beforeEach(() => {
    el = document.createElement('router-outlet') as ElementInstance<
      RouterOutletComponent,
      RouterOutletState
    >;

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
    history.replaceState(null, '', '');
  });

  it('should render the correct initial route', (done) => {
    history.pushState(null, 'title', '/foo');

    el.routes = [
      { path: '/foo', component: () => document.createElement('router-outlet-component-1') },
    ] as Route[];

    const state: State<RouterOutletState> = el.componentInjector.get(State);

    const removeListener = state.onChange((val) => {
      expect(val!.tagName).toBe('ROUTER-OUTLET-COMPONENT-1');

      removeListener();
      done();
    });
  });
});
