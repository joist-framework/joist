import { Injector } from '@joist/di';
import { expect } from '@open-wc/testing';

import { LoaderElement } from './loader.element';

describe('LoaderElement', () => {
  let el: LoaderElement;

  beforeEach(() => {
    el = new LoaderElement();

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el.injector).instanceOf(Injector);
  });
});
