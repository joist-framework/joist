import { html } from 'lit-html';
import { Component, createComponent, ElementInstance, State } from '@lit-kit/component';

import './router-outlet.component';
import { RouterOutletComponent, RouterOutletState } from './router-outlet.component';

describe('RouterOutletComponent', () => {
  @Component({
    tag: 'routed-component',
    initialState: {},
    useShadowDom: false,
    template() {
      return html`
        <h1>Hello World</h1>
      `;
    }
  })
  class RoutedComponent {}

  @Component({
    tag: 'router-test',
    initialState: {},
    useShadowDom: false,
    template() {
      return html`
        <lit-router-outlet
          .routes=${[
            { path: '/test', component: RoutedComponent },
            { path: '/test/*', component: RoutedComponent },
            {
              path: '/test-promise',
              loadComponent: () => Promise.resolve(RoutedComponent)
            }
          ]}
        ></lit-router-outlet>
      `;
    }
  })
  class RouterTestComponent {}
  it('should generate the component that matches the child', done => {
    history.pushState({}, '', '/test/foo');

    const el = createComponent<RouterTestComponent, void>(RouterTestComponent);

    document.body.appendChild(el);

    const outlet = el.querySelector('lit-router-outlet') as ElementInstance<
      RouterOutletComponent,
      RouterOutletState
    >;

    outlet.componentInjector.get<State<RouterOutletState>>(State).onChange(state => {
      expect(state.activeComponent!.tagName.toLowerCase()).toEqual('routed-component');

      document.body.removeChild(el);

      done();
    });
  });

  it('should load and generate the component that matches the path', done => {
    history.pushState({}, '', '/test-promise');

    const el = createComponent<RouterTestComponent, void>(RouterTestComponent);

    document.body.appendChild(el);

    const outlet = el.querySelector('lit-router-outlet') as ElementInstance<
      RouterOutletComponent,
      RouterOutletState
    >;

    outlet.componentInjector.get<State<RouterOutletState>>(State).onChange(state => {
      expect(state.activeComponent!.tagName.toLowerCase()).toEqual('routed-component');

      document.body.removeChild(el);

      done();
    });
  });
});
