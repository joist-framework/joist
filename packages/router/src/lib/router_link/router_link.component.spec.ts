import { defineElement, ElementInstance, Component, State } from '@joist/component';

import { RouterLinkComponent } from './router_link.component';

describe('RouterLinkComponent', () => {
  let el: ElementInstance<TestBed>;

  @Component({
    template() {
      const el = document.createElement('router-link') as ElementInstance<any>;

      el.innerHTML = 'Hello World';
      el.path = '/foo';

      return el;
    },
  })
  class TestBed {}

  customElements.define('router-link', defineElement(RouterLinkComponent));
  customElements.define('routerlink-test', defineElement(TestBed));

  function init() {
    el = document.createElement('routerlink-test') as ElementInstance<TestBed>;

    document.body.appendChild(el);
  }

  afterEach(() => {
    document.body.removeChild(el);
    history.replaceState(null, '', '');
  });

  it('should create an anchor tag with the correct path and content', (done) => {
    init();

    const routerLinks = el.querySelectorAll('router-link');

    const first = routerLinks[0] as ElementInstance<RouterLinkComponent>;

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
    const first = routerLinks[0] as ElementInstance<RouterLinkComponent>;

    first.componentInjector.get(State).onChange(() => {
      expect(first.classList.contains('active')).toBeTrue();

      done();
    });
  });
});
