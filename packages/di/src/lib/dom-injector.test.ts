import { assert } from 'chai';

import { DOMInjector } from './dom-injector.js';
import { injectables } from './injector.js';

it('should attach an injector to a dom element', () => {
  const root = document.createElement('div');
  const app = new DOMInjector();

  app.attach(root);

  const injector = injectables.get(root);

  assert.strictEqual(injector, app);
});

it('should remove an injector associated with a dom element', () => {
  const root = document.createElement('div');
  const app = new DOMInjector();

  app.attach(root);

  assert.strictEqual(injectables.get(root), app);

  app.detach(root);

  assert.strictEqual(injectables.get(root), undefined);
});
