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

    const el = testBed.create(RouterLinkElement);

    el.innerHTML = `<a href="/bar"></a>`;

    el.connectedCallback();

    expect(el.path).to.equal('/bar');
    expect(el.classList.contains('active')).to.be.true;
  });
});
