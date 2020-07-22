import { JoistElement, Component } from '@joist/component';

import { RouterLinkElement } from './router_link.element';

describe('RouterLinkComponent', () => {
  customElements.define('router-link', RouterLinkElement);

  let el: HTMLElement;

  afterEach(() => {
    history.replaceState(null, '', '');
    document.body.removeChild(el);
  });

  it('should mark the router outlet with the default active class if the path matches', () => {
    @Component({
      render({ host }) {
        const link = document.createElement('router-link');

        link.setAttribute('path', '/foo');

        host.append(link);
      },
    })
    class TestBed extends JoistElement {}

    customElements.define('routerlink-test-1', TestBed);

    history.replaceState(null, '', '/foo');

    el = document.createElement('routerlink-test-1') as TestBed;

    document.body.appendChild(el);

    const routerLinks = el.querySelector('router-link') as RouterLinkElement;

    expect(routerLinks.classList.contains('active')).toBeTrue();
  });

  it('should use the path if the first child is an anchor', () => {
    @Component({
      render({ host }) {
        const routerLink = document.createElement('router-link');

        const anchor = document.createElement('a');
        anchor.href = '/bar';

        routerLink.append(anchor);

        host.append(routerLink);
      },
    })
    class TestBed extends JoistElement {}

    customElements.define('routerlink-test-2', TestBed);

    history.replaceState(null, '', '/bar');

    el = document.createElement('routerlink-test-2') as TestBed;

    document.body.appendChild(el);

    const link = el.querySelector('router-link') as RouterLinkElement;

    expect(link.path).toBe('/bar');
    expect(link.classList.contains('active')).toBeTrue();
  });
});
