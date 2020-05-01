import { defineElement, ElementInstance, Component } from '@joist/component';

import { RouterLinkComponent } from './router_link.component';

describe('RouterLinkComponent', () => {
  customElements.define('router-link', defineElement(RouterLinkComponent));

  let el: HTMLElement;

  afterEach(() => {
    history.replaceState(null, '', '');
    document.body.removeChild(el);
  });

  it('should mark the router outlet with the default active class if the path matches', () => {
    @Component({
      template() {
        const el = document.createElement('router-link') as ElementInstance<any>;
        el.path = '/foo';

        return el;
      },
    })
    class TestBed {}

    customElements.define('routerlink-test-1', defineElement(TestBed));

    history.replaceState(null, '', '/foo');

    el = document.createElement('routerlink-test-1') as ElementInstance<any>;

    document.body.appendChild(el);

    const routerLinks = el.querySelector('router-link');
    const first = routerLinks as ElementInstance<RouterLinkComponent>;

    expect(first.classList.contains('active')).toBeTrue();
  });

  it('should use the path if the first child is an anchor', () => {
    @Component({
      template() {
        const el = document.createElement('router-link') as ElementInstance<any>;

        const anchor = document.createElement('a');
        anchor.href = '/bar';

        el.appendChild(anchor);

        return el;
      },
    })
    class TestBed {}

    customElements.define('routerlink-test-2', defineElement(TestBed));

    history.replaceState(null, '', '/bar');

    el = document.createElement('routerlink-test-2') as ElementInstance<any>;

    document.body.appendChild(el);

    const routerLinks = el.querySelector('router-link');
    const link = routerLinks as ElementInstance<RouterLinkComponent>;

    expect(link.path).toBe('/bar');
    expect(link.classList.contains('active')).toBeTrue();
  });
});
