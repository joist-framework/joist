import { expect } from '@open-wc/testing';

import { property } from '../decorators/property';
import { PropChanges, propChanges } from './property';

describe('property', () => {
  it('should read the correct property definitions', (done) => {
    @propChanges()
    class MyEl extends HTMLElement {
      @property()
      counter = 0;

      onPropChanges(val: PropChanges) {
        expect(val.counter.newValue).to.equal(5);

        done();
      }
    }

    customElements.define('my-el', MyEl);

    const el = new MyEl();

    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
  });
});
