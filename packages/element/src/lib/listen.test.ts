import { assert } from 'chai';

import { element } from './element.js';
import { listen } from './listen.js';

describe('@listen()', () => {
  it('should add listener to an outer HTMLElement', (done) => {
    @element({
      tagName: 'listener-1'
    })
    class MyElement extends HTMLElement {
      @listen('click')
      onClick(e: Event) {
        assert.equal(e.type, 'click');

        done();
      }
    }

    const el = new MyElement();

    el.dispatchEvent(new Event('click'));
  });

  it('should add listener to the shadow root if available', (done) => {
    @element({
      tagName: 'listener-2',
      shadow: []
    })
    class MyElement extends HTMLElement {
      @listen('click')
      onClick(e: Event) {
        assert.equal(e.type, 'click');

        done();
      }
    }

    const el = new MyElement();

    el.shadowRoot!.dispatchEvent(new Event('click'));
  });

  it('should restrict argument to an event or an event subtype', (done) => {
    class CustomEvent extends Event {
      test = 'Hello World';

      constructor() {
        super('customevent');
      }
    }

    @element({
      tagName: 'listener-3'
    })
    class MyElement extends HTMLElement {
      @listen('customevent')
      onClick(e: CustomEvent) {
        assert.equal(e.type, 'customevent');

        done();
      }
    }

    const el = new MyElement();

    el.dispatchEvent(new CustomEvent());
  });

  it('should respect a provided selector function', (done) => {
    @element({
      tagName: 'listener-4',
      shadow: []
    })
    class MyElement extends HTMLElement {
      @listen('click', (host) => host)
      onClick(e: Event) {
        assert.equal(e.type, 'click');

        done();
      }
    }

    const el = new MyElement();

    el.dispatchEvent(new Event('click'));
  });
});
