import { html } from 'lit-html';
import { Component, createComponent, ElementInstance, State } from '@lit-kit/component';

import './router-outlet.component';
import { RouterOutletComponent, RouterOutletState } from './router-outlet.component';

describe('RouterOutletComponent', () => {
  @Component({
    tag: 'routed-component',
    defaultState: {},
    template() {
      return html`
        <h1>Hello World</h1>
      `;
    }
  })
  class RoutedComponent {}

  @Component({
    tag: 'router-test',
    defaultState: {},
    template() {
      return html`
        <lit-router-outlet
          .routes=${[
            { path: '/test', component: RoutedComponent },
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

  it('should generate the component that matches the path', done => {
    history.pushState({}, '', '/test');

    const el = createComponent<RouterTestComponent, void>(RouterTestComponent);
    const outlet = el.shadowRoot!.querySelector('lit-router-outlet') as ElementInstance<
      RouterOutletComponent,
      RouterOutletState
    >;

    outlet.componentInjector.get<State<RouterOutletState>>(State).onChange(state => {
      expect(state.currentComponent!.tagName.toLowerCase()).toEqual('routed-component');

      done();
    });
  });

  it('should load and generate the component that matches the path', done => {
    history.pushState({}, '', '/test-promise');

    const el = createComponent<RouterTestComponent, void>(RouterTestComponent);
    const outlet = el.shadowRoot!.querySelector('lit-router-outlet') as ElementInstance<
      RouterOutletComponent,
      RouterOutletState
    >;

    outlet.componentInjector.get<State<RouterOutletState>>(State).onChange(state => {
      expect(state.currentComponent!.tagName.toLowerCase()).toEqual('routed-component');

      done();
    });
  });
});
