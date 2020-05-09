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
      render({ el }) {
        const link = document.createElement('router-link') as ElementInstance<any>;
        link.path = '/foo';

        el.append(link);
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
      render({ el }) {
        const routerLink = document.createElement('router-link') as ElementInstance<any>;

        const anchor = document.createElement('a');
        anchor.href = '/bar';

        routerLink.append(anchor);

        el.append(routerLink);
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
