import { expect } from '@open-wc/testing';

import { DOMInjector } from './dom-injector.js';
import { injectables } from './injector.js';

describe('DOMInjector', () => {
  it('should attach an injector to a dom element', () => {
    const root = document.createElement('div');
    const app = new DOMInjector();

    app.attach(root);

    const injector = injectables.get(root);

    expect(injector).to.equal(app);
  });

  it('should remove an injector associated with a dom element', () => {
    const root = document.createElement('div');
    const app = new DOMInjector();

    app.attach(root);

    expect(injectables.get(root)).to.equal(app);

    app.detach(root);

    expect(injectables.get(root)).to.equal(undefined);
  });
});
