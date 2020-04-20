import { defineElement, ElementInstance, Component, State } from '@lit-kit/component';
import { html } from 'lit-html';

import { RouterLinkComponent, RouterLinkState } from './router_link.component';

describe('RouterLinkComponent', () => {
  let el: ElementInstance<TestBed, void>;

  @Component({
    template: () => html`<router-link .path=${'/foo'}>Hello World</router-link>`,
  })
  class TestBed {}

  customElements.define('router-link', defineElement(RouterLinkComponent));
  customElements.define('routerlink-test', defineElement(TestBed));

  function init() {
    el = document.createElement('routerlink-test') as ElementInstance<TestBed, void>;

    document.body.appendChild(el);
  }

  afterEach(() => {
    document.body.removeChild(el);
    history.replaceState(null, '', '');
  });

  it('should create an anchor tag with the correct path and content', (done) => {
    init();

    const routerLinks = el.querySelectorAll('router-link');

    const first = routerLinks[0] as ElementInstance<RouterLinkComponent, RouterLinkState>;

    first.componentInjector.get(State).onChange(() => {
      const anchor = first.querySelector('a') as HTMLAnchorElement;

      expect(anchor).toBeTruthy();
      expect(anchor.innerHTML).toBe('Hello World');

      done();
    });
  });

  it('should mark the router outlet with the default active class if the path matches', (done) => {
    history.replaceState(null, '', '/foo');

    init();

    const routerLinks = el.querySelectorAll('router-link');
    const first = routerLinks[0] as ElementInstance<RouterLinkComponent, RouterLinkState>;

    first.componentInjector.get(State).onChange(() => {
      expect(first.classList.contains('active')).toBeTrue();

      done();
    });
  });
});
