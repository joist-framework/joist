import { defineEnvironment } from '@joist/component';
import { expect } from '@open-wc/testing';

import { Location } from '../router';
import { RouterLinkElement } from './router_link.element';

describe('RouterLinkComponent', () => {
  customElements.define('router-link', RouterLinkElement);

  it('should mark the router outlet with the default active class if the path matches', () => {
    defineEnvironment([
      {
        provide: Location,
        use: class extends Location {
          getPath() {
            return '/foo';
          }
        },
      },
    ]);

    const el = document.createElement('router-link') as RouterLinkElement;

    el.path = '/foo';

    el.connectedCallback();

    expect(el.classList.contains('active')).to.be.true;
  });

  it('should use the path if the first child is an anchor', () => {
    defineEnvironment([
      {
        provide: Location,
        use: class extends Location {
          getPath() {
            return '/bar';
          }
        },
      },
    ]);

    const el = document.createElement('router-link') as RouterLinkElement;

    el.innerHTML = `<a href="/bar"></a>`;

    el.connectedCallback();

    expect(el.path).to.equal('/bar');
    expect(el.classList.contains('active')).to.be.true;
  });
});
