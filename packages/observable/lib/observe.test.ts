import { expect, fixture, html } from '@open-wc/testing';

import { observe } from './observe.js';

describe('observable: attr()', () => {
  it('should do stuff', async () => {
    class MyElement {
      @observe accessor hello = 'world';
    }
  });
});
