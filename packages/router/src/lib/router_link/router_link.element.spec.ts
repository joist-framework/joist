import { component, JoistElement } from '@joist/component';
import { defineTestBed } from '@joist/component/testing';
import { expect } from '@open-wc/testing';

import { Location } from '../router';
import { RouterLinkElement } from './router_link.element';

describe('RouterLinkComponent', () => {
  customElements.define('router-link', RouterLinkElement);

  it('should mark the router outlet with the default active class if the path matches', () => {
    const testBed = defineTestBed([
      {
        provide: Location,
        use: class extends Location {
          getPath() {
            return '/foo';
          }
        },
      },
    ]);

    const el = testBed.create(RouterLinkElement);

    el.path = '/foo';

    expect(el.classList.contains('active')).to.be.true;
  });

  it('should use the path if the first child is an anchor', () => {
    const testBed = defineTestBed([
      {
        provide: Location,
        use: class extends Location {
          getPath() {
            return '/bar';
          }
        },
      },
    ]);

    @component({
      tagName: 'router-link-test-1',
      render({ host }) {
        host.innerHTML = `
          <router-link>
            <a href="/bar">Hello</a>
          </router-link>
        `;
      },
    })
    class RouterLinkTest extends JoistElement {}

    const el = testBed.create(RouterLinkTest);
    const routerLink = el.querySelector<RouterLinkElement>('router-link');

    expect(routerLink!.path).to.equal('/bar');
    expect(routerLink!.classList.contains('active')).to.be.true;
  });
});
