import { expect } from '@open-wc/testing';

import { OnChange, PropChanges, observable, observe } from './observable';

describe('property', () => {
  it('should read the correct property definitions (decorator)', (done) => {
    @observable()
    class MyEl extends HTMLElement implements OnChange {
      @observe()
      counter = 0;

      onChange(val: PropChanges) {
        expect(val.counter.newValue).to.equal(5);

        done();
      }
    }

    customElements.define('my-el-1', MyEl);

    const el = new MyEl();

    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
  });

  it('should read the correct property definitions (decorator)', (done) => {
    class MyEl extends HTMLElement {
      static get properties() {
        return {
          counter: {},
        };
      }

      counter = 0;

      onChange(val: PropChanges) {
        expect(val.counter.newValue).to.equal(5);

        done();
      }
    }

    customElements.define('my-el-2', observable()(MyEl));

    const el = document.createElement('my-el-2') as MyEl;

    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
  });
});
